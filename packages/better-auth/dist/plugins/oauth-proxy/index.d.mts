import { BetterAuthPlugin } from 'better-auth';

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

/**
 * Creates the OAuth Proxy Plugin for Better Auth
 */
declare function oAuthProxy(): BetterAuthPlugin;

export { oAuthProxy };
