'use strict';

var chunkNKDIPVEC_cjs = require('../chunk-NKDIPVEC.cjs');
require('../chunk-MUVD76IU.cjs');
var chunk2D7VGWTP_cjs = require('../chunk-2D7VGWTP.cjs');
require('../chunk-S5UORXJH.cjs');
var chunkOJX3P352_cjs = require('../chunk-OJX3P352.cjs');
require('../chunk-ME4Q5ZEC.cjs');
require('../chunk-H74YRRNV.cjs');
var chunk5E75URIA_cjs = require('../chunk-5E75URIA.cjs');
require('../chunk-CCKQSGIR.cjs');
require('../chunk-G2LZ73E2.cjs');
require('../chunk-2HPSCSV7.cjs');
require('../chunk-VXYIYABQ.cjs');
require('../chunk-PEZRSDZS.cjs');
var zod = require('zod');
var fetch = require('@better-fetch/fetch');
var jose = require('jose');

var sso = (options) => {
  return {
    id: "sso",
    endpoints: {
      createOIDCProvider: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/sso/register",
        {
          method: "POST",
          body: zod.z.object({
            providerId: zod.z.string({
              description: "The ID of the provider. This is used to identify the provider during login and callback"
            }),
            issuer: zod.z.string({
              description: "The issuer url of the provider (e.g. https://idp.example.com)"
            }),
            domain: zod.z.string({
              description: "The domain of the provider. This is used for email matching"
            }),
            clientId: zod.z.string({
              description: "The client ID"
            }),
            clientSecret: zod.z.string({
              description: "The client secret"
            }),
            authorizationEndpoint: zod.z.string({
              description: "The authorization endpoint"
            }).optional(),
            tokenEndpoint: zod.z.string({
              description: "The token endpoint"
            }).optional(),
            userInfoEndpoint: zod.z.string({
              description: "The user info endpoint"
            }).optional(),
            tokenEndpointAuthentication: zod.z.enum(["client_secret_post", "client_secret_basic"]).optional(),
            jwksEndpoint: zod.z.string({
              description: "The JWKS endpoint"
            }).optional(),
            discoveryEndpoint: zod.z.string().optional(),
            scopes: zod.z.array(zod.z.string(), {
              description: "The scopes to request. Defaults to ['openid', 'email', 'profile', 'offline_access']"
            }).optional(),
            pkce: zod.z.boolean({
              description: "Whether to use PKCE for the authorization flow"
            }).default(true).optional(),
            mapping: zod.z.object({
              id: zod.z.string({
                description: "The field in the user info response that contains the id. Defaults to 'sub'"
              }),
              email: zod.z.string({
                description: "The field in the user info response that contains the email. Defaults to 'email'"
              }),
              emailVerified: zod.z.string({
                description: "The field in the user info response that contains whether the email is verified. defaults to 'email_verified'"
              }).optional(),
              name: zod.z.string({
                description: "The field in the user info response that contains the name. Defaults to 'name'"
              }),
              image: zod.z.string({
                description: "The field in the user info response that contains the image. Defaults to 'picture'"
              }).optional(),
              extraFields: zod.z.record(zod.z.string()).optional()
            }).optional(),
            organizationId: zod.z.string({
              description: "If organization plugin is enabled, the organization id to link the provider to"
            }).optional()
          }),
          use: [chunkNKDIPVEC_cjs.sessionMiddleware],
          metadata: {
            openapi: {
              summary: "Register an OIDC provider",
              description: "This endpoint is used to register an OIDC provider. This is used to configure the provider and link it to an organization",
              responses: {
                "200": {
                  description: "The created provider"
                }
              }
            }
          }
        },
        async (ctx) => {
          const body = ctx.body;
          const issuerValidator = zod.z.string().url();
          if (issuerValidator.safeParse(body.issuer).error) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: "Invalid issuer. Must be a valid URL"
            });
          }
          const provider = await ctx.context.adapter.create({
            model: "ssoProvider",
            data: {
              issuer: body.issuer,
              domain: body.domain,
              oidcConfig: JSON.stringify({
                issuer: body.issuer,
                clientId: body.clientId,
                clientSecret: body.clientSecret,
                authorizationEndpoint: body.authorizationEndpoint,
                tokenEndpoint: body.tokenEndpoint,
                tokenEndpointAuthentication: body.tokenEndpointAuthentication,
                jwksEndpoint: body.jwksEndpoint,
                pkce: body.pkce,
                discoveryEndpoint: body.discoveryEndpoint || `${body.issuer}/.well-known/openid-configuration`,
                mapping: body.mapping,
                scopes: body.scopes,
                userinfoEndpoint: body.userInfoEndpoint
              }),
              organizationId: body.organizationId,
              userId: ctx.context.session.user.id,
              providerId: body.providerId
            }
          });
          return ctx.json({
            ...provider,
            oidcConfig: JSON.parse(provider.oidcConfig),
            redirectURI: `${ctx.context.baseURL}/sso/callback/${provider.providerId}`
          });
        }
      ),
      signInSSO: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/sign-in/sso",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "The email address to sign in with. This is used to identify the issuer to sign in with. It's optional if the issuer is provided"
            }).optional(),
            organizationSlug: zod.z.string({
              description: "The slug of the organization to sign in with"
            }).optional(),
            domain: zod.z.string({
              description: "The domain of the provider."
            }).optional(),
            callbackURL: zod.z.string({
              description: "The URL to redirect to after login"
            }),
            errorCallbackURL: zod.z.string({
              description: "The URL to redirect to after login"
            }).optional(),
            newUserCallbackURL: zod.z.string({
              description: "The URL to redirect to after login if the user is new"
            }).optional()
          }),
          metadata: {
            openapi: {
              summary: "Sign in with SSO provider",
              description: "This endpoint is used to sign in with an SSO provider. It redirects to the provider's authorization URL",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string",
                          description: "The email address to sign in with. This is used to identify the issuer to sign in with. It's optional if the issuer is provided"
                        },
                        issuer: {
                          type: "string",
                          description: "The issuer identifier, this is the URL of the provider and can be used to verify the provider and identify the provider during login. It's optional if the email is provided"
                        },
                        providerId: {
                          type: "string",
                          description: "The ID of the provider to sign in with. This can be provided instead of email or issuer"
                        },
                        callbackURL: {
                          type: "string",
                          description: "The URL to redirect to after login"
                        },
                        errorCallbackURL: {
                          type: "string",
                          description: "The URL to redirect to after login"
                        },
                        newUserCallbackURL: {
                          type: "string",
                          description: "The URL to redirect to after login if the user is new"
                        }
                      },
                      required: ["callbackURL"]
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          const body = ctx.body;
          let { email, organizationSlug, domain } = body;
          if (!email && !organizationSlug && !domain) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: "email, organizationSlug or domain is required"
            });
          }
          domain = body.domain || email?.split("@")[1];
          let orgId = "";
          if (organizationSlug) {
            orgId = await ctx.context.adapter.findOne({
              model: "organization",
              where: [
                {
                  field: "slug",
                  value: organizationSlug
                }
              ]
            }).then((res) => {
              if (!res) {
                return "";
              }
              return res.id;
            });
          }
          const provider = await ctx.context.adapter.findOne({
            model: "ssoProvider",
            where: [
              {
                field: orgId ? "organizationId" : "domain",
                value: orgId || domain
              }
            ]
          }).then((res) => {
            if (!res) {
              return null;
            }
            return {
              ...res,
              oidcConfig: JSON.parse(res.oidcConfig)
            };
          });
          if (!provider) {
            throw new chunkNKDIPVEC_cjs.APIError("NOT_FOUND", {
              message: "No provider found for the issuer"
            });
          }
          const state = await chunk5E75URIA_cjs.generateState(ctx);
          const redirectURI = `${ctx.context.baseURL}/sso/callback/${provider.providerId}`;
          const authorizationURL = await chunk2D7VGWTP_cjs.createAuthorizationURL({
            id: provider.issuer,
            options: {
              clientId: provider.oidcConfig.clientId,
              clientSecret: provider.oidcConfig.clientSecret
            },
            redirectURI,
            state: state.state,
            codeVerifier: provider.oidcConfig.pkce ? state.codeVerifier : void 0,
            scopes: ["openid", "email", "profile", "offline_access"],
            authorizationEndpoint: provider.oidcConfig.authorizationEndpoint
          });
          return ctx.json({
            url: authorizationURL.toString(),
            redirect: true
          });
        }
      ),
      callbackSSO: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/sso/callback/:providerId",
        {
          method: "GET",
          query: zod.z.object({
            code: zod.z.string().optional(),
            state: zod.z.string(),
            error: zod.z.string().optional(),
            error_description: zod.z.string().optional()
          }),
          metadata: {
            isAction: false,
            openapi: {
              summary: "Callback URL for SSO provider",
              description: "This endpoint is used as the callback URL for SSO providers. It handles the authorization code and exchanges it for an access token",
              responses: {
                "302": {
                  description: "Redirects to the callback URL"
                }
              }
            }
          }
        },
        async (ctx) => {
          const { code, state, error, error_description } = ctx.query;
          const stateData = await chunk5E75URIA_cjs.parseState(ctx);
          if (!stateData) {
            throw ctx.redirect(
              `${ctx.context.baseURL}/error?error=invalid_state`
            );
          }
          const { callbackURL, errorURL, newUserURL } = stateData;
          if (!code || error) {
            throw ctx.redirect(
              `${errorURL || callbackURL}?error=${error}&error_description=${error_description}`
            );
          }
          const provider = await ctx.context.adapter.findOne({
            model: "ssoProvider",
            where: [
              {
                field: "providerId",
                value: ctx.params.providerId
              }
            ]
          }).then((res) => {
            if (!res) {
              return null;
            }
            return {
              ...res,
              oidcConfig: JSON.parse(res.oidcConfig)
            };
          });
          if (!provider) {
            throw ctx.redirect(
              `${errorURL || callbackURL}/error?error=invalid_provider&error_description=provider not found`
            );
          }
          let config = provider.oidcConfig;
          const discovery = await fetch.betterFetch(provider.oidcConfig.discoveryEndpoint);
          if (discovery.data) {
            config = {
              tokenEndpoint: discovery.data.token_endpoint,
              tokenEndpointAuthentication: discovery.data.token_endpoint_auth_method,
              userInfoEndpoint: discovery.data.userinfo_endpoint,
              scopes: ["openid", "email", "profile", "offline_access"],
              ...provider.oidcConfig
            };
          }
          if (!config.tokenEndpoint) {
            throw ctx.redirect(
              `${errorURL || callbackURL}/error?error=invalid_provider&error_description=token_endpoint_not_found`
            );
          }
          const tokenResponse = await chunk2D7VGWTP_cjs.validateAuthorizationCode({
            code,
            codeVerifier: provider.oidcConfig.pkce ? stateData.codeVerifier : void 0,
            redirectURI: `${ctx.context.baseURL}/sso/callback/${provider.providerId}`,
            options: {
              clientId: provider.oidcConfig.clientId,
              clientSecret: provider.oidcConfig.clientSecret
            },
            tokenEndpoint: config.tokenEndpoint,
            authentication: config.tokenEndpointAuthentication === "client_secret_post" ? "post" : "basic"
          }).catch((e) => {
            if (e instanceof fetch.BetterFetchError) {
              throw ctx.redirect(
                `${errorURL || callbackURL}?error=invalid_provider&error_description=${e.message}`
              );
            }
            return null;
          });
          if (!tokenResponse) {
            throw ctx.redirect(
              `${errorURL || callbackURL}/error?error=invalid_provider&error_description=token_response_not_found`
            );
          }
          let userInfo = null;
          if (tokenResponse.idToken) {
            const idToken = jose.decodeJwt(tokenResponse.idToken);
            if (!config.jwksEndpoint) {
              throw ctx.redirect(
                `${errorURL || callbackURL}/error?error=invalid_provider&error_description=jwks_endpoint_not_found`
              );
            }
            const verified = await chunk2D7VGWTP_cjs.validateToken(
              tokenResponse.idToken,
              config.jwksEndpoint
            ).catch((e) => {
              ctx.context.logger.error(e);
              return null;
            });
            if (!verified) {
              throw ctx.redirect(
                `${errorURL || callbackURL}/error?error=invalid_provider&error_description=token_not_verified`
              );
            }
            if (verified.payload.iss !== provider.issuer) {
              throw ctx.redirect(
                `${errorURL || callbackURL}/error?error=invalid_provider&error_description=issuer_mismatch`
              );
            }
            const mapping = config.mapping || {};
            userInfo = {
              ...Object.fromEntries(
                Object.entries(mapping.extraFields || {}).map(
                  ([key, value]) => [key, verified.payload[value]]
                )
              ),
              id: idToken[mapping.id || "sub"],
              email: idToken[mapping.email || "email"],
              emailVerified: idToken[mapping.emailVerified || "email_verified"],
              name: idToken[mapping.name || "name"],
              image: idToken[mapping.image || "picture"]
            };
          }
          if (!userInfo) {
            if (!config.userInfoEndpoint) {
              throw ctx.redirect(
                `${errorURL || callbackURL}/error?error=invalid_provider&error_description=user_info_endpoint_not_found`
              );
            }
            const userInfoResponse = await fetch.betterFetch(config.userInfoEndpoint, {
              headers: {
                Authorization: `Bearer ${tokenResponse.accessToken}`
              }
            });
            if (userInfoResponse.error) {
              throw ctx.redirect(
                `${errorURL || callbackURL}/error?error=invalid_provider&error_description=${userInfoResponse.error.message}`
              );
            }
            userInfo = userInfoResponse.data;
          }
          if (!userInfo.email || !userInfo.id) {
            throw ctx.redirect(
              `${errorURL || callbackURL}/error?error=invalid_provider&error_description=missing_user_info`
            );
          }
          const linked = await chunkNKDIPVEC_cjs.handleOAuthUserInfo(ctx, {
            userInfo: {
              email: userInfo.email,
              name: userInfo.name || userInfo.email,
              id: userInfo.id,
              image: userInfo.image,
              emailVerified: userInfo.emailVerified || false
            },
            account: {
              idToken: tokenResponse.idToken,
              accessToken: tokenResponse.accessToken,
              refreshToken: tokenResponse.refreshToken,
              accountId: userInfo.id,
              providerId: provider.providerId,
              accessTokenExpiresAt: tokenResponse.accessTokenExpiresAt,
              refreshTokenExpiresAt: tokenResponse.refreshTokenExpiresAt,
              scope: tokenResponse.scopes?.join(",")
            }
          });
          if (linked.error) {
            throw ctx.redirect(
              `${errorURL || callbackURL}/error?error=${linked.error}`
            );
          }
          const { session, user } = linked.data;
          if (options?.provisionUser) {
            await options.provisionUser({
              user,
              userInfo,
              token: tokenResponse,
              provider
            });
          }
          if (provider.organizationId && !options?.organizationProvisioning?.disabled) {
            const isOrgPluginEnabled = ctx.context.options.plugins?.find(
              (plugin) => plugin.id === "organization"
            );
            if (isOrgPluginEnabled) {
              const isAlreadyMember = await ctx.context.adapter.findOne({
                model: "member",
                where: [
                  { field: "organizationId", value: provider.organizationId },
                  { field: "userId", value: user.id }
                ]
              });
              if (!isAlreadyMember) {
                const role = options?.organizationProvisioning?.getRole ? await options.organizationProvisioning.getRole({
                  user,
                  userInfo,
                  token: tokenResponse,
                  provider
                }) : options?.organizationProvisioning?.defaultRole || "member";
                await ctx.context.adapter.create({
                  model: "member",
                  data: {
                    organizationId: provider.organizationId,
                    userId: user.id,
                    role,
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date()
                  }
                });
              }
            }
          }
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            session,
            user
          });
          let toRedirectTo;
          try {
            const url = linked.isRegister ? newUserURL || callbackURL : callbackURL;
            toRedirectTo = url.toString();
          } catch {
            toRedirectTo = linked.isRegister ? newUserURL || callbackURL : callbackURL;
          }
          throw ctx.redirect(toRedirectTo);
        }
      )
    },
    schema: {
      ssoProvider: {
        fields: {
          issuer: {
            type: "string",
            required: true
          },
          oidcConfig: {
            type: "string",
            required: false
          },
          samlConfig: {
            type: "string",
            required: false
          },
          userId: {
            type: "string",
            references: {
              model: "user",
              field: "id"
            }
          },
          providerId: {
            type: "string",
            required: true,
            unique: true
          },
          organizationId: {
            type: "string",
            required: false
          },
          domain: {
            type: "string",
            required: true
          }
        }
      }
    }
  };
};

exports.sso = sso;
