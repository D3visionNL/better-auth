'use strict';

var chunkVADINYB6_cjs = require('./chunk-VADINYB6.cjs');
var chunkH2JFIDVT_cjs = require('./chunk-H2JFIDVT.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var chunkLB4ZM24Q_cjs = require('./chunk-LB4ZM24Q.cjs');
var fetch = require('@better-fetch/fetch');
var betterCall = require('better-call');
var zod = require('zod');
var jose = require('jose');

async function getUserInfo(tokens, finalUserInfoUrl) {
  if (tokens.idToken) {
    const decoded = jose.decodeJwt(tokens.idToken);
    if (decoded) {
      if (decoded.sub && decoded.email) {
        return {
          id: decoded.sub,
          emailVerified: decoded.email_verified,
          image: decoded.picture,
          ...decoded
        };
      }
    }
  }
  if (!finalUserInfoUrl) {
    return null;
  }
  const userInfo = await fetch.betterFetch(finalUserInfoUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  });
  return {
    id: userInfo.data?.sub,
    emailVerified: userInfo.data?.email_verified,
    email: userInfo.data?.email,
    image: userInfo.data?.picture,
    name: userInfo.data?.name,
    ...userInfo.data
  };
}
var genericOAuth = (options) => {
  const ERROR_CODES = {
    INVALID_OAUTH_CONFIGURATION: "Invalid OAuth configuration"
  };
  return {
    id: "generic-oauth",
    init: (ctx) => {
      const genericProviders = options.config.map((c) => {
        let finalUserInfoUrl = c.userInfoUrl;
        return {
          id: c.providerId,
          name: c.providerId,
          createAuthorizationURL(data) {
            return chunkH2JFIDVT_cjs.createAuthorizationURL({
              id: c.providerId,
              options: {
                clientId: c.clientId,
                clientSecret: c.clientSecret,
                redirectURI: c.redirectURI
              },
              authorizationEndpoint: c.authorizationUrl,
              state: data.state,
              codeVerifier: c.pkce ? data.codeVerifier : void 0,
              scopes: c.scopes || [],
              redirectURI: `${ctx.baseURL}/oauth2/callback/${c.providerId}`
            });
          },
          async validateAuthorizationCode(data) {
            let finalTokenUrl = c.tokenUrl;
            if (c.discoveryUrl) {
              const discovery = await fetch.betterFetch(c.discoveryUrl, {
                method: "GET"
              });
              if (discovery.data) {
                finalTokenUrl = discovery.data.token_endpoint;
                finalUserInfoUrl = discovery.data.userinfo_endpoint;
              }
            }
            if (!finalTokenUrl) {
              throw new betterCall.APIError("BAD_REQUEST", {
                message: "Invalid OAuth configuration. Token URL not found."
              });
            }
            return chunkH2JFIDVT_cjs.validateAuthorizationCode({
              code: data.code,
              codeVerifier: data.codeVerifier,
              redirectURI: data.redirectURI,
              options: {
                clientId: c.clientId,
                clientSecret: c.clientSecret
              },
              tokenEndpoint: finalTokenUrl
            });
          },
          async getUserInfo(tokens) {
            if (!finalUserInfoUrl) {
              return null;
            }
            const userInfo = c.getUserInfo ? await c.getUserInfo(tokens) : await getUserInfo(tokens, finalUserInfoUrl);
            if (!userInfo) {
              return null;
            }
            return {
              user: {
                id: userInfo?.id,
                email: userInfo?.email,
                emailVerified: userInfo?.emailVerified,
                image: userInfo?.image,
                name: userInfo?.name,
                ...c.mapProfileToUser?.(userInfo)
              },
              data: userInfo
            };
          }
        };
      });
      return {
        context: {
          socialProviders: genericProviders.concat(ctx.socialProviders)
        }
      };
    },
    endpoints: {
      signInWithOAuth2: chunkVADINYB6_cjs.createAuthEndpoint(
        "/sign-in/oauth2",
        {
          method: "POST",
          body: zod.z.object({
            providerId: zod.z.string({
              description: "The provider ID for the OAuth provider"
            }),
            callbackURL: zod.z.string({
              description: "The URL to redirect to after sign in"
            }).optional(),
            errorCallbackURL: zod.z.string({
              description: "The URL to redirect to if an error occurs"
            }).optional(),
            disableRedirect: zod.z.boolean({
              description: "Disable redirect"
            }).optional()
          }),
          metadata: {
            openapi: {
              description: "Sign in with OAuth2",
              responses: {
                200: {
                  description: "Sign in with OAuth2",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          url: {
                            type: "string"
                          },
                          redirect: {
                            type: "boolean"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          const { providerId } = ctx.body;
          const config = options.config.find(
            (c) => c.providerId === providerId
          );
          if (!config) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: `No config found for provider ${providerId}`
            });
          }
          const {
            discoveryUrl,
            authorizationUrl,
            tokenUrl,
            clientId,
            clientSecret,
            scopes,
            redirectURI,
            responseType,
            pkce,
            prompt,
            accessType,
            authorizationUrlParams
          } = config;
          let finalAuthUrl = authorizationUrl;
          let finalTokenUrl = tokenUrl;
          if (discoveryUrl) {
            const discovery = await fetch.betterFetch(discoveryUrl, {
              onError(context) {
                ctx.context.logger.error(context.error.message, context.error, {
                  discoveryUrl
                });
              }
            });
            if (discovery.data) {
              finalAuthUrl = discovery.data.authorization_endpoint;
              finalTokenUrl = discovery.data.token_endpoint;
            }
          }
          if (!finalAuthUrl || !finalTokenUrl) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OAUTH_CONFIGURATION
            });
          }
          if (authorizationUrlParams) {
            const withAdditionalParams = new URL(finalAuthUrl);
            for (const [paramName, paramValue] of Object.entries(
              authorizationUrlParams
            )) {
              withAdditionalParams.searchParams.set(paramName, paramValue);
            }
            finalAuthUrl = withAdditionalParams.toString();
          }
          const { state, codeVerifier } = await chunkLB4ZM24Q_cjs.generateState(ctx);
          const authUrl = await chunkH2JFIDVT_cjs.createAuthorizationURL({
            id: providerId,
            options: {
              clientId,
              clientSecret,
              redirectURI
            },
            authorizationEndpoint: finalAuthUrl,
            state,
            codeVerifier: pkce ? codeVerifier : void 0,
            scopes: scopes || [],
            redirectURI: `${ctx.context.baseURL}/oauth2/callback/${providerId}`
          });
          if (responseType && responseType !== "code") {
            authUrl.searchParams.set("response_type", responseType);
          }
          if (prompt) {
            authUrl.searchParams.set("prompt", prompt);
          }
          if (accessType) {
            authUrl.searchParams.set("access_type", accessType);
          }
          return ctx.json({
            url: authUrl.toString(),
            redirect: !ctx.body.disableRedirect
          });
        }
      ),
      oAuth2Callback: chunkVADINYB6_cjs.createAuthEndpoint(
        "/oauth2/callback/:providerId",
        {
          method: "GET",
          query: zod.z.object({
            code: zod.z.string({
              description: "The OAuth2 code"
            }).optional(),
            error: zod.z.string({
              description: "The error message, if any"
            }).optional(),
            state: zod.z.string({
              description: "The state parameter from the OAuth2 request"
            }).optional()
          }),
          metadata: {
            openapi: {
              description: "OAuth2 callback",
              responses: {
                200: {
                  description: "OAuth2 callback",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          url: {
                            type: "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          if (ctx.query.error || !ctx.query.code) {
            throw ctx.redirect(
              `${ctx.context.options.baseURL}?error=${ctx.query.error || "oAuth_code_missing"}`
            );
          }
          const provider = options.config.find(
            (p) => p.providerId === ctx.params.providerId
          );
          if (!provider) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: `No config found for provider ${ctx.params.providerId}`
            });
          }
          let tokens = void 0;
          const parsedState = await chunkLB4ZM24Q_cjs.parseState(ctx);
          const { callbackURL, codeVerifier, errorURL } = parsedState;
          const code = ctx.query.code;
          let finalTokenUrl = provider.tokenUrl;
          let finalUserInfoUrl = provider.userInfoUrl;
          if (provider.discoveryUrl) {
            const discovery = await fetch.betterFetch(provider.discoveryUrl, {
              method: "GET"
            });
            if (discovery.data) {
              finalTokenUrl = discovery.data.token_endpoint;
              finalUserInfoUrl = discovery.data.userinfo_endpoint;
            }
          }
          try {
            if (!finalTokenUrl) {
              throw new betterCall.APIError("BAD_REQUEST", {
                message: "Invalid OAuth configuration."
              });
            }
            tokens = await chunkH2JFIDVT_cjs.validateAuthorizationCode({
              code,
              codeVerifier,
              redirectURI: `${ctx.context.baseURL}/oauth2/callback/${provider.providerId}`,
              options: {
                clientId: provider.clientId,
                clientSecret: provider.clientSecret
              },
              tokenEndpoint: finalTokenUrl
            });
          } catch (e) {
            ctx.context.logger.error(
              e && typeof e === "object" && "name" in e ? e.name : "",
              e
            );
            throw ctx.redirect(
              `${errorURL}?error=oauth_code_verification_failed`
            );
          }
          if (!tokens) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: "Invalid OAuth configuration."
            });
          }
          const userInfo = provider.getUserInfo ? await provider.getUserInfo(tokens) : await getUserInfo(tokens, finalUserInfoUrl);
          if (!userInfo?.email) {
            ctx.context.logger.error("Unable to get user info", userInfo);
            throw ctx.redirect(
              `${ctx.context.baseURL}/error?error=email_is_missing`
            );
          }
          const mapUser = provider.mapProfileToUser ? await provider.mapProfileToUser(userInfo) : null;
          const result = await chunkVADINYB6_cjs.handleOAuthUserInfo(ctx, {
            userInfo: {
              ...userInfo,
              ...mapUser
            },
            account: {
              providerId: provider.providerId,
              accountId: userInfo.id,
              ...tokens,
              scope: tokens.scopes?.join(",")
            }
          });
          function redirectOnError(error) {
            throw ctx.redirect(
              `${errorURL || callbackURL || `${ctx.context.baseURL}/error`}?error=${error}`
            );
          }
          if (result.error) {
            return redirectOnError(result.error.split(" ").join("_"));
          }
          const { session, user } = result.data;
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            session,
            user
          });
          let toRedirectTo;
          try {
            const url = new URL(callbackURL);
            toRedirectTo = url.toString();
          } catch {
            toRedirectTo = callbackURL;
          }
          throw ctx.redirect(toRedirectTo);
        }
      )
    },
    $ERROR_CODES: ERROR_CODES
  };
};

exports.genericOAuth = genericOAuth;
