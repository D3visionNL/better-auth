'use strict';

const api = require('better-auth/api');
const crypto = require('better-auth/crypto');

const STATE_PREFIX = "_proxy_";
function extractProviderFromPath(path) {
  const ignoredParts = ["api", "auth", "oauth2", "callback", ""];
  for (const part of path.split("/")) {
    if (!ignoredParts.includes(part)) {
      return part;
    }
  }
  return null;
}
function findProviderByRedirectUri(redirectURI, ctx) {
  const socialProviders = ctx.context.options.socialProviders;
  for (const [name, config] of Object.entries(socialProviders)) {
    if (config.redirectURI === redirectURI) {
      return { providerName: name, provider: config };
    }
  }
  return null;
}
function oAuthProxy() {
  return {
    id: "oauth-proxy",
    hooks: {
      after: [
        {
          matcher(context) {
            return context.path?.startsWith("/sign-in/social") || context.path?.startsWith("/sign-in/oauth2");
          },
          handler: api.createAuthMiddleware(async (ctx) => {
            const logger = ctx.context.logger;
            const response = ctx.context.returned;
            if (!response?.url) {
              logger.warn("oauth-proxy: No Better Auth redirect response found");
              return;
            }
            const oauthURL = new URL(response.url);
            const redirectURI = oauthURL.searchParams.get("redirect_uri");
            if (!redirectURI) {
              logger.warn("oauth-proxy: No redirect_uri found in OAuth request");
              return;
            }
            const baseURL = ctx.context.options.baseURL || process.env.BETTER_AUTH_URL || "";
            if (redirectURI.startsWith(baseURL)) {
              logger.info("oauth-proxy: Redirect URI matches base URL, proceeding normally");
              return;
            }
            const providerResult = findProviderByRedirectUri(redirectURI, ctx);
            if (!providerResult) {
              logger.warn(
                `oauth-proxy: No matching provider found for redirectURI: ${redirectURI}`
              );
              return;
            }
            const { providerName, provider } = providerResult;
            if (!provider.clientSecret) {
              logger.warn(`oauth-proxy[${providerName}]: Provider has no client secret`);
              return;
            }
            const state = oauthURL.searchParams.get("state");
            if (!state) {
              logger.warn(`oauth-proxy[${providerName}]: No state parameter found in request`);
              return;
            }
            const proxyState = { state, baseURL };
            const encryptedPayload = await crypto.symmetricEncrypt({
              key: provider.clientSecret,
              data: JSON.stringify(proxyState)
            });
            const newState = `${STATE_PREFIX}${encryptedPayload}`;
            oauthURL.searchParams.set("state", newState);
            response.url = oauthURL.toString();
            logger.info(`oauth-proxy[${providerName}]: ${JSON.stringify(proxyState)}`);
          })
        }
      ],
      before: [
        {
          matcher(context) {
            return context.path?.startsWith("/callback") || context.path?.startsWith("/oauth2/callback");
          },
          handler: api.createAuthMiddleware(async (ctx) => {
            const logger = ctx.context.logger;
            const requestUrl = ctx.request?.url;
            if (!requestUrl) {
              logger.info("oauth-proxy: No request URL found");
              return;
            }
            const url = new URL(requestUrl);
            const state = url.searchParams.get("state");
            if (!state || !state.startsWith(STATE_PREFIX)) {
              logger.info("oauth-proxy: No proxy state parameter found, proceeding normally");
              return;
            }
            const providerName = extractProviderFromPath(String(url.pathname || ""));
            if (!providerName) {
              logger.warn(
                `oauth-proxy: Could not determine provider from callback path ${url.pathname}`
              );
              return;
            }
            const socialProviders = ctx.context.options.socialProviders;
            const provider = socialProviders[providerName];
            if (!provider || !provider.clientSecret) {
              logger.warn(`oauth-proxy[${providerName}]: No provider configuration found`);
              return;
            }
            const encryptedPayload = state.substring(STATE_PREFIX.length);
            const decryptedData = await crypto.symmetricDecrypt({
              key: provider.clientSecret,
              data: encryptedPayload
            });
            const proxyState = JSON.parse(decryptedData);
            const redirectURL = new URL(requestUrl);
            const targetURL = new URL(proxyState.baseURL);
            redirectURL.host = targetURL.host;
            redirectURL.protocol = targetURL.protocol;
            redirectURL.port = targetURL.port;
            redirectURL.searchParams.set("state", proxyState.state);
            const redirectTo = redirectURL.toString();
            logger.info(`oauth-proxy[${providerName}]: Redirecting to: ${redirectTo}`);
            throw ctx.redirect(redirectTo);
          })
        }
      ]
    }
  };
}

exports.oAuthProxy = oAuthProxy;
