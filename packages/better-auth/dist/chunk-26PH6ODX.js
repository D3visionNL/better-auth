import { createAuthEndpoint, sessionMiddleware, APIError, getSessionFromCtx } from './chunk-P6JGS32U.js';
import { parseSetCookieHeader } from './chunk-IWEXZ2ES.js';
import { generateRandomString } from './chunk-DBPOZRMS.js';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { subtle } from '@better-auth/utils';
import { APIError as APIError$1 } from 'better-call';
import { createHash } from '@better-auth/utils/hash';

// src/plugins/oidc-provider/schema.ts
var schema = {
  oauthApplication: {
    modelName: "oauthApplication",
    fields: {
      name: {
        type: "string"
      },
      icon: {
        type: "string",
        required: false
      },
      metadata: {
        type: "string",
        required: false
      },
      clientId: {
        type: "string",
        unique: true
      },
      clientSecret: {
        type: "string"
      },
      redirectURLs: {
        type: "string"
      },
      type: {
        type: "string"
      },
      disabled: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      userId: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date"
      },
      updatedAt: {
        type: "date"
      }
    }
  },
  oauthAccessToken: {
    modelName: "oauthAccessToken",
    fields: {
      accessToken: {
        type: "string",
        unique: true
      },
      refreshToken: {
        type: "string",
        unique: true
      },
      accessTokenExpiresAt: {
        type: "date"
      },
      refreshTokenExpiresAt: {
        type: "date"
      },
      clientId: {
        type: "string"
      },
      userId: {
        type: "string",
        required: false
      },
      scopes: {
        type: "string"
      },
      createdAt: {
        type: "date"
      },
      updatedAt: {
        type: "date"
      }
    }
  },
  oauthConsent: {
    modelName: "oauthConsent",
    fields: {
      clientId: {
        type: "string"
      },
      userId: {
        type: "string"
      },
      scopes: {
        type: "string"
      },
      createdAt: {
        type: "date"
      },
      updatedAt: {
        type: "date"
      },
      consentGiven: {
        type: "boolean"
      }
    }
  }
};
function redirectErrorURL(url, error, description) {
  return `${url.includes("?") ? "&" : "?"}error=${error}&error_description=${description}`;
}
async function authorize(ctx, options) {
  const opts = {
    codeExpiresIn: 600,
    defaultScope: "openid",
    ...options,
    scopes: [
      "openid",
      "profile",
      "email",
      "offline_access",
      ...options?.scopes || []
    ]
  };
  if (!ctx.request) {
    throw new APIError$1("UNAUTHORIZED", {
      error_description: "request not found",
      error: "invalid_request"
    });
  }
  const session = await getSessionFromCtx(ctx);
  if (!session) {
    await ctx.setSignedCookie(
      "oidc_login_prompt",
      JSON.stringify(ctx.query),
      ctx.context.secret,
      {
        maxAge: 600
      }
    );
    const queryFromURL = ctx.request.url?.split("?")[1];
    throw ctx.redirect(`${options.loginPage}?${queryFromURL}`);
  }
  const query = ctx.query;
  if (!query.client_id) {
    throw ctx.redirect(`${ctx.context.baseURL}/error?error=invalid_client`);
  }
  if (!query.response_type) {
    throw ctx.redirect(
      redirectErrorURL(
        `${ctx.context.baseURL}/error`,
        "invalid_request",
        "response_type is required"
      )
    );
  }
  const client = await ctx.context.adapter.findOne({
    model: "oauthApplication",
    where: [
      {
        field: "clientId",
        value: ctx.query.client_id
      }
    ]
  }).then((res) => {
    if (!res) {
      return null;
    }
    return {
      ...res,
      redirectURLs: res.redirectURLs.split(","),
      metadata: res.metadata ? JSON.parse(res.metadata) : {}
    };
  });
  if (!client) {
    throw ctx.redirect(`${ctx.context.baseURL}/error?error=invalid_client`);
  }
  const redirectURI = client.redirectURLs.find(
    (url) => url === ctx.query.redirect_uri
  );
  if (!redirectURI || !query.redirect_uri) {
    throw new APIError$1("BAD_REQUEST", {
      message: "Invalid redirect URI"
    });
  }
  if (client.disabled) {
    throw ctx.redirect(`${ctx.context.baseURL}/error?error=client_disabled`);
  }
  if (query.response_type !== "code") {
    throw ctx.redirect(
      `${ctx.context.baseURL}/error?error=unsupported_response_type`
    );
  }
  const requestScope = query.scope?.split(" ").filter((s) => s) || opts.defaultScope.split(" ");
  const invalidScopes = requestScope.filter((scope) => {
    const isInvalid = !opts.scopes.includes(scope) || scope === "offline_access" && query.prompt !== "consent";
    return isInvalid;
  });
  if (invalidScopes.length) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "invalid_scope",
        `The following scopes are invalid: ${invalidScopes.join(", ")}`
      )
    );
  }
  if ((!query.code_challenge || !query.code_challenge_method) && options.requirePKCE) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "invalid_request",
        "pkce is required"
      )
    );
  }
  if (![
    "s256",
    options.allowPlainCodeChallengeMethod ? "plain" : "s256"
  ].includes(query.code_challenge_method?.toLowerCase() || "")) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "invalid_request",
        "invalid code_challenge method"
      )
    );
  }
  const code = generateRandomString(32, "a-z", "A-Z", "0-9");
  const codeExpiresInMs = opts.codeExpiresIn * 1e3;
  const expiresAt = new Date(Date.now() + codeExpiresInMs);
  try {
    await ctx.context.internalAdapter.createVerificationValue({
      value: JSON.stringify({
        clientId: client.clientId,
        redirectURI: query.redirect_uri,
        scope: requestScope,
        userId: session.user.id,
        authTime: session.session.createdAt.getTime(),
        /**
         * If the prompt is set to `consent`, then we need
         * to require the user to consent to the scopes.
         *
         * This means the code now needs to be treated as a
         * consent request.
         *
         * once the user consents, teh code will be updated
         * with the actual code. This is to prevent the
         * client from using the code before the user
         * consents.
         */
        requireConsent: query.prompt === "consent",
        state: query.prompt === "consent" ? query.state : null,
        codeChallenge: query.code_challenge,
        codeChallengeMethod: query.code_challenge_method
      }),
      identifier: code,
      expiresAt
    });
  } catch (e) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "server_error",
        "An error occurred while processing the request"
      )
    );
  }
  const redirectURIWithCode = new URL(redirectURI);
  redirectURIWithCode.searchParams.set("code", code);
  redirectURIWithCode.searchParams.set("state", ctx.query.state);
  if (query.prompt !== "consent") {
    throw ctx.redirect(redirectURIWithCode.toString());
  }
  const hasAlreadyConsented = await ctx.context.adapter.findOne({
    model: "oauthConsent",
    where: [
      {
        field: "clientId",
        value: client.clientId
      },
      {
        field: "userId",
        value: session.user.id
      }
    ]
  }).then((res) => !!res?.consentGiven);
  if (hasAlreadyConsented) {
    throw ctx.redirect(redirectURIWithCode.toString());
  }
  if (options?.consentPage) {
    await ctx.setSignedCookie("oidc_consent_prompt", code, ctx.context.secret, {
      maxAge: 600
    });
    const conceptURI = `${options.consentPage}?client_id=${client.clientId}&scope=${requestScope.join(" ")}`;
    throw ctx.redirect(conceptURI);
  }
  const htmlFn = options?.getConsentHTML;
  if (!htmlFn) {
    throw new APIError$1("INTERNAL_SERVER_ERROR", {
      message: "No consent page provided"
    });
  }
  return new Response(
    htmlFn({
      scopes: requestScope,
      clientMetadata: client.metadata,
      clientIcon: client?.icon,
      clientId: client.clientId,
      clientName: client.name,
      code
    }),
    {
      headers: {
        "content-type": "text/html"
      }
    }
  );
}
var getMetadata = (ctx, options) => {
  const issuer = ctx.context.options.baseURL;
  const baseURL = ctx.context.baseURL;
  return {
    issuer,
    authorization_endpoint: `${baseURL}/oauth2/authorize`,
    token_endpoint: `${baseURL}/oauth2/token`,
    userInfo_endpoint: `${baseURL}/oauth2/userinfo`,
    jwks_uri: `${baseURL}/jwks`,
    registration_endpoint: `${baseURL}/oauth2/register`,
    scopes_supported: ["openid", "profile", "email", "offline_access"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code"],
    acr_values_supported: [
      "urn:mace:incommon:iap:silver",
      "urn:mace:incommon:iap:bronze"
    ],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256", "none"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post"
    ],
    claims_supported: [
      "sub",
      "iss",
      "aud",
      "exp",
      "nbf",
      "iat",
      "jti",
      "email",
      "email_verified",
      "name"
    ],
    ...options?.metadata
  };
};
var oidcProvider = (options) => {
  const modelName = {
    oauthClient: "oauthApplication",
    oauthAccessToken: "oauthAccessToken",
    oauthConsent: "oauthConsent"
  };
  const opts = {
    codeExpiresIn: 600,
    defaultScope: "openid",
    accessTokenExpiresIn: 3600,
    refreshTokenExpiresIn: 604800,
    ...options,
    scopes: [
      "openid",
      "profile",
      "email",
      "offline_access",
      ...options?.scopes || []
    ]
  };
  return {
    id: "oidc",
    hooks: {
      after: [
        {
          matcher() {
            return true;
          },
          handler: async (ctx) => {
            const cookie = await ctx.getSignedCookie(
              "oidc_login_prompt",
              ctx.context.secret
            );
            const cookieName = ctx.context.authCookies.sessionToken.name;
            const parsedSetCookieHeader = parseSetCookieHeader(
              ctx.responseHeader.get("set-cookie") || ""
            );
            const hasSessionToken = parsedSetCookieHeader.has(cookieName);
            if (!cookie || !hasSessionToken) {
              return;
            }
            ctx.setCookie("oidc_login_prompt", "", {
              maxAge: 0
            });
            const sessionCookie = parsedSetCookieHeader.get(cookieName)?.value;
            const sessionToken = sessionCookie?.split(".")[0];
            if (!sessionToken) {
              return;
            }
            const session = await ctx.context.internalAdapter.findSession(sessionToken);
            if (!session) {
              return;
            }
            ctx.query = JSON.parse(cookie);
            ctx.query.prompt = "consent";
            ctx.context.session = session;
            const response = await authorize(ctx, opts);
            return response;
          }
        }
      ]
    },
    endpoints: {
      getOpenIdConfig: createAuthEndpoint(
        "/.well-known/openid-configuration",
        {
          method: "GET"
        },
        async (ctx) => {
          const metadata = getMetadata(ctx, options);
          return metadata;
        }
      ),
      oAuth2authorize: createAuthEndpoint(
        "/oauth2/authorize",
        {
          method: "GET",
          query: z.record(z.string(), z.any())
        },
        async (ctx) => {
          return authorize(ctx, opts);
        }
      ),
      oAuthConsent: createAuthEndpoint(
        "/oauth2/consent",
        {
          method: "POST",
          body: z.object({
            accept: z.boolean()
          }),
          use: [sessionMiddleware]
        },
        async (ctx) => {
          const storedCode = await ctx.getSignedCookie(
            "oidc_consent_prompt",
            ctx.context.secret
          );
          if (!storedCode) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "No consent prompt found",
              error: "invalid_grant"
            });
          }
          const verification = await ctx.context.internalAdapter.findVerificationValue(storedCode);
          if (!verification) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "Invalid code",
              error: "invalid_grant"
            });
          }
          if (verification.expiresAt < /* @__PURE__ */ new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verification.id
            );
            throw new APIError("UNAUTHORIZED", {
              error_description: "Code expired",
              error: "invalid_grant"
            });
          }
          const value = JSON.parse(verification.value);
          if (!value.requireConsent || !value.state) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "Consent not required",
              error: "invalid_grant"
            });
          }
          if (!ctx.body.accept) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verification.id
            );
            return ctx.json({
              redirectURI: `${value.redirectURI}?error=access_denied&error_description=User denied access`
            });
          }
          const code = generateRandomString(32, "a-z", "A-Z", "0-9");
          const codeExpiresInMs = opts.codeExpiresIn * 1e3;
          const expiresAt = new Date(Date.now() + codeExpiresInMs);
          await ctx.context.internalAdapter.updateVerificationValue(
            verification.id,
            {
              value: JSON.stringify({
                ...value,
                requireConsent: false
              }),
              identifier: code,
              expiresAt
            }
          );
          await ctx.context.adapter.create({
            model: modelName.oauthConsent,
            data: {
              clientId: value.clientId,
              userId: value.userId,
              scopes: value.scope.join(" "),
              consentGiven: true,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          const redirectURI = new URL(value.redirectURI);
          redirectURI.searchParams.set("code", code);
          redirectURI.searchParams.set("state", value.state);
          return ctx.json({
            redirectURI: redirectURI.toString()
          });
        }
      ),
      oAuth2token: createAuthEndpoint(
        "/oauth2/token",
        {
          method: "POST",
          body: z.any(),
          metadata: {
            isAction: false
          }
        },
        async (ctx) => {
          let { body } = ctx;
          if (!body) {
            throw new APIError("BAD_REQUEST", {
              error_description: "request body not found",
              error: "invalid_request"
            });
          }
          if (body instanceof FormData) {
            body = Object.fromEntries(body.entries());
          }
          if (!(body instanceof Object)) {
            throw new APIError("BAD_REQUEST", {
              error_description: "request body is not an object",
              error: "invalid_request"
            });
          }
          const {
            client_id,
            client_secret,
            grant_type,
            code,
            redirect_uri,
            refresh_token,
            code_verifier
          } = body;
          if (grant_type === "refresh_token") {
            if (!refresh_token) {
              throw new APIError("BAD_REQUEST", {
                error_description: "refresh_token is required",
                error: "invalid_request"
              });
            }
            const token = await ctx.context.adapter.findOne({
              model: modelName.oauthAccessToken,
              where: [
                {
                  field: "refreshToken",
                  value: refresh_token.toString()
                }
              ]
            });
            if (!token) {
              throw new APIError("UNAUTHORIZED", {
                error_description: "invalid refresh token",
                error: "invalid_grant"
              });
            }
            if (token.clientId !== client_id?.toString()) {
              throw new APIError("UNAUTHORIZED", {
                error_description: "invalid client_id",
                error: "invalid_client"
              });
            }
            if (token.refreshTokenExpiresAt < /* @__PURE__ */ new Date()) {
              throw new APIError("UNAUTHORIZED", {
                error_description: "refresh token expired",
                error: "invalid_grant"
              });
            }
            const accessToken2 = generateRandomString(32, "a-z", "A-Z");
            const newRefreshToken = generateRandomString(32, "a-z", "A-Z");
            const accessTokenExpiresAt2 = new Date(
              Date.now() + opts.accessTokenExpiresIn * 1e3
            );
            const refreshTokenExpiresAt2 = new Date(
              Date.now() + opts.refreshTokenExpiresIn * 1e3
            );
            await ctx.context.adapter.create({
              model: modelName.oauthAccessToken,
              data: {
                accessToken: accessToken2,
                refreshToken: newRefreshToken,
                accessTokenExpiresAt: accessTokenExpiresAt2,
                refreshTokenExpiresAt: refreshTokenExpiresAt2,
                clientId: client_id.toString(),
                userId: token.userId,
                scopes: token.scopes,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              }
            });
            return ctx.json({
              access_token: accessToken2,
              token_type: "bearer",
              expires_in: opts.accessTokenExpiresIn,
              refresh_token: newRefreshToken,
              scope: token.scopes
            });
          }
          if (!code) {
            throw new APIError("BAD_REQUEST", {
              error_description: "code is required",
              error: "invalid_request"
            });
          }
          if (options.requirePKCE && !code_verifier) {
            throw new APIError("BAD_REQUEST", {
              error_description: "code verifier is missing",
              error: "invalid_request"
            });
          }
          const verificationValue = await ctx.context.internalAdapter.findVerificationValue(
            code.toString()
          );
          if (!verificationValue) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "invalid code",
              error: "invalid_grant"
            });
          }
          if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verificationValue.id
            );
            throw new APIError("UNAUTHORIZED", {
              error_description: "code expired",
              error: "invalid_grant"
            });
          }
          await ctx.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          if (!client_id || !client_secret) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "client_id and client_secret are required",
              error: "invalid_client"
            });
          }
          if (!grant_type) {
            throw new APIError("BAD_REQUEST", {
              error_description: "grant_type is required",
              error: "invalid_request"
            });
          }
          if (grant_type !== "authorization_code") {
            throw new APIError("BAD_REQUEST", {
              error_description: "grant_type must be 'authorization_code'",
              error: "unsupported_grant_type"
            });
          }
          if (!redirect_uri) {
            throw new APIError("BAD_REQUEST", {
              error_description: "redirect_uri is required",
              error: "invalid_request"
            });
          }
          const client = await ctx.context.adapter.findOne({
            model: modelName.oauthClient,
            where: [{ field: "clientId", value: client_id.toString() }]
          }).then((res) => {
            if (!res) {
              return null;
            }
            return {
              ...res,
              redirectURLs: res.redirectURLs.split(","),
              metadata: res.metadata ? JSON.parse(res.metadata) : {}
            };
          });
          if (!client) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "invalid client_id",
              error: "invalid_client"
            });
          }
          if (client.disabled) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "client is disabled",
              error: "invalid_client"
            });
          }
          const isValidSecret = client.clientSecret === client_secret.toString();
          if (!isValidSecret) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "invalid client_secret",
              error: "invalid_client"
            });
          }
          const value = JSON.parse(
            verificationValue.value
          );
          if (value.clientId !== client_id.toString()) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "invalid client_id",
              error: "invalid_client"
            });
          }
          if (value.redirectURI !== redirect_uri.toString()) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "invalid redirect_uri",
              error: "invalid_client"
            });
          }
          if (value.codeChallenge && !code_verifier) {
            throw new APIError("BAD_REQUEST", {
              error_description: "code verifier is missing",
              error: "invalid_request"
            });
          }
          const challenge = value.codeChallengeMethod === "plain" ? code_verifier : await createHash("SHA-256", "base64urlnopad").digest(
            code_verifier
          );
          if (challenge !== value.codeChallenge) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "code verification failed",
              error: "invalid_request"
            });
          }
          const requestedScopes = value.scope;
          await ctx.context.internalAdapter.deleteVerificationValue(
            code.toString()
          );
          const accessToken = generateRandomString(32, "a-z", "A-Z");
          const refreshToken = generateRandomString(32, "A-Z", "a-z");
          const accessTokenExpiresAt = new Date(
            Date.now() + opts.accessTokenExpiresIn * 1e3
          );
          const refreshTokenExpiresAt = new Date(
            Date.now() + opts.refreshTokenExpiresIn * 1e3
          );
          await ctx.context.adapter.create({
            model: modelName.oauthAccessToken,
            data: {
              accessToken,
              refreshToken,
              accessTokenExpiresAt,
              refreshTokenExpiresAt,
              clientId: client_id.toString(),
              userId: value.userId,
              scopes: requestedScopes.join(" "),
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          const user = await ctx.context.internalAdapter.findUserById(
            value.userId
          );
          if (!user) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "user not found",
              error: "invalid_grant"
            });
          }
          let secretKey = {
            alg: "HS256",
            key: await subtle.generateKey(
              {
                name: "HMAC",
                hash: "SHA-256"
              },
              true,
              ["sign", "verify"]
            )
          };
          const profile = {
            given_name: user.name.split(" ")[0],
            family_name: user.name.split(" ")[1],
            name: user.name,
            profile: user.image,
            updated_at: user.updatedAt.toISOString()
          };
          const email = {
            email: user.email,
            email_verified: user.emailVerified
          };
          const userClaims = {
            ...requestedScopes.includes("profile") ? profile : {},
            ...requestedScopes.includes("email") ? email : {}
          };
          const idToken = await new SignJWT({
            sub: user.id,
            aud: client_id.toString(),
            iat: Date.now(),
            auth_time: ctx.context.session?.session.createdAt.getTime(),
            nonce: body.nonce,
            acr: "urn:mace:incommon:iap:silver",
            // default to silver - ⚠︎ this should be configurable and should be validated against the client's metadata
            ...userClaims
          }).setProtectedHeader({ alg: secretKey.alg }).setIssuedAt().setExpirationTime(
            Math.floor(Date.now() / 1e3) + opts.accessTokenExpiresIn
          ).sign(secretKey.key);
          return ctx.json(
            {
              access_token: accessToken,
              token_type: "Bearer",
              expires_in: opts.accessTokenExpiresIn,
              refresh_token: requestedScopes.includes("offline_access") ? refreshToken : void 0,
              scope: requestedScopes.join(" "),
              id_token: requestedScopes.includes("openid") ? idToken : void 0
            },
            {
              headers: {
                "Cache-Control": "no-store",
                Pragma: "no-cache"
              }
            }
          );
        }
      ),
      oAuth2userInfo: createAuthEndpoint(
        "/oauth2/userinfo",
        {
          method: "GET",
          metadata: {
            isAction: false
          }
        },
        async (ctx) => {
          if (!ctx.request) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "request not found",
              error: "invalid_request"
            });
          }
          const authorization = ctx.request.headers.get("authorization");
          if (!authorization) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "authorization header not found",
              error: "invalid_request"
            });
          }
          const token = authorization.replace("Bearer ", "");
          const accessToken = await ctx.context.adapter.findOne({
            model: modelName.oauthAccessToken,
            where: [
              {
                field: "accessToken",
                value: token
              }
            ]
          });
          if (!accessToken) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "invalid access token",
              error: "invalid_token"
            });
          }
          if (accessToken.accessTokenExpiresAt < /* @__PURE__ */ new Date()) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "The Access Token expired",
              error: "invalid_token"
            });
          }
          const user = await ctx.context.internalAdapter.findUserById(
            accessToken.userId
          );
          if (!user) {
            throw new APIError("UNAUTHORIZED", {
              error_description: "user not found",
              error: "invalid_token"
            });
          }
          const requestedScopes = accessToken.scopes.split(" ");
          const userClaims = {
            email: requestedScopes.includes("email") ? user.email : void 0,
            name: requestedScopes.includes("profile") ? user.name : void 0,
            picture: requestedScopes.includes("profile") ? user.image : void 0,
            given_name: requestedScopes.includes("profile") ? user.name.split(" ")[0] : void 0,
            family_name: requestedScopes.includes("profile") ? user.name.split(" ")[1] : void 0,
            email_verified: requestedScopes.includes("email") ? user.emailVerified : void 0
          };
          return ctx.json(userClaims);
        }
      ),
      registerOAuthApplication: createAuthEndpoint(
        "/oauth2/register",
        {
          method: "POST",
          body: z.object({
            name: z.string(),
            icon: z.string().optional(),
            metadata: z.record(z.any()).optional(),
            redirectURLs: z.array(z.string())
          })
        },
        async (ctx) => {
          const body = ctx.body;
          const session = await getSessionFromCtx(ctx);
          if (!session && !options.allowDynamicClientRegistration) {
            throw new APIError("UNAUTHORIZED", {
              message: "Unauthorized"
            });
          }
          const clientId = options.generateClientId?.() || generateRandomString(32, "a-z", "A-Z");
          const clientSecret = options.generateClientSecret?.() || generateRandomString(32, "a-z", "A-Z");
          const client = await ctx.context.adapter.create({
            model: modelName.oauthClient,
            data: {
              name: body.name,
              icon: body.icon,
              metadata: body.metadata ? JSON.stringify(body.metadata) : null,
              clientId,
              clientSecret,
              redirectURLs: body.redirectURLs.join(","),
              type: "web",
              authenticationScheme: "client_secret",
              disabled: false,
              userId: session?.session.userId,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          return ctx.json({
            ...client,
            redirectURLs: client.redirectURLs.split(","),
            metadata: client.metadata ? JSON.parse(client.metadata) : null
          });
        }
      ),
      getOAuthClient: createAuthEndpoint(
        "/oauth2/client/:id",
        {
          method: "GET",
          use: [sessionMiddleware]
        },
        async (ctx) => {
          const client = await ctx.context.adapter.findOne(
            {
              model: modelName.oauthClient,
              where: [{ field: "clientId", value: ctx.params.id }]
            }
          );
          if (!client) {
            throw new APIError("NOT_FOUND", {
              error_description: "client not found",
              error: "not_found"
            });
          }
          return ctx.json({
            clientId: client.clientId,
            name: client.name,
            icon: client.icon
          });
        }
      )
    },
    schema
  };
};

export { oidcProvider };
