/**
 * OAuth Proxy Plugin for Better Auth
 *
 * This plugin enables OAuth flows to work across multiple environments (dev,
 * staging, production) without requiring shared databases or additional shared
 * secrets. It acts as a "smart router" that intercepts OAuth requests and
 * responses to transparently route them between originating servers and OAuth
 * providers.
 *
 * ## How It Works
 *
 * ### Stage 1: Request Interception (Originating Server)
 *
 * When an OAuth sign-in flow is initiated on any server (dev, staging, etc.):
 * 1. Better Auth generates a standard persisted state parameter
 * 2. Better Auth creates the OAuth sign-in request with the state parameter
 * 3. The plugin's `after` hook intercepts the OAuth sign-in response
 * 4. Plugin extracts the `redirectURI` from the OAuth request URL
 * 5. If the `redirectURI` matches the configured app's baseURL, the plugin does
 *    nothing and lets the service act normally, as it's not a request that
 *    requires proxying.
 * 6. Plugin matches the `redirectURI` against configured social provider
 *    redirect URIs
 * 7. Plugin gets the corresponding provider's client secret
 * 8. Plugin creates a JSON payload containing original state ID and originating
 *    server's baseURL
 * 9. Plugin symmetrically encrypts the JSON payload using the provider's client
 *    secret, as this secret already needs to be shared with the proxy server.
 * 10. Plugin replaces the state parameter with `_proxy_` + encrypted payload
 * 11. OAuth request proceeds to the provider with the encrypted state
 *
 * ### Stage 2: Callback Interception (Proxy Server)
 *
 * When the OAuth provider redirects back to the proxy server:
 * 1. Plugin's `before` hook intercepts the callback request
 * 2. If the state parameter doesn't start with `_proxy_`, the plugin does
 *    nothing and lets normal OAuth processing continue
 * 3. Plugin extracts the provider from the callback path
 * 4. Plugin gets that provider's client secret from config
 * 5. Plugin symmetrically decrypts the state parameter using the provider's
 *    secret
 * 6. If valid, plugin extracts original state ID and originating server's
 *    baseURL
 * 7. Plugin reconstructs the redirect URL with the original state
 * 8. Plugin redirects to the originating server, bypassing normal OAuth
 *    processing
 *
 * ## Security Considerations
 *
 * - Payload is symmetrically encrypted using the OAuth provider's client secret
 * - Each provider uses its own secret for its flows
 * - No additional shared secrets required
 * - OAuth flow's own expiration mechanism handles timing
 */
import type { BetterAuthPlugin } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { symmetricDecrypt, symmetricEncrypt } from 'better-auth/crypto';

// The prefix to append to the state parameter to indicate it's a proxy state
// This allows the production service to identify state parameters for proxied
// services vs its own standard state parameters.
const STATE_PREFIX = '_proxy_';

/**
 * Interface for the encrypted OAuth proxy state payload.
 *
 * This information will be encoded as a state parameter when relying on the
 * proxy server to route the OAuth flow back to the originating server. The
 * proxy server will use this information to reconstruct the redirect URL and
 * redirect the user back to the originating server's OAuth redirect endpoint.
 */
interface OAuthProxyState {
  // The original persisted state ID
  state: string;
  // The originating server's callback URL
  baseURL: string;
}

/**
 * Interface for Better Auth redirect responses for middleware plugins.
 *
 * The payload received as part of an `after` hook can take many forms, but if
 * it matches this interface, it can be used to forward the OAuth flow to a
 * proxy server.
 */
interface BetterAuthResponse {
  // The OAuth provider's authentication URL.
  url: string;
}

/**
 * Interface for Better Auth context
 */
interface MiddlewareContext {
  context: {
    options: {
      socialProviders: Record<string, { clientSecret: string; redirectURI: string }>;
    };
  };
}

/**
 * Extracts the provider name from a callback URL path
 */
function extractProviderFromPath(path: string): string | null {
  // Iterate over the parts and return the first one that isn't one of the
  // following:
  // - api
  // - auth
  // - oauth2
  // - callback
  const ignoredParts = ['api', 'auth', 'oauth2', 'callback', ''];
  for (const part of path.split('/')) {
    if (!ignoredParts.includes(part)) {
      return part;
    }
  }
  return null;
}

/**
 * Finds a provider by matching its redirect URI
 */
function findProviderByRedirectUri(
  redirectURI: string,
  ctx: MiddlewareContext,
): { providerName: string; provider: { clientSecret: string; redirectURI: string } } | null {
  const socialProviders = ctx.context.options.socialProviders;

  for (const [name, config] of Object.entries(socialProviders)) {
    if (config.redirectURI === redirectURI) {
      return { providerName: name, provider: config };
    }
  }
  return null;
}

/**
 * Creates the OAuth Proxy Plugin for Better Auth
 */
export function oAuthProxy(): BetterAuthPlugin {
  return {
    id: 'oauth-proxy',
    hooks: {
      after: [
        {
          matcher(context) {
            return (
              context.path?.startsWith('/sign-in/social') ||
              context.path?.startsWith('/sign-in/oauth2')
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const logger = ctx.context.logger;

            // Check for Better Auth response format
            const response = ctx.context.returned as BetterAuthResponse;
            if (!response?.url) {
              logger.warn('oauth-proxy: No Better Auth redirect response found');
              return;
            }

            // Parse the OAuth URL to extract parameters
            const oauthURL = new URL(response.url);

            const redirectURI = oauthURL.searchParams.get('redirect_uri');

            if (!redirectURI) {
              logger.warn('oauth-proxy: No redirect_uri found in OAuth request');
              return;
            }

            // Check if this is our own callback URL (let it proceed normally)
            const baseURL = ctx.context.options.baseURL || process.env.BETTER_AUTH_URL || '';
            if (redirectURI.startsWith(baseURL)) {
              logger.info('oauth-proxy: Redirect URI matches base URL, proceeding normally');
              return;
            }

            // Find the corresponding provider configuration by matching redirectURI
            const providerResult = findProviderByRedirectUri(redirectURI, ctx as MiddlewareContext);
            if (!providerResult) {
              logger.warn(
                `oauth-proxy: No matching provider found for redirectURI: ${redirectURI}`,
              );
              return;
            }

            const { providerName, provider } = providerResult;
            if (!provider.clientSecret) {
              logger.warn(`oauth-proxy[${providerName}]: Provider has no client secret`);
              return;
            }

            // Get the original state parameter
            const state = oauthURL.searchParams.get('state');
            if (!state) {
              logger.warn(`oauth-proxy[${providerName}]: No state parameter found in request`);
              return;
            }

            // Create the proxy state payload
            const proxyState: OAuthProxyState = { state, baseURL };

            // Encrypt the payload using the provider's client secret
            const encryptedPayload = await symmetricEncrypt({
              key: provider.clientSecret,
              data: JSON.stringify(proxyState),
            });

            // Replace the state parameter with the encrypted proxy state
            const newState = `${STATE_PREFIX}${encryptedPayload}`;
            oauthURL.searchParams.set('state', newState);

            // Update the original response URL
            response.url = oauthURL.toString();
            logger.info(`oauth-proxy[${providerName}]: ${JSON.stringify(proxyState)}`);
          }),
        },
      ],

      before: [
        {
          matcher(context) {
            return (
              context.path?.startsWith('/callback') || context.path?.startsWith('/oauth2/callback')
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            const logger = ctx.context.logger;

            // Get the state parameter from the request
            const requestUrl = ctx.request?.url;
            if (!requestUrl) {
              logger.info('oauth-proxy: No request URL found');
              return;
            }

            const url = new URL(requestUrl);
            const state = url.searchParams.get('state');
            if (!state || !state.startsWith(STATE_PREFIX)) {
              logger.info('oauth-proxy: No proxy state parameter found, proceeding normally');
              return;
            }

            // Extract the provider from the callback path
            const providerName = extractProviderFromPath(String(url.pathname || ''));
            if (!providerName) {
              logger.warn(
                `oauth-proxy: Could not determine provider from callback path ${url.pathname}`,
              );
              return;
            }

            // Get the provider configuration
            const socialProviders = ctx.context.options.socialProviders as Record<
              string,
              { clientSecret: string; redirectURI: string }
            >;
            const provider = socialProviders[providerName];

            if (!provider || !provider.clientSecret) {
              logger.warn(`oauth-proxy[${providerName}]: No provider configuration found`);
              return;
            }

            // Extract and decrypt the proxy state
            const encryptedPayload = state.substring(STATE_PREFIX.length);
            const decryptedData = await symmetricDecrypt({
              key: provider.clientSecret,
              data: encryptedPayload,
            });

            const proxyState: OAuthProxyState = JSON.parse(decryptedData);

            // Reconstruct the redirect URL with the original state
            const redirectURL = new URL(requestUrl);
            const targetURL = new URL(proxyState.baseURL);

            // Replace host and path with the target service
            redirectURL.host = targetURL.host;
            redirectURL.protocol = targetURL.protocol;
            redirectURL.port = targetURL.port;

            // Set the original state parameter
            redirectURL.searchParams.set('state', proxyState.state);
            const redirectTo = redirectURL.toString();

            logger.info(`oauth-proxy[${providerName}]: Redirecting to: ${redirectTo}`);

            // Return a redirect response
            throw ctx.redirect(redirectTo);
          }),
        },
      ],
    },
  };
}