import { SocialProviderListEnum, socialProviderList } from './chunk-PQWBVZN5.js';
import { getHost, getProtocol, getOrigin } from './chunk-XFCIANZX.js';
import { setSessionCookie, deleteSessionCookie, setCookieCache } from './chunk-IWEXZ2ES.js';
import { safeJSONParse, parseUserInput, getIp } from './chunk-MEZ6VLJL.js';
import { HIDE_METADATA, generateId, logger } from './chunk-KLDFBLYL.js';
import { generateState, parseState } from './chunk-NPO64SVN.js';
import { generateRandomString, signJWT } from './chunk-DBPOZRMS.js';
import { getDate } from './chunk-FURNA6HY.js';
import { isDevelopment } from './chunk-TQQSPPNA.js';
import { createMiddleware, createMiddlewareCreator, createEndpointCreator, APIError, setCookie, getCookie, getSignedCookie, setSignedCookie, createRouter } from 'better-call';
export { APIError } from 'better-call';
import { z } from 'zod';
import { createHMAC } from '@better-auth/utils/hmac';
import { base64 } from '@better-auth/utils/base64';
import { binary } from '@better-auth/utils/binary';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';

var optionsMiddleware = createMiddleware(async () => {
  return {};
});
var createAuthMiddleware = createMiddlewareCreator({
  use: [
    optionsMiddleware,
    /**
     * Only use for post hooks
     */
    createMiddleware(async () => {
      return {};
    })
  ]
});
var createAuthEndpoint = createEndpointCreator({
  use: [optionsMiddleware]
});

// src/utils/wildcard.ts
function escapeRegExpChar(char) {
  if (char === "-" || char === "^" || char === "$" || char === "+" || char === "." || char === "(" || char === ")" || char === "|" || char === "[" || char === "]" || char === "{" || char === "}" || char === "*" || char === "?" || char === "\\") {
    return `\\${char}`;
  } else {
    return char;
  }
}
function escapeRegExpString(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += escapeRegExpChar(str[i]);
  }
  return result;
}
function transform(pattern, separator = true) {
  if (Array.isArray(pattern)) {
    let regExpPatterns = pattern.map((p) => `^${transform(p, separator)}$`);
    return `(?:${regExpPatterns.join("|")})`;
  }
  let separatorSplitter = "";
  let separatorMatcher = "";
  let wildcard = ".";
  if (separator === true) {
    separatorSplitter = "/";
    separatorMatcher = "[/\\\\]";
    wildcard = "[^/\\\\]";
  } else if (separator) {
    separatorSplitter = separator;
    separatorMatcher = escapeRegExpString(separatorSplitter);
    if (separatorMatcher.length > 1) {
      separatorMatcher = `(?:${separatorMatcher})`;
      wildcard = `((?!${separatorMatcher}).)`;
    } else {
      wildcard = `[^${separatorMatcher}]`;
    }
  }
  let requiredSeparator = separator ? `${separatorMatcher}+?` : "";
  let optionalSeparator = separator ? `${separatorMatcher}*?` : "";
  let segments = separator ? pattern.split(separatorSplitter) : [pattern];
  let result = "";
  for (let s = 0; s < segments.length; s++) {
    let segment = segments[s];
    let nextSegment = segments[s + 1];
    let currentSeparator = "";
    if (!segment && s > 0) {
      continue;
    }
    if (separator) {
      if (s === segments.length - 1) {
        currentSeparator = optionalSeparator;
      } else if (nextSegment !== "**") {
        currentSeparator = requiredSeparator;
      } else {
        currentSeparator = "";
      }
    }
    if (separator && segment === "**") {
      if (currentSeparator) {
        result += s === 0 ? "" : currentSeparator;
        result += `(?:${wildcard}*?${currentSeparator})*?`;
      }
      continue;
    }
    for (let c = 0; c < segment.length; c++) {
      let char = segment[c];
      if (char === "\\") {
        if (c < segment.length - 1) {
          result += escapeRegExpChar(segment[c + 1]);
          c++;
        }
      } else if (char === "?") {
        result += wildcard;
      } else if (char === "*") {
        result += `${wildcard}*?`;
      } else {
        result += escapeRegExpChar(char);
      }
    }
    result += currentSeparator;
  }
  return result;
}
function isMatch(regexp, sample) {
  if (typeof sample !== "string") {
    throw new TypeError(`Sample must be a string, but ${typeof sample} given`);
  }
  return regexp.test(sample);
}
function wildcardMatch(pattern, options) {
  if (typeof pattern !== "string" && !Array.isArray(pattern)) {
    throw new TypeError(
      `The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`
    );
  }
  if (typeof options === "string" || typeof options === "boolean") {
    options = { separator: options };
  }
  if (arguments.length === 2 && !(typeof options === "undefined" || typeof options === "object" && options !== null && !Array.isArray(options))) {
    throw new TypeError(
      `The second argument must be an options object or a string/boolean separator, but ${typeof options} given`
    );
  }
  options = options || {};
  if (options.separator === "\\") {
    throw new Error(
      "\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead"
    );
  }
  let regexpPattern = transform(pattern, options.separator);
  let regexp = new RegExp(`^${regexpPattern}$`, options.flags);
  let fn = isMatch.bind(null, regexp);
  fn.options = options;
  fn.pattern = pattern;
  fn.regexp = regexp;
  return fn;
}

// src/api/middlewares/origin-check.ts
var originCheckMiddleware = createAuthMiddleware(async (ctx) => {
  if (ctx.request?.method !== "POST") {
    return;
  }
  const { body, query, context } = ctx;
  const originHeader = ctx.headers?.get("origin") || ctx.headers?.get("referer") || "";
  const callbackURL = body?.callbackURL || query?.callbackURL;
  const redirectURL = body?.redirectTo;
  const errorCallbackURL = body?.errorCallbackURL;
  const newUserCallbackURL = body?.newUserCallbackURL;
  const trustedOrigins = context.trustedOrigins;
  const usesCookies = ctx.headers?.has("cookie");
  const matchesPattern = (url, pattern) => {
    if (url.startsWith("/")) {
      return false;
    }
    if (pattern.includes("*")) {
      return wildcardMatch(pattern)(getHost(url));
    }
    const protocol = getProtocol(url);
    return protocol === "http:" || protocol === "https:" || !protocol ? pattern === getOrigin(url) : url.startsWith(pattern);
  };
  const validateURL = (url, label) => {
    if (!url) {
      return;
    }
    const isTrustedOrigin = trustedOrigins.some(
      (origin) => matchesPattern(url, origin) || url?.startsWith("/") && label !== "origin" && !url.includes(":")
    );
    if (!isTrustedOrigin) {
      ctx.context.logger.error(`Invalid ${label}: ${url}`);
      ctx.context.logger.info(
        `If it's a valid URL, please add ${url} to trustedOrigins in your auth config
`,
        `Current list of trustedOrigins: ${trustedOrigins}`
      );
      throw new APIError("FORBIDDEN", { message: `Invalid ${label}` });
    }
  };
  if (usesCookies && !ctx.context.options.advanced?.disableCSRFCheck) {
    validateURL(originHeader, "origin");
  }
  callbackURL && validateURL(callbackURL, "callbackURL");
  redirectURL && validateURL(redirectURL, "redirectURL");
  errorCallbackURL && validateURL(errorCallbackURL, "errorCallbackURL");
  newUserCallbackURL && validateURL(newUserCallbackURL, "newUserCallbackURL");
});
var originCheck = (getValue) => createAuthMiddleware(async (ctx) => {
  const { context } = ctx;
  const callbackURL = getValue(ctx);
  const trustedOrigins = context.trustedOrigins;
  const matchesPattern = (url, pattern) => {
    if (url.startsWith("/")) {
      return false;
    }
    if (pattern.includes("*")) {
      return wildcardMatch(pattern)(getHost(url));
    }
    return url.startsWith(pattern);
  };
  const validateURL = (url, label) => {
    if (!url) {
      return;
    }
    const isTrustedOrigin = trustedOrigins.some(
      (origin) => matchesPattern(url, origin) || url?.startsWith("/") && label !== "origin" && !url.includes(":")
    );
    if (!isTrustedOrigin) {
      ctx.context.logger.error(`Invalid ${label}: ${url}`);
      ctx.context.logger.info(
        `If it's a valid URL, please add ${url} to trustedOrigins in your auth config
`,
        `Current list of trustedOrigins: ${trustedOrigins}`
      );
      throw new APIError("FORBIDDEN", { message: `Invalid ${label}` });
    }
  };
  callbackURL && validateURL(callbackURL, "callbackURL");
});

// src/error/codes.ts
var BASE_ERROR_CODES = {
  USER_NOT_FOUND: "User not found",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_GET_SESSION: "Failed to get session",
  INVALID_PASSWORD: "Invalid password",
  INVALID_EMAIL: "Invalid email",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
  PROVIDER_NOT_FOUND: "Provider not found",
  INVALID_TOKEN: "invalid token",
  ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
  FAILED_TO_GET_USER_INFO: "Failed to get user info",
  USER_EMAIL_NOT_FOUND: "User email not found",
  EMAIL_NOT_VERIFIED: "Email not verified",
  PASSWORD_TOO_SHORT: "Password too short",
  PASSWORD_TOO_LONG: "Password too long",
  USER_ALREADY_EXISTS: "User already exists",
  EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
  SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: "Account not found"
};
var getSession = () => createAuthEndpoint(
  "/get-session",
  {
    method: "GET",
    query: z.optional(
      z.object({
        /**
         * If cookie cache is enabled, it will disable the cache
         * and fetch the session from the database
         */
        disableCookieCache: z.boolean({
          description: "Disable cookie cache and fetch session from database"
        }).or(z.string().transform((v) => v === "true")).optional(),
        disableRefresh: z.boolean({
          description: "Disable session refresh. Useful for checking session status, without updating the session"
        }).optional()
      })
    ),
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Get the current session",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    session: {
                      type: "object",
                      properties: {
                        token: {
                          type: "string"
                        },
                        userId: {
                          type: "string"
                        },
                        expiresAt: {
                          type: "string"
                        }
                      }
                    },
                    user: {
                      type: "object",
                      $ref: "#/components/schemas/User"
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
    try {
      const sessionCookieToken = await ctx.getSignedCookie(
        ctx.context.authCookies.sessionToken.name,
        ctx.context.secret
      );
      if (!sessionCookieToken) {
        return ctx.json(null);
      }
      const sessionDataCookie = ctx.getCookie(
        ctx.context.authCookies.sessionData.name
      );
      const sessionDataPayload = sessionDataCookie ? safeJSONParse(binary.decode(base64.decode(sessionDataCookie))) : null;
      if (sessionDataPayload) {
        const isValid = await createHMAC("SHA-256", "base64urlnopad").verify(
          ctx.context.secret,
          JSON.stringify(sessionDataPayload.session),
          sessionDataPayload.signature
        );
        if (!isValid) {
          deleteSessionCookie(ctx);
          return ctx.json(null);
        }
      }
      const dontRememberMe = await ctx.getSignedCookie(
        ctx.context.authCookies.dontRememberToken.name,
        ctx.context.secret
      );
      if (sessionDataPayload?.session && ctx.context.options.session?.cookieCache?.enabled && !ctx.query?.disableCookieCache) {
        const session2 = sessionDataPayload.session;
        const hasExpired = sessionDataPayload.expiresAt < Date.now() || session2.session.expiresAt < /* @__PURE__ */ new Date();
        if (!hasExpired) {
          return ctx.json(
            session2
          );
        } else {
          const dataCookie = ctx.context.authCookies.sessionData.name;
          ctx.setCookie(dataCookie, "", {
            maxAge: 0
          });
        }
      }
      const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);
      ctx.context.session = session;
      if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
        deleteSessionCookie(ctx);
        if (session) {
          await ctx.context.internalAdapter.deleteSession(
            session.session.token
          );
        }
        return ctx.json(null);
      }
      if (dontRememberMe || ctx.query?.disableRefresh) {
        return ctx.json(
          session
        );
      }
      const expiresIn = ctx.context.sessionConfig.expiresIn;
      const updateAge = ctx.context.sessionConfig.updateAge;
      const sessionIsDueToBeUpdatedDate = session.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3;
      const shouldBeUpdated = sessionIsDueToBeUpdatedDate <= Date.now();
      if (shouldBeUpdated) {
        const updatedSession = await ctx.context.internalAdapter.updateSession(
          session.session.token,
          {
            expiresAt: getDate(ctx.context.sessionConfig.expiresIn, "sec")
          }
        );
        if (!updatedSession) {
          deleteSessionCookie(ctx);
          return ctx.json(null, { status: 401 });
        }
        const maxAge = (updatedSession.expiresAt.valueOf() - Date.now()) / 1e3;
        await setSessionCookie(
          ctx,
          {
            session: updatedSession,
            user: session.user
          },
          false,
          {
            maxAge
          }
        );
        return ctx.json({
          session: updatedSession,
          user: session.user
        });
      }
      await setCookieCache(ctx, session);
      return ctx.json(
        session
      );
    } catch (error2) {
      ctx.context.logger.error("INTERNAL_SERVER_ERROR", error2);
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: BASE_ERROR_CODES.FAILED_TO_GET_SESSION
      });
    }
  }
);
var getSessionFromCtx = async (ctx, config) => {
  if (ctx.context.session) {
    return ctx.context.session;
  }
  const session = await getSession()({
    ...ctx,
    _flag: "json",
    headers: ctx.headers,
    query: config
  }).catch((e) => {
    return null;
  });
  ctx.context.session = session;
  return session;
};
var sessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session) {
    throw new APIError("UNAUTHORIZED");
  }
  return {
    session
  };
});
var freshSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session) {
    throw new APIError("UNAUTHORIZED");
  }
  if (ctx.context.sessionConfig.freshAge === 0) {
    return {
      session
    };
  }
  const freshAge = ctx.context.sessionConfig.freshAge;
  const lastUpdated = session.session.updatedAt?.valueOf() || session.session.createdAt.valueOf();
  const now = Date.now();
  const isFresh = now - lastUpdated < freshAge * 1e3;
  if (!isFresh) {
    throw new APIError("FORBIDDEN", {
      message: "Session is not fresh"
    });
  }
  return {
    session
  };
});
var listSessions = () => createAuthEndpoint(
  "/list-sessions",
  {
    method: "GET",
    use: [sessionMiddleware],
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "List all active sessions for the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string"
                      },
                      userId: {
                        type: "string"
                      },
                      expiresAt: {
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
    }
  },
  async (ctx) => {
    const sessions = await ctx.context.internalAdapter.listSessions(
      ctx.context.session.user.id
    );
    const activeSessions = sessions.filter((session) => {
      return session.expiresAt > /* @__PURE__ */ new Date();
    });
    return ctx.json(
      activeSessions
    );
  }
);
var revokeSession = createAuthEndpoint(
  "/revoke-session",
  {
    method: "POST",
    body: z.object({
      token: z.string({
        description: "The token to revoke"
      })
    }),
    use: [sessionMiddleware],
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Revoke a single session",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string"
                  }
                },
                required: ["token"]
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const token = ctx.body.token;
    const findSession = await ctx.context.internalAdapter.findSession(token);
    if (!findSession) {
      throw new APIError("BAD_REQUEST", {
        message: "Session not found"
      });
    }
    if (findSession.session.userId !== ctx.context.session.user.id) {
      throw new APIError("UNAUTHORIZED");
    }
    try {
      await ctx.context.internalAdapter.deleteSession(token);
    } catch (error2) {
      ctx.context.logger.error(
        error2 && typeof error2 === "object" && "name" in error2 ? error2.name : "",
        error2
      );
      throw new APIError("INTERNAL_SERVER_ERROR");
    }
    return ctx.json({
      status: true
    });
  }
);
var revokeSessions = createAuthEndpoint(
  "/revoke-sessions",
  {
    method: "POST",
    use: [sessionMiddleware],
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Revoke all sessions for the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "boolean"
                    }
                  },
                  required: ["status"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    try {
      await ctx.context.internalAdapter.deleteSessions(
        ctx.context.session.user.id
      );
    } catch (error2) {
      ctx.context.logger.error(
        error2 && typeof error2 === "object" && "name" in error2 ? error2.name : "",
        error2
      );
      throw new APIError("INTERNAL_SERVER_ERROR");
    }
    return ctx.json({
      status: true
    });
  }
);
var revokeOtherSessions = createAuthEndpoint(
  "/revoke-other-sessions",
  {
    method: "POST",
    requireHeaders: true,
    use: [sessionMiddleware],
    metadata: {
      openapi: {
        description: "Revoke all other sessions for the user except the current one",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
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
    const session = ctx.context.session;
    if (!session.user) {
      throw new APIError("UNAUTHORIZED");
    }
    const sessions = await ctx.context.internalAdapter.listSessions(
      session.user.id
    );
    const activeSessions = sessions.filter((session2) => {
      return session2.expiresAt > /* @__PURE__ */ new Date();
    });
    const otherSessions = activeSessions.filter(
      (session2) => session2.token !== ctx.context.session.session.token
    );
    await Promise.all(
      otherSessions.map(
        (session2) => ctx.context.internalAdapter.deleteSession(session2.token)
      )
    );
    return ctx.json({
      status: true
    });
  }
);
async function createEmailVerificationToken(secret, email, updateTo, expiresIn = 3600) {
  const token = await signJWT(
    {
      email: email.toLowerCase(),
      updateTo
    },
    secret,
    expiresIn
  );
  return token;
}
async function sendVerificationEmailFn(ctx, user) {
  if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw new APIError("BAD_REQUEST", {
      message: "Verification email isn't enabled"
    });
  }
  const token = await createEmailVerificationToken(
    ctx.context.secret,
    user.email,
    void 0,
    ctx.context.options.emailVerification?.expiresIn
  );
  const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
  await ctx.context.options.emailVerification.sendVerificationEmail(
    {
      user,
      url,
      token
    },
    ctx.request
  );
}
var sendVerificationEmail = createAuthEndpoint(
  "/send-verification-email",
  {
    method: "POST",
    body: z.object({
      email: z.string({
        description: "The email to send the verification email to"
      }).email(),
      callbackURL: z.string({
        description: "The URL to use for email verification callback"
      }).optional()
    }),
    metadata: {
      openapi: {
        description: "Send a verification email to the user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "The email to send the verification email to"
                  },
                  callbackURL: {
                    type: "string",
                    description: "The URL to use for email verification callback"
                  }
                },
                required: ["email"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
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
    if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
      ctx.context.logger.error("Verification email isn't enabled.");
      throw new APIError("BAD_REQUEST", {
        message: "Verification email isn't enabled"
      });
    }
    const { email } = ctx.body;
    const user = await ctx.context.internalAdapter.findUserByEmail(email);
    if (!user) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.USER_NOT_FOUND
      });
    }
    await sendVerificationEmailFn(ctx, user.user);
    return ctx.json({
      status: true
    });
  }
);
var verifyEmail = createAuthEndpoint(
  "/verify-email",
  {
    method: "GET",
    query: z.object({
      token: z.string({
        description: "The token to verify the email"
      }),
      callbackURL: z.string({
        description: "The URL to redirect to after email verification"
      }).optional()
    }),
    use: [originCheck((ctx) => ctx.query.callbackURL)],
    metadata: {
      openapi: {
        description: "Verify the email of the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object"
                    },
                    status: {
                      type: "boolean"
                    }
                  },
                  required: ["user", "status"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    function redirectOnError(error2) {
      if (ctx.query.callbackURL) {
        if (ctx.query.callbackURL.includes("?")) {
          throw ctx.redirect(`${ctx.query.callbackURL}&error=${error2}`);
        }
        throw ctx.redirect(`${ctx.query.callbackURL}?error=${error2}`);
      }
      throw new APIError("UNAUTHORIZED", {
        message: error2
      });
    }
    const { token } = ctx.query;
    let jwt;
    try {
      jwt = await jwtVerify(
        token,
        new TextEncoder().encode(ctx.context.secret),
        {
          algorithms: ["HS256"]
        }
      );
    } catch (e) {
      if (e instanceof JWTExpired) {
        return redirectOnError("token_expired");
      }
      return redirectOnError("invalid_token");
    }
    const schema2 = z.object({
      email: z.string().email(),
      updateTo: z.string().optional()
    });
    const parsed = schema2.parse(jwt.payload);
    const user = await ctx.context.internalAdapter.findUserByEmail(
      parsed.email
    );
    if (!user) {
      return redirectOnError("user_not_found");
    }
    if (parsed.updateTo) {
      const session = await getSessionFromCtx(ctx);
      if (!session) {
        if (ctx.query.callbackURL) {
          throw ctx.redirect(`${ctx.query.callbackURL}?error=unauthorized`);
        }
        return redirectOnError("unauthorized");
      }
      if (session.user.email !== parsed.email) {
        if (ctx.query.callbackURL) {
          throw ctx.redirect(`${ctx.query.callbackURL}?error=unauthorized`);
        }
        return redirectOnError("unauthorized");
      }
      const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(
        parsed.email,
        {
          email: parsed.updateTo,
          emailVerified: false
        }
      );
      const newToken = await createEmailVerificationToken(
        ctx.context.secret,
        parsed.updateTo
      );
      await ctx.context.options.emailVerification?.sendVerificationEmail?.(
        {
          user: updatedUser,
          url: `${ctx.context.baseURL}/verify-email?token=${newToken}`,
          token: newToken
        },
        ctx.request
      );
      if (ctx.query.callbackURL) {
        throw ctx.redirect(ctx.query.callbackURL);
      }
      return ctx.json({
        status: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          image: updatedUser.image,
          emailVerified: updatedUser.emailVerified,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      });
    }
    await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
      emailVerified: true
    });
    if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
      const currentSession = await getSessionFromCtx(ctx);
      if (!currentSession || currentSession.user.email !== parsed.email) {
        const session = await ctx.context.internalAdapter.createSession(
          user.user.id,
          ctx.request
        );
        if (!session) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to create session"
          });
        }
        await setSessionCookie(ctx, { session, user: user.user });
      }
    }
    if (ctx.query.callbackURL) {
      throw ctx.redirect(ctx.query.callbackURL);
    }
    return ctx.json({
      status: true,
      user: null
    });
  }
);

// src/oauth2/link-account.ts
async function handleOAuthUserInfo(c, {
  userInfo,
  account,
  callbackURL
}) {
  const dbUser = await c.context.internalAdapter.findOAuthUser(
    userInfo.email.toLowerCase(),
    account.accountId,
    account.providerId
  ).catch((e) => {
    logger.error(
      "Better auth was unable to query your database.\nError: ",
      e
    );
    throw c.redirect(
      `${c.context.baseURL}/error?error=internal_server_error`
    );
  });
  let user = dbUser?.user;
  let isRegister = !user;
  if (dbUser) {
    const hasBeenLinked = dbUser.accounts.find(
      (a) => a.providerId === account.providerId
    );
    if (!hasBeenLinked) {
      const trustedProviders = c.context.options.account?.accountLinking?.trustedProviders;
      const isTrustedProvider = trustedProviders?.includes(
        account.providerId
      );
      if (!isTrustedProvider && !userInfo.emailVerified || c.context.options.account?.accountLinking?.enabled === false) {
        if (isDevelopment) {
          logger.warn(
            `User already exist but account isn't linked to ${account.providerId}. To read more about how account linking works in Better Auth see https://www.better-auth.com/docs/concepts/users-accounts#account-linking.`
          );
        }
        return {
          error: "account not linked",
          data: null
        };
      }
      try {
        await c.context.internalAdapter.linkAccount({
          providerId: account.providerId,
          accountId: userInfo.id.toString(),
          userId: dbUser.user.id,
          accessToken: account.accessToken,
          idToken: account.idToken,
          refreshToken: account.refreshToken,
          accessTokenExpiresAt: account.accessTokenExpiresAt,
          refreshTokenExpiresAt: account.refreshTokenExpiresAt,
          scope: account.scope
        });
      } catch (e) {
        logger.error("Unable to link account", e);
        return {
          error: "unable to link account",
          data: null
        };
      }
    } else {
      const updateData = Object.fromEntries(
        Object.entries({
          accessToken: account.accessToken,
          idToken: account.idToken,
          refreshToken: account.refreshToken,
          accessTokenExpiresAt: account.accessTokenExpiresAt,
          refreshTokenExpiresAt: account.refreshTokenExpiresAt,
          scope: account.scope
        }).filter(([_, value]) => value !== void 0)
      );
      if (Object.keys(updateData).length > 0) {
        await c.context.internalAdapter.updateAccount(
          hasBeenLinked.id,
          updateData
        );
      }
    }
  } else {
    try {
      user = await c.context.internalAdapter.createOAuthUser(
        {
          ...userInfo,
          email: userInfo.email.toLowerCase(),
          id: void 0
        },
        {
          accessToken: account.accessToken,
          idToken: account.idToken,
          refreshToken: account.refreshToken,
          accessTokenExpiresAt: account.accessTokenExpiresAt,
          refreshTokenExpiresAt: account.refreshTokenExpiresAt,
          scope: account.scope,
          providerId: account.providerId,
          accountId: userInfo.id.toString()
        }
      ).then((res) => res?.user);
      if (!userInfo.emailVerified && user && c.context.options.emailVerification?.sendOnSignUp) {
        const token = await createEmailVerificationToken(
          c.context.secret,
          user.email,
          void 0,
          c.context.options.emailVerification?.expiresIn
        );
        const url = `${c.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
        await c.context.options.emailVerification?.sendVerificationEmail?.(
          {
            user,
            url,
            token
          },
          c.request
        );
      }
    } catch (e) {
      if (e instanceof APIError) {
        return {
          error: e.message,
          data: null,
          isRegister: false
        };
      }
      return {
        error: "unable to create user",
        data: null,
        isRegister: false
      };
    }
  }
  if (!user) {
    return {
      error: "unable to create user",
      data: null,
      isRegister: false
    };
  }
  if (user?.banned) {
    return {
      error: `user is banned&reason=${user.banReason}`,
      data: null,
      isRegister: false
    };
  }
  const session = await c.context.internalAdapter.createSession(
    user.id,
    c.request
  );
  if (!session) {
    return {
      error: "unable to create session",
      data: null,
      isRegister: false
    };
  }
  return {
    data: {
      session,
      user
    },
    error: null,
    isRegister
  };
}

// src/api/routes/sign-in.ts
var signInSocial = createAuthEndpoint(
  "/sign-in/social",
  {
    method: "POST",
    body: z.object({
      /**
       * Callback URL to redirect to after the user
       * has signed in.
       */
      callbackURL: z.string({
        description: "Callback URL to redirect to after the user has signed in"
      }).optional(),
      /**
       * callback url to redirect if the user is newly registered.
       *
       * useful if you have different routes for existing users and new users
       */
      newUserCallbackURL: z.string().optional(),
      /**
       * Callback url to redirect to if an error happens
       *
       * If it's initiated from the client sdk this defaults to
       * the current url.
       */
      errorCallbackURL: z.string({
        description: "Callback URL to redirect to if an error happens"
      }).optional(),
      /**
       * OAuth2 provider to use`
       */
      provider: SocialProviderListEnum,
      /**
       * Disable automatic redirection to the provider
       *
       * This is useful if you want to handle the redirection
       * yourself like in a popup or a different tab.
       */
      disableRedirect: z.boolean({
        description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself"
      }).optional(),
      /**
       * ID token from the provider
       *
       * This is used to sign in the user
       * if the user is already signed in with the
       * provider in the frontend.
       *
       * Only applicable if the provider supports
       * it. Currently only `apple` and `google` is
       * supported out of the box.
       */
      idToken: z.optional(
        z.object({
          /**
           * ID token from the provider
           */
          token: z.string({
            description: "ID token from the provider"
          }),
          /**
           * The nonce used to generate the token
           */
          nonce: z.string({
            description: "Nonce used to generate the token"
          }).optional(),
          /**
           * Access token from the provider
           */
          accessToken: z.string({
            description: "Access token from the provider"
          }).optional(),
          /**
           * Refresh token from the provider
           */
          refreshToken: z.string({
            description: "Refresh token from the provider"
          }).optional(),
          /**
           * Expiry date of the token
           */
          expiresAt: z.number({
            description: "Expiry date of the token"
          }).optional()
        }),
        {
          description: "ID token from the provider to sign in the user with id token"
        }
      )
    }),
    metadata: {
      openapi: {
        description: "Sign in with a social provider",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    session: {
                      type: "string"
                    },
                    user: {
                      type: "object"
                    },
                    url: {
                      type: "string"
                    },
                    redirect: {
                      type: "boolean"
                    }
                  },
                  required: ["session", "user", "url", "redirect"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (c) => {
    const provider = c.context.socialProviders.find(
      (p) => p.id === c.body.provider
    );
    if (!provider) {
      c.context.logger.error(
        "Provider not found. Make sure to add the provider in your auth config",
        {
          provider: c.body.provider
        }
      );
      throw new APIError("NOT_FOUND", {
        message: BASE_ERROR_CODES.PROVIDER_NOT_FOUND
      });
    }
    if (c.body.idToken) {
      if (!provider.verifyIdToken) {
        c.context.logger.error(
          "Provider does not support id token verification",
          {
            provider: c.body.provider
          }
        );
        throw new APIError("NOT_FOUND", {
          message: BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED
        });
      }
      const { token, nonce } = c.body.idToken;
      const valid = await provider.verifyIdToken(token, nonce);
      if (!valid) {
        c.context.logger.error("Invalid id token", {
          provider: c.body.provider
        });
        throw new APIError("UNAUTHORIZED", {
          message: BASE_ERROR_CODES.INVALID_TOKEN
        });
      }
      const userInfo = await provider.getUserInfo({
        idToken: token,
        accessToken: c.body.idToken.accessToken,
        refreshToken: c.body.idToken.refreshToken
      });
      if (!userInfo || !userInfo?.user) {
        c.context.logger.error("Failed to get user info", {
          provider: c.body.provider
        });
        throw new APIError("UNAUTHORIZED", {
          message: BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO
        });
      }
      if (!userInfo.user.email) {
        c.context.logger.error("User email not found", {
          provider: c.body.provider
        });
        throw new APIError("UNAUTHORIZED", {
          message: BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND
        });
      }
      const data = await handleOAuthUserInfo(c, {
        userInfo: {
          email: userInfo.user.email,
          id: userInfo.user.id,
          name: userInfo.user.name || "",
          image: userInfo.user.image,
          emailVerified: userInfo.user.emailVerified || false
        },
        account: {
          providerId: provider.id,
          accountId: userInfo.user.id,
          accessToken: c.body.idToken.accessToken
        }
      });
      if (data.error) {
        throw new APIError("UNAUTHORIZED", {
          message: data.error
        });
      }
      await setSessionCookie(c, data.data);
      return c.json({
        redirect: false,
        token: data.data.session.token,
        url: void 0,
        user: {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          image: data.data.user.image,
          emailVerified: data.data.user.emailVerified,
          createdAt: data.data.user.createdAt,
          updatedAt: data.data.user.updatedAt
        }
      });
    }
    const { codeVerifier, state } = await generateState(c);
    const url = await provider.createAuthorizationURL({
      state,
      codeVerifier,
      redirectURI: `${c.context.baseURL}/callback/${provider.id}`
    });
    return c.json({
      url: url.toString(),
      redirect: !c.body.disableRedirect
    });
  }
);
var signInEmail = createAuthEndpoint(
  "/sign-in/email",
  {
    method: "POST",
    body: z.object({
      /**
       * Email of the user
       */
      email: z.string({
        description: "Email of the user"
      }),
      /**
       * Password of the user
       */
      password: z.string({
        description: "Password of the user"
      }),
      /**
       * Callback URL to use as a redirect for email
       * verification and for possible redirects
       */
      callbackURL: z.string({
        description: "Callback URL to use as a redirect for email verification"
      }).optional(),
      /**
       * If this is false, the session will not be remembered
       * @default true
       */
      rememberMe: z.boolean({
        description: "If this is false, the session will not be remembered. Default is `true`."
      }).default(true).optional()
    }),
    metadata: {
      openapi: {
        description: "Sign in with email and password",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object"
                    },
                    url: {
                      type: "string"
                    },
                    redirect: {
                      type: "boolean"
                    }
                  },
                  required: ["session", "user", "url", "redirect"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    if (!ctx.context.options?.emailAndPassword?.enabled) {
      ctx.context.logger.error(
        "Email and password is not enabled. Make sure to enable it in the options on you `auth.ts` file. Check `https://better-auth.com/docs/authentication/email-password` for more!"
      );
      throw new APIError("BAD_REQUEST", {
        message: "Email and password is not enabled"
      });
    }
    const { email, password } = ctx.body;
    const isValidEmail = z.string().email().safeParse(email);
    if (!isValidEmail.success) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.INVALID_EMAIL
      });
    }
    const user = await ctx.context.internalAdapter.findUserByEmail(email, {
      includeAccounts: true
    });
    if (!user) {
      await ctx.context.password.hash(password);
      ctx.context.logger.error("User not found", { email });
      throw new APIError("UNAUTHORIZED", {
        message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD
      });
    }
    const credentialAccount = user.accounts.find(
      (a) => a.providerId === "credential"
    );
    if (!credentialAccount) {
      ctx.context.logger.error("Credential account not found", { email });
      throw new APIError("UNAUTHORIZED", {
        message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD
      });
    }
    const currentPassword = credentialAccount?.password;
    if (!currentPassword) {
      ctx.context.logger.error("Password not found", { email });
      throw new APIError("UNAUTHORIZED", {
        message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD
      });
    }
    const validPassword = await ctx.context.password.verify({
      hash: currentPassword,
      password
    });
    if (!validPassword) {
      ctx.context.logger.error("Invalid password");
      throw new APIError("UNAUTHORIZED", {
        message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD
      });
    }
    if (ctx.context.options?.emailAndPassword?.requireEmailVerification && !user.user.emailVerified) {
      if (!ctx.context.options?.emailVerification?.sendVerificationEmail) {
        throw new APIError("FORBIDDEN", {
          message: BASE_ERROR_CODES.EMAIL_NOT_VERIFIED
        });
      }
      const token = await createEmailVerificationToken(
        ctx.context.secret,
        user.user.email,
        void 0,
        ctx.context.options.emailVerification?.expiresIn
      );
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
      await ctx.context.options.emailVerification.sendVerificationEmail(
        {
          user: user.user,
          url,
          token
        },
        ctx.request
      );
      throw new APIError("FORBIDDEN", {
        message: BASE_ERROR_CODES.EMAIL_NOT_VERIFIED
      });
    }
    const session = await ctx.context.internalAdapter.createSession(
      user.user.id,
      ctx.headers,
      ctx.body.rememberMe === false
    );
    if (!session) {
      ctx.context.logger.error("Failed to create session");
      throw new APIError("UNAUTHORIZED", {
        message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION
      });
    }
    await setSessionCookie(
      ctx,
      {
        session,
        user: user.user
      },
      ctx.body.rememberMe === false
    );
    return ctx.json({
      redirect: !!ctx.body.callbackURL,
      token: session.token,
      url: ctx.body.callbackURL,
      user: {
        id: user.user.id,
        email: user.user.email,
        name: user.user.name,
        image: user.user.image,
        emailVerified: user.user.emailVerified,
        createdAt: user.user.createdAt,
        updatedAt: user.user.updatedAt
      }
    });
  }
);
var schema = z.object({
  code: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
  state: z.string().optional()
});
var callbackOAuth = createAuthEndpoint(
  "/callback/:id",
  {
    method: ["GET", "POST"],
    body: schema.optional(),
    query: schema.optional(),
    metadata: HIDE_METADATA
  },
  async (c) => {
    let queryOrBody;
    try {
      if (c.method === "GET") {
        queryOrBody = schema.parse(c.query);
      } else if (c.method === "POST") {
        queryOrBody = schema.parse(c.body);
      } else {
        throw new Error("Unsupported method");
      }
    } catch (e) {
      c.context.logger.error("INVALID_CALLBACK_REQUEST", e);
      throw c.redirect(
        `${c.context.baseURL}/error?error=invalid_callback_request`
      );
    }
    const { code, error: error2, state, error_description } = queryOrBody;
    if (!state) {
      c.context.logger.error("State not found", error2);
      throw c.redirect(`${c.context.baseURL}/error?error=state_not_found`);
    }
    if (!code) {
      c.context.logger.error("Code not found");
      throw c.redirect(
        `${c.context.baseURL}/error?error=${error2 || "no_code"}&error_description=${error_description}`
      );
    }
    const provider = c.context.socialProviders.find(
      (p) => p.id === c.params.id
    );
    if (!provider) {
      c.context.logger.error(
        "Oauth provider with id",
        c.params.id,
        "not found"
      );
      throw c.redirect(
        `${c.context.baseURL}/error?error=oauth_provider_not_found`
      );
    }
    const { codeVerifier, callbackURL, link, errorURL, newUserURL } = await parseState(c);
    let tokens;
    try {
      tokens = await provider.validateAuthorizationCode({
        code,
        codeVerifier,
        redirectURI: `${c.context.baseURL}/callback/${provider.id}`
      });
    } catch (e) {
      c.context.logger.error("", e);
      throw c.redirect(
        `${c.context.baseURL}/error?error=please_restart_the_process`
      );
    }
    const userInfo = await provider.getUserInfo(tokens).then((res) => res?.user);
    function redirectOnError(error3) {
      let url = errorURL || callbackURL || `${c.context.baseURL}/error`;
      if (url.includes("?")) {
        url = `${url}&error=${error3}`;
      } else {
        url = `${url}?error=${error3}`;
      }
      throw c.redirect(url);
    }
    if (!userInfo) {
      c.context.logger.error("Unable to get user info");
      return redirectOnError("unable_to_get_user_info");
    }
    if (!userInfo.email && provider.id !== "roblox") {
      c.context.logger.error(
        "Provider did not return email. This could be due to misconfiguration in the provider settings."
      );
      return redirectOnError("email_not_found");
    }
    if (!callbackURL) {
      c.context.logger.error("No callback URL found");
      throw c.redirect(
        `${c.context.baseURL}/error?error=please_restart_the_process`
      );
    }
    if (link) {
      if (c.context.options.account?.accountLinking?.allowDifferentEmails !== true && link.email !== userInfo?.email?.toLowerCase()) {
        return redirectOnError("email_doesn't_match");
      }
      const existingAccount = await c.context.internalAdapter.findAccount(
        userInfo.id
      );
      if (existingAccount) {
        if (existingAccount && existingAccount.userId !== link.userId) {
          return redirectOnError("account_already_linked_to_different_user");
        }
        return redirectOnError("account_already_linked");
      }
      const newAccount = await c.context.internalAdapter.createAccount({
        userId: link.userId,
        providerId: provider.id,
        accountId: userInfo.id,
        name: userInfo.name || userInfo.email || "",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        scope: tokens.scopes?.join(","),
        image: userInfo.image
      });
      if (!newAccount) {
        return redirectOnError("unable_to_link_account");
      }
      let toRedirectTo2;
      try {
        const url = callbackURL;
        toRedirectTo2 = url.toString();
      } catch {
        toRedirectTo2 = callbackURL;
      }
      throw c.redirect(toRedirectTo2);
    }
    const result = await handleOAuthUserInfo(c, {
      userInfo: {
        ...userInfo,
        email: userInfo.email || "",
        name: userInfo.name || userInfo.email || ""
      },
      account: {
        providerId: provider.id,
        accountId: userInfo.id,
        ...tokens,
        image: userInfo.image,
        scope: tokens.scopes?.join(",")
      },
      callbackURL
    });
    if (result.error) {
      c.context.logger.error(result.error.split(" ").join("_"));
      return redirectOnError(result.error.split(" ").join("_"));
    }
    const { session, user } = result.data;
    await setSessionCookie(c, {
      session,
      user
    });
    let toRedirectTo;
    try {
      const url = result.isRegister ? newUserURL || callbackURL : callbackURL;
      toRedirectTo = url.toString();
    } catch {
      toRedirectTo = result.isRegister ? newUserURL || callbackURL : callbackURL;
    }
    throw c.redirect(toRedirectTo);
  }
);
var signOut = createAuthEndpoint(
  "/sign-out",
  {
    method: "POST",
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Sign out the current user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
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
    const sessionCookieToken = await ctx.getSignedCookie(
      ctx.context.authCookies.sessionToken.name,
      ctx.context.secret
    );
    if (!sessionCookieToken) {
      deleteSessionCookie(ctx);
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.FAILED_TO_GET_SESSION
      });
    }
    await ctx.context.internalAdapter.deleteSession(sessionCookieToken);
    deleteSessionCookie(ctx);
    return ctx.json({
      success: true
    });
  }
);
function redirectError(ctx, callbackURL, query) {
  const url = callbackURL ? new URL(callbackURL, ctx.baseURL) : new URL(`${ctx.baseURL}/error`);
  if (query)
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.href;
}
function redirectCallback(ctx, callbackURL, query) {
  const url = new URL(callbackURL, ctx.baseURL);
  if (query)
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.href;
}
var forgetPassword = createAuthEndpoint(
  "/forget-password",
  {
    method: "POST",
    body: z.object({
      /**
       * The email address of the user to send a password reset email to.
       */
      email: z.string({
        description: "The email address of the user to send a password reset email to"
      }).email(),
      /**
       * The URL to redirect the user to reset their password.
       * If the token isn't valid or expired, it'll be redirected with a query parameter `?
       * error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?
       * token=VALID_TOKEN
       */
      redirectTo: z.string({
        description: "The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN"
      }).optional()
    }),
    metadata: {
      openapi: {
        description: "Send a password reset email to the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
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
    if (!ctx.context.options.emailAndPassword?.sendResetPassword) {
      ctx.context.logger.error(
        "Reset password isn't enabled.Please pass an emailAndPassword.sendResetPasswordToken function in your auth config!"
      );
      throw new APIError("BAD_REQUEST", {
        message: "Reset password isn't enabled"
      });
    }
    const { email, redirectTo } = ctx.body;
    const user = await ctx.context.internalAdapter.findUserByEmail(email, {
      includeAccounts: true
    });
    if (!user) {
      ctx.context.logger.error("Reset Password: User not found", { email });
      return ctx.json(
        {
          status: false
        },
        {
          body: {
            status: true
          }
        }
      );
    }
    const defaultExpiresIn = 60 * 60 * 1;
    const expiresAt = getDate(
      ctx.context.options.emailAndPassword.resetPasswordTokenExpiresIn || defaultExpiresIn,
      "sec"
    );
    const verificationToken = generateId(24);
    await ctx.context.internalAdapter.createVerificationValue({
      value: user.user.id.toString(),
      identifier: `reset-password:${verificationToken}`,
      expiresAt
    });
    const url = `${ctx.context.baseURL}/reset-password/${verificationToken}?callbackURL=${redirectTo}`;
    await ctx.context.options.emailAndPassword.sendResetPassword(
      {
        user: user.user,
        url,
        token: verificationToken
      },
      ctx.request
    );
    return ctx.json({
      status: true
    });
  }
);
var forgetPasswordCallback = createAuthEndpoint(
  "/reset-password/:token",
  {
    method: "GET",
    query: z.object({
      callbackURL: z.string({
        description: "The URL to redirect the user to reset their password"
      })
    }),
    use: [originCheck((ctx) => ctx.query.callbackURL)],
    metadata: {
      openapi: {
        description: "Redirects the user to the callback URL with the token",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
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
    const { token } = ctx.params;
    const { callbackURL } = ctx.query;
    if (!token || !callbackURL) {
      throw ctx.redirect(
        redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" })
      );
    }
    const verification = await ctx.context.internalAdapter.findVerificationValue(
      `reset-password:${token}`
    );
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      throw ctx.redirect(
        redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" })
      );
    }
    throw ctx.redirect(redirectCallback(ctx.context, callbackURL, { token }));
  }
);
var resetPassword = createAuthEndpoint(
  "/reset-password",
  {
    method: "POST",
    query: z.object({
      token: z.string().optional()
    }).optional(),
    body: z.object({
      newPassword: z.string({
        description: "The new password to set"
      }),
      token: z.string({
        description: "The token to reset the password"
      }).optional()
    }),
    metadata: {
      openapi: {
        description: "Reset the password for a user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
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
    const token = ctx.body.token || ctx.query?.token;
    if (!token) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.INVALID_TOKEN
      });
    }
    const { newPassword } = ctx.body;
    const minLength = ctx.context.password?.config.minPasswordLength;
    const maxLength = ctx.context.password?.config.maxPasswordLength;
    if (newPassword.length < minLength) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT
      });
    }
    if (newPassword.length > maxLength) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_LONG
      });
    }
    const id = `reset-password:${token}`;
    const verification = await ctx.context.internalAdapter.findVerificationValue(id);
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.INVALID_TOKEN
      });
    }
    await ctx.context.internalAdapter.deleteVerificationValue(verification.id);
    const userId = verification.value;
    const hashedPassword = await ctx.context.password.hash(newPassword);
    const accounts = await ctx.context.internalAdapter.findAccounts(userId);
    const account = accounts.find((ac) => ac.providerId === "credential");
    if (!account) {
      await ctx.context.internalAdapter.createAccount({
        userId,
        providerId: "credential",
        password: hashedPassword,
        accountId: userId
      });
      return ctx.json({
        status: true
      });
    }
    await ctx.context.internalAdapter.updatePassword(userId, hashedPassword);
    return ctx.json({
      status: true
    });
  }
);
var updateUser = () => createAuthEndpoint(
  "/update-user",
  {
    method: "POST",
    body: z.record(z.string(), z.any()),
    use: [sessionMiddleware],
    metadata: {
      $Infer: {
        body: {}
      },
      openapi: {
        description: "Update the current user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the user"
                  },
                  image: {
                    type: "string",
                    description: "The image of the user"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object"
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
    const body = ctx.body;
    if (body.email) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.EMAIL_CAN_NOT_BE_UPDATED
      });
    }
    const { name, image, ...rest } = body;
    const session = ctx.context.session;
    if (image === void 0 && name === void 0 && Object.keys(rest).length === 0) {
      return ctx.json({
        status: true
      });
    }
    const additionalFields = parseUserInput(
      ctx.context.options,
      rest,
      "update"
    );
    const user = await ctx.context.internalAdapter.updateUserByEmail(
      session.user.email,
      {
        name,
        image,
        ...additionalFields
      }
    );
    await setSessionCookie(ctx, {
      session: session.session,
      user
    });
    return ctx.json({
      status: true
    });
  }
);
var changePassword = createAuthEndpoint(
  "/change-password",
  {
    method: "POST",
    body: z.object({
      /**
       * The new password to set
       */
      newPassword: z.string({
        description: "The new password to set"
      }),
      /**
       * The current password of the user
       */
      currentPassword: z.string({
        description: "The current password"
      }),
      /**
       * revoke all sessions that are not the
       * current one logged in by the user
       */
      revokeOtherSessions: z.boolean({
        description: "Revoke all other sessions"
      }).optional()
    }),
    use: [sessionMiddleware],
    metadata: {
      openapi: {
        description: "Change the password of the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      description: "The user object",
                      $ref: "#/components/schemas/User"
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
    const { newPassword, currentPassword, revokeOtherSessions: revokeOtherSessions2 } = ctx.body;
    const session = ctx.context.session;
    const minPasswordLength = ctx.context.password.config.minPasswordLength;
    if (newPassword.length < minPasswordLength) {
      ctx.context.logger.error("Password is too short");
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT
      });
    }
    const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
    if (newPassword.length > maxPasswordLength) {
      ctx.context.logger.error("Password is too long");
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_LONG
      });
    }
    const accounts = await ctx.context.internalAdapter.findAccounts(
      session.user.id
    );
    const account = accounts.find(
      (account2) => account2.providerId === "credential" && account2.password
    );
    if (!account || !account.password) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND
      });
    }
    const passwordHash = await ctx.context.password.hash(newPassword);
    const verify = await ctx.context.password.verify({
      hash: account.password,
      password: currentPassword
    });
    if (!verify) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.INVALID_PASSWORD
      });
    }
    await ctx.context.internalAdapter.updateAccount(account.id, {
      password: passwordHash
    });
    let token = null;
    if (revokeOtherSessions2) {
      await ctx.context.internalAdapter.deleteSessions(session.user.id);
      const newSession = await ctx.context.internalAdapter.createSession(
        session.user.id,
        ctx.headers
      );
      if (!newSession) {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: BASE_ERROR_CODES.FAILED_TO_GET_SESSION
        });
      }
      await setSessionCookie(ctx, {
        session: newSession,
        user: session.user
      });
      token = newSession.token;
    }
    return ctx.json({
      token,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt
      }
    });
  }
);
var setPassword = createAuthEndpoint(
  "/set-password",
  {
    method: "POST",
    body: z.object({
      /**
       * The new password to set
       */
      newPassword: z.string()
    }),
    metadata: {
      SERVER_ONLY: true
    },
    use: [sessionMiddleware]
  },
  async (ctx) => {
    const { newPassword } = ctx.body;
    const session = ctx.context.session;
    const minPasswordLength = ctx.context.password.config.minPasswordLength;
    if (newPassword.length < minPasswordLength) {
      ctx.context.logger.error("Password is too short");
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT
      });
    }
    const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
    if (newPassword.length > maxPasswordLength) {
      ctx.context.logger.error("Password is too long");
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_LONG
      });
    }
    const accounts = await ctx.context.internalAdapter.findAccounts(
      session.user.id
    );
    const account = accounts.find(
      (account2) => account2.providerId === "credential" && account2.password
    );
    const passwordHash = await ctx.context.password.hash(newPassword);
    if (!account) {
      await ctx.context.internalAdapter.linkAccount({
        userId: session.user.id,
        providerId: "credential",
        accountId: session.user.id,
        password: passwordHash
      });
      return ctx.json({
        status: true
      });
    }
    throw new APIError("BAD_REQUEST", {
      message: "user already has a password"
    });
  }
);
var deleteUser = createAuthEndpoint(
  "/delete-user",
  {
    method: "POST",
    use: [sessionMiddleware],
    body: z.object({
      /**
       * The callback URL to redirect to after the user is deleted
       * this is only used on delete user callback
       */
      callbackURL: z.string().optional(),
      /**
       * The password of the user. If the password isn't provided, session freshness
       * will be checked.
       */
      password: z.string().optional(),
      /**
       * The token to delete the user. If the token is provided, the user will be deleted
       */
      token: z.string().optional()
    }),
    metadata: {
      openapi: {
        description: "Delete the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object"
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    if (!ctx.context.options.user?.deleteUser?.enabled) {
      ctx.context.logger.error(
        "Delete user is disabled. Enable it in the options",
        {
          session: ctx.context.session
        }
      );
      throw new APIError("NOT_FOUND");
    }
    const session = ctx.context.session;
    if (ctx.body.password) {
      const accounts = await ctx.context.internalAdapter.findAccounts(
        session.user.id
      );
      const account = accounts.find(
        (account2) => account2.providerId === "credential" && account2.password
      );
      if (!account || !account.password) {
        throw new APIError("BAD_REQUEST", {
          message: BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND
        });
      }
      const verify = await ctx.context.password.verify({
        hash: account.password,
        password: ctx.body.password
      });
      if (!verify) {
        throw new APIError("BAD_REQUEST", {
          message: BASE_ERROR_CODES.INVALID_PASSWORD
        });
      }
    } else {
      if (ctx.context.options.session?.freshAge) {
        const currentAge = session.session.createdAt.getTime();
        const freshAge = ctx.context.options.session.freshAge;
        const now = Date.now();
        if (now - currentAge > freshAge) {
          throw new APIError("BAD_REQUEST", {
            message: BASE_ERROR_CODES.SESSION_EXPIRED
          });
        }
      }
    }
    if (ctx.body.token) {
      await deleteUserCallback({
        ...ctx,
        query: {
          token: ctx.body.token
        }
      });
      return ctx.json({
        success: true,
        message: "User deleted"
      });
    }
    if (ctx.context.options.user.deleteUser?.sendDeleteAccountVerification) {
      const token = generateRandomString(32, "0-9", "a-z");
      await ctx.context.internalAdapter.createVerificationValue({
        value: session.user.id,
        identifier: `delete-account-${token}`,
        expiresAt: new Date(Date.now() + 1e3 * 60 * 60 * 24)
      });
      const url = `${ctx.context.baseURL}/delete-user/callback?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
      await ctx.context.options.user.deleteUser.sendDeleteAccountVerification(
        {
          user: session.user,
          url,
          token
        },
        ctx.request
      );
      return ctx.json({
        success: true,
        message: "Verification email sent"
      });
    }
    const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
    if (beforeDelete) {
      await beforeDelete(session.user, ctx.request);
    }
    await ctx.context.internalAdapter.deleteUser(session.user.id);
    await ctx.context.internalAdapter.deleteSessions(session.user.id);
    await ctx.context.internalAdapter.deleteAccounts(session.user.id);
    deleteSessionCookie(ctx);
    const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
    if (afterDelete) {
      await afterDelete(session.user, ctx.request);
    }
    return ctx.json({
      success: true,
      message: "User deleted"
    });
  }
);
var deleteUserCallback = createAuthEndpoint(
  "/delete-user/callback",
  {
    method: "GET",
    query: z.object({
      token: z.string(),
      callbackURL: z.string().optional()
    }),
    use: [originCheck((ctx) => ctx.query.callbackURL)]
  },
  async (ctx) => {
    if (!ctx.context.options.user?.deleteUser?.enabled) {
      ctx.context.logger.error(
        "Delete user is disabled. Enable it in the options"
      );
      throw new APIError("NOT_FOUND");
    }
    const session = await getSessionFromCtx(ctx);
    if (!session) {
      throw new APIError("NOT_FOUND", {
        message: BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO
      });
    }
    const token = await ctx.context.internalAdapter.findVerificationValue(
      `delete-account-${ctx.query.token}`
    );
    if (!token || token.expiresAt < /* @__PURE__ */ new Date()) {
      if (token) {
        await ctx.context.internalAdapter.deleteVerificationValue(token.id);
      }
      throw new APIError("NOT_FOUND", {
        message: BASE_ERROR_CODES.INVALID_TOKEN
      });
    }
    if (token.value !== session.user.id) {
      throw new APIError("NOT_FOUND", {
        message: BASE_ERROR_CODES.INVALID_TOKEN
      });
    }
    const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
    if (beforeDelete) {
      await beforeDelete(session.user, ctx.request);
    }
    await ctx.context.internalAdapter.deleteUser(session.user.id);
    await ctx.context.internalAdapter.deleteSessions(session.user.id);
    await ctx.context.internalAdapter.deleteAccounts(session.user.id);
    await ctx.context.internalAdapter.deleteVerificationValue(token.id);
    deleteSessionCookie(ctx);
    const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
    if (afterDelete) {
      await afterDelete(session.user, ctx.request);
    }
    if (ctx.query.callbackURL) {
      throw ctx.redirect(ctx.query.callbackURL || "/");
    }
    return ctx.json({
      success: true,
      message: "User deleted"
    });
  }
);
var changeEmail = createAuthEndpoint(
  "/change-email",
  {
    method: "POST",
    body: z.object({
      newEmail: z.string({
        description: "The new email to set"
      }).email(),
      callbackURL: z.string({
        description: "The URL to redirect to after email verification"
      }).optional()
    }),
    use: [sessionMiddleware],
    metadata: {
      openapi: {
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object"
                    },
                    status: {
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
    if (!ctx.context.options.user?.changeEmail?.enabled) {
      ctx.context.logger.error("Change email is disabled.");
      throw new APIError("BAD_REQUEST", {
        message: "Change email is disabled"
      });
    }
    if (ctx.body.newEmail === ctx.context.session.user.email) {
      ctx.context.logger.error("Email is the same");
      throw new APIError("BAD_REQUEST", {
        message: "Email is the same"
      });
    }
    const existingUser = await ctx.context.internalAdapter.findUserByEmail(
      ctx.body.newEmail
    );
    if (existingUser) {
      ctx.context.logger.error("Email already exists");
      throw new APIError("BAD_REQUEST", {
        message: "Couldn't update your email"
      });
    }
    if (ctx.context.session.user.emailVerified !== true) {
      await ctx.context.internalAdapter.updateUserByEmail(
        ctx.context.session.user.email,
        {
          email: ctx.body.newEmail
        }
      );
      return ctx.json({
        status: true
      });
    }
    if (!ctx.context.options.user.changeEmail.sendChangeEmailVerification) {
      ctx.context.logger.error("Verification email isn't enabled.");
      throw new APIError("BAD_REQUEST", {
        message: "Verification email isn't enabled"
      });
    }
    const token = await createEmailVerificationToken(
      ctx.context.secret,
      ctx.context.session.user.email,
      ctx.body.newEmail,
      ctx.context.options.emailVerification?.expiresIn
    );
    const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
    await ctx.context.options.user.changeEmail.sendChangeEmailVerification(
      {
        user: ctx.context.session.user,
        newEmail: ctx.body.newEmail,
        url,
        token
      },
      ctx.request
    );
    return ctx.json({
      status: true
    });
  }
);

// src/api/routes/error.ts
var html = (errorCode = "Unknown") => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Error</title>
    <style>
        :root {
            --bg-color: #f8f9fa;
            --text-color: #212529;
            --accent-color: #000000;
            --error-color: #dc3545;
            --border-color: #e9ecef;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            line-height: 1.5;
        }
        .error-container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 2.5rem;
            text-align: center;
            max-width: 90%;
            width: 400px;
        }
        h1 {
            color: var(--error-color);
            font-size: 1.75rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        p {
            margin-bottom: 1.5rem;
            color: #495057;
        }
        .btn {
            background-color: var(--accent-color);
            color: #ffffff;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: inline-block;
            font-weight: 500;
            border: 2px solid var(--accent-color);
        }
        .btn:hover {
            background-color: #131721;
        }
        .error-code {
            font-size: 0.875rem;
            color: #6c757d;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }
        .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="icon">\u26A0\uFE0F</div>
        <h1>Better Auth Error</h1>
        <p>We encountered an issue while processing your request. Please try again or contact the application owner if the problem persists.</p>
        <a href="/" id="returnLink" class="btn">Return to Application</a>
        <div class="error-code">Error Code: <span id="errorCode">${errorCode}</span></div>
    </div>
</body>
</html>`;
var error = createAuthEndpoint(
  "/error",
  {
    method: "GET",
    metadata: {
      ...HIDE_METADATA,
      openapi: {
        description: "Displays an error page",
        responses: {
          "200": {
            description: "Success",
            content: {
              "text/html": {
                schema: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    }
  },
  async (c) => {
    const query = new URL(c.request?.url || "").searchParams.get("error") || "Unknown";
    return new Response(html(query), {
      headers: {
        "Content-Type": "text/html"
      }
    });
  }
);

// src/api/routes/ok.ts
var ok = createAuthEndpoint(
  "/ok",
  {
    method: "GET",
    metadata: {
      ...HIDE_METADATA,
      openapi: {
        description: "Check if the API is working",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: {
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
    return ctx.json({
      ok: true
    });
  }
);
var signUpEmail = () => createAuthEndpoint(
  "/sign-up/email",
  {
    method: "POST",
    body: z.record(z.string(), z.any()),
    metadata: {
      $Infer: {
        body: {}
      },
      openapi: {
        description: "Sign up a user using email and password",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the user"
                  },
                  email: {
                    type: "string",
                    description: "The email of the user"
                  },
                  password: {
                    type: "string",
                    description: "The password of the user"
                  },
                  callbackURL: {
                    type: "string",
                    description: "The URL to use for email verification callback"
                  }
                },
                required: ["name", "email", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      description: "The id of the user"
                    },
                    email: {
                      type: "string",
                      description: "The email of the user"
                    },
                    name: {
                      type: "string",
                      description: "The name of the user"
                    },
                    image: {
                      type: "string",
                      description: "The image of the user"
                    },
                    emailVerified: {
                      type: "boolean",
                      description: "If the email is verified"
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
    if (!ctx.context.options.emailAndPassword?.enabled) {
      throw new APIError("BAD_REQUEST", {
        message: "Email and password sign up is not enabled"
      });
    }
    const body = ctx.body;
    const { name, email, password, image, callbackURL, ...additionalFields } = body;
    const isValidEmail = z.string().email().safeParse(email);
    if (!isValidEmail.success) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.INVALID_EMAIL
      });
    }
    const minPasswordLength = ctx.context.password.config.minPasswordLength;
    if (password.length < minPasswordLength) {
      ctx.context.logger.error("Password is too short");
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT
      });
    }
    const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
    if (password.length > maxPasswordLength) {
      ctx.context.logger.error("Password is too long");
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.PASSWORD_TOO_LONG
      });
    }
    const dbUser = await ctx.context.internalAdapter.findUserByEmail(email);
    if (dbUser?.user) {
      ctx.context.logger.info(`Sign-up attempt for existing email: ${email}`);
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: BASE_ERROR_CODES.USER_ALREADY_EXISTS
      });
    }
    const additionalData = parseUserInput(
      ctx.context.options,
      additionalFields
    );
    let createdUser;
    try {
      createdUser = await ctx.context.internalAdapter.createUser({
        email: email.toLowerCase(),
        name,
        image,
        ...additionalData,
        emailVerified: false
      });
      if (!createdUser) {
        throw new APIError("BAD_REQUEST", {
          message: BASE_ERROR_CODES.FAILED_TO_CREATE_USER
        });
      }
    } catch (e) {
      if (isDevelopment) {
        ctx.context.logger.error("Failed to create user", e);
      }
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: BASE_ERROR_CODES.FAILED_TO_CREATE_USER,
        details: e
      });
    }
    if (!createdUser) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        message: BASE_ERROR_CODES.FAILED_TO_CREATE_USER
      });
    }
    const hash = await ctx.context.password.hash(password);
    await ctx.context.internalAdapter.linkAccount({
      userId: createdUser.id,
      providerId: "credential",
      accountId: createdUser.id,
      password: hash
    });
    if (ctx.context.options.emailVerification?.sendOnSignUp || ctx.context.options.emailAndPassword.requireEmailVerification) {
      const token = await createEmailVerificationToken(
        ctx.context.secret,
        createdUser.email,
        void 0,
        ctx.context.options.emailVerification?.expiresIn
      );
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${body.callbackURL || "/"}`;
      await ctx.context.options.emailVerification?.sendVerificationEmail?.(
        {
          user: createdUser,
          url,
          token
        },
        ctx.request
      );
    }
    if (ctx.context.options.emailAndPassword.autoSignIn === false || ctx.context.options.emailAndPassword.requireEmailVerification) {
      return ctx.json({
        token: null,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          image: createdUser.image,
          emailVerified: createdUser.emailVerified,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt
        }
      });
    }
    const session = await ctx.context.internalAdapter.createSession(
      createdUser.id,
      ctx.request
    );
    if (!session) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION
      });
    }
    await setSessionCookie(ctx, {
      session,
      user: createdUser
    });
    return ctx.json({
      token: session.token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        image: createdUser.image,
        emailVerified: createdUser.emailVerified,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt
      }
    });
  }
);
var listUserAccounts = createAuthEndpoint(
  "/list-accounts",
  {
    method: "GET",
    use: [sessionMiddleware],
    metadata: {
      openapi: {
        description: "List all accounts linked to the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string"
                      },
                      provider: {
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
    }
  },
  async (c) => {
    const session = c.context.session;
    const accounts = await c.context.internalAdapter.findAccounts(
      session.user.id
    );
    return c.json(
      accounts.map((a) => {
        return {
          id: a.id,
          accountId: a.accountId,
          provider: a.providerId,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          scopes: a.scope?.split(",") || []
        };
      })
    );
  }
);
var linkSocialAccount = createAuthEndpoint(
  "/link-social",
  {
    method: "POST",
    requireHeaders: true,
    body: z.object({
      /**
       * Callback URL to redirect to after the user has signed in.
       */
      callbackURL: z.string({
        description: "The URL to redirect to after the user has signed in"
      }).optional(),
      /**
       * OAuth2 provider to use`
       */
      provider: z.enum(socialProviderList, {
        description: "The OAuth2 provider to use"
      }),
      /**
       * Disable automatic redirection to the provider
       *
       * This is useful if you want to handle the redirection
       * yourself like in a popup or a different tab.
       */
      disableRedirect: z.boolean({
        description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself"
      }).optional()
    }),
    use: [sessionMiddleware],
    metadata: {
      openapi: {
        description: "Link a social account to the user",
        responses: {
          "200": {
            description: "Success",
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
                    },
                    disableRedirect: {
                      type: "boolean"
                    }
                  },
                  required: ["url", "redirect"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (c) => {
    const session = c.context.session;
    const account = await c.context.internalAdapter.findAccounts(
      session.user.id
    );
    const existingAccount = account.find(
      (a) => a.providerId === c.body.provider
    );
    if (existingAccount) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.SOCIAL_ACCOUNT_ALREADY_LINKED
      });
    }
    const provider = c.context.socialProviders.find(
      (p) => p.id === c.body.provider
    );
    if (!provider) {
      c.context.logger.error(
        "Provider not found. Make sure to add the provider in your auth config",
        {
          provider: c.body.provider
        }
      );
      throw new APIError("NOT_FOUND", {
        message: BASE_ERROR_CODES.PROVIDER_NOT_FOUND
      });
    }
    const state = await generateState(c, {
      userId: session.user.id,
      email: session.user.email
    });
    const url = await provider.createAuthorizationURL({
      state: state.state,
      codeVerifier: state.codeVerifier,
      redirectURI: `${c.context.baseURL}/callback/${provider.id}`
    });
    return c.json({
      url: url.toString(),
      redirect: !c.body.disableRedirect
    });
  }
);
var unlinkAccount = createAuthEndpoint(
  "/unlink-account",
  {
    method: "POST",
    body: z.object({
      providerId: z.string()
    }),
    use: [freshSessionMiddleware]
  },
  async (ctx) => {
    const accounts = await ctx.context.internalAdapter.findAccounts(
      ctx.context.session.user.id
    );
    if (accounts.length === 1) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.FAILED_TO_UNLINK_LAST_ACCOUNT
      });
    }
    const accountExist = accounts.find(
      (account) => account.providerId === ctx.body.providerId
    );
    if (!accountExist) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.ACCOUNT_NOT_FOUND
      });
    }
    await ctx.context.internalAdapter.deleteAccount(
      ctx.body.providerId,
      ctx.context.session.user.id
    );
    return ctx.json({
      status: true
    });
  }
);

// src/api/rate-limiter/index.ts
function shouldRateLimit(max, window, rateLimitData) {
  const now = Date.now();
  const windowInMs = window * 1e3;
  const timeSinceLastRequest = now - rateLimitData.lastRequest;
  return timeSinceLastRequest < windowInMs && rateLimitData.count >= max;
}
function rateLimitResponse(retryAfter) {
  return new Response(
    JSON.stringify({
      message: "Too many requests. Please try again later."
    }),
    {
      status: 429,
      statusText: "Too Many Requests",
      headers: {
        "X-Retry-After": retryAfter.toString()
      }
    }
  );
}
function getRetryAfter(lastRequest, window) {
  const now = Date.now();
  const windowInMs = window * 1e3;
  return Math.ceil((lastRequest + windowInMs - now) / 1e3);
}
function createDBStorage(ctx, modelName) {
  const model = "rateLimit";
  const db = ctx.adapter;
  return {
    get: async (key) => {
      const res = await db.findMany({
        model,
        where: [{ field: "key", value: key }]
      });
      const data = res[0];
      if (typeof data?.lastRequest === "bigint") {
        data.lastRequest = Number(data.lastRequest);
      }
      return data;
    },
    set: async (key, value, _update) => {
      try {
        if (_update) {
          await db.updateMany({
            model: modelName ?? "rateLimit",
            where: [{ field: "key", value: key }],
            update: {
              count: value.count,
              lastRequest: value.lastRequest
            }
          });
        } else {
          await db.create({
            model: modelName ?? "rateLimit",
            data: {
              key,
              count: value.count,
              lastRequest: value.lastRequest
            }
          });
        }
      } catch (e) {
        ctx.logger.error("Error setting rate limit", e);
      }
    }
  };
}
var memory = /* @__PURE__ */ new Map();
function getRateLimitStorage(ctx) {
  if (ctx.options.rateLimit?.customStorage) {
    return ctx.options.rateLimit.customStorage;
  }
  if (ctx.rateLimit.storage === "secondary-storage") {
    return {
      get: async (key) => {
        const stringified = await ctx.options.secondaryStorage?.get(key);
        return stringified ? JSON.parse(stringified) : void 0;
      },
      set: async (key, value) => {
        await ctx.options.secondaryStorage?.set?.(key, JSON.stringify(value));
      }
    };
  }
  const storage = ctx.rateLimit.storage;
  if (storage === "memory") {
    return {
      async get(key) {
        return memory.get(key);
      },
      async set(key, value, _update) {
        memory.set(key, value);
      }
    };
  }
  return createDBStorage(ctx, ctx.rateLimit.modelName);
}
async function onRequestRateLimit(req, ctx) {
  if (!ctx.rateLimit.enabled) {
    return;
  }
  const baseURL = ctx.baseURL;
  const path = req.url.replace(baseURL, "").split("?")[0];
  let window = ctx.rateLimit.window;
  let max = ctx.rateLimit.max;
  const key = getIp(req, ctx.options) + path;
  const specialRules = getDefaultSpecialRules();
  const specialRule = specialRules.find((rule) => rule.pathMatcher(path));
  if (specialRule) {
    window = specialRule.window;
    max = specialRule.max;
  }
  for (const plugin of ctx.options.plugins || []) {
    if (plugin.rateLimit) {
      const matchedRule = plugin.rateLimit.find(
        (rule) => rule.pathMatcher(path)
      );
      if (matchedRule) {
        window = matchedRule.window;
        max = matchedRule.max;
        break;
      }
    }
  }
  if (ctx.rateLimit.customRules) {
    const _path = Object.keys(ctx.rateLimit.customRules).find((p) => {
      if (p.includes("*")) {
        const isMatch2 = wildcardMatch(p)(path);
        return isMatch2;
      }
      return p === path;
    });
    if (_path) {
      const customRule = ctx.rateLimit.customRules[_path];
      const resolved = typeof customRule === "function" ? await customRule(req) : customRule;
      if (resolved) {
        window = resolved.window;
        max = resolved.max;
      }
    }
  }
  const storage = getRateLimitStorage(ctx);
  const data = await storage.get(key);
  const now = Date.now();
  if (!data) {
    await storage.set(key, {
      key,
      count: 1,
      lastRequest: now
    });
  } else {
    const timeSinceLastRequest = now - data.lastRequest;
    if (shouldRateLimit(max, window, data)) {
      const retryAfter = getRetryAfter(data.lastRequest, window);
      return rateLimitResponse(retryAfter);
    } else if (timeSinceLastRequest > window * 1e3) {
      await storage.set(
        key,
        {
          ...data,
          count: 1,
          lastRequest: now
        },
        true
      );
    } else {
      await storage.set(
        key,
        {
          ...data,
          count: data.count + 1,
          lastRequest: now
        },
        true
      );
    }
  }
}
function getDefaultSpecialRules() {
  const specialRules = [
    {
      pathMatcher(path) {
        return path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/change-password") || path.startsWith("/change-email");
      },
      window: 10,
      max: 3
    }
  ];
  return specialRules;
}
function getEndpoints(ctx, options) {
  const pluginEndpoints = options.plugins?.reduce(
    (acc, plugin) => {
      return {
        ...acc,
        ...plugin.endpoints
      };
    },
    {}
  );
  const middlewares = options.plugins?.map(
    (plugin) => plugin.middlewares?.map((m) => {
      const middleware = async (context) => {
        return m.middleware({
          ...context,
          context: {
            ...ctx,
            ...context.context
          }
        });
      };
      middleware.path = m.path;
      middleware.options = m.middleware.options;
      middleware.headers = m.middleware.headers;
      return {
        path: m.path,
        middleware
      };
    })
  ).filter((plugin) => plugin !== void 0).flat() || [];
  const baseEndpoints = {
    signInSocial,
    callbackOAuth,
    getSession: getSession(),
    signOut,
    signUpEmail: signUpEmail(),
    signInEmail,
    forgetPassword,
    resetPassword,
    verifyEmail,
    sendVerificationEmail,
    changeEmail,
    changePassword,
    setPassword,
    updateUser: updateUser(),
    deleteUser,
    forgetPasswordCallback,
    listSessions: listSessions(),
    revokeSession,
    revokeSessions,
    revokeOtherSessions,
    linkSocialAccount,
    listUserAccounts,
    deleteUserCallback,
    unlinkAccount
  };
  const endpoints = {
    ...baseEndpoints,
    ...pluginEndpoints,
    ok,
    error
  };
  let api = {};
  for (const [key, endpoint] of Object.entries(endpoints)) {
    api[key] = async (context = {}) => {
      endpoint.headers = new Headers();
      let internalCtx = {
        setHeader(key2, value) {
          endpoint.headers.set(key2, value);
        },
        setCookie(key2, value, options2) {
          setCookie(endpoint.headers, key2, value, options2);
        },
        getCookie(key2, prefix) {
          const header = context.headers;
          const cookieH = header?.get("cookie");
          const cookie = getCookie(cookieH || "", key2, prefix);
          return cookie;
        },
        getSignedCookie(key2, secret, prefix) {
          const header = context.headers;
          if (!header) {
            return null;
          }
          const cookie = getSignedCookie(header, secret, key2, prefix);
          return cookie;
        },
        async setSignedCookie(key2, value, secret, options2) {
          await setSignedCookie(endpoint.headers, key2, value, secret, options2);
        },
        redirect(url) {
          endpoint.headers.set("Location", url);
          return new APIError("FOUND");
        },
        responseHeader: endpoint.headers
      };
      let authCtx = await ctx;
      let newSession = null;
      let internalContext = {
        ...internalCtx,
        ...context,
        path: endpoint.path,
        context: {
          ...authCtx,
          ...context.context,
          session: null,
          setNewSession: function(session) {
            this.newSession = session;
            newSession = session;
          }
        }
      };
      const plugins = options.plugins || [];
      const beforeHooks = plugins.map((plugin) => {
        if (plugin.hooks?.before) {
          return plugin.hooks.before;
        }
      }).filter((plugin) => plugin !== void 0).flat();
      const afterHooks = plugins.map((plugin) => {
        if (plugin.hooks?.after) {
          return plugin.hooks.after;
        }
      }).filter((plugin) => plugin !== void 0).flat();
      if (options.hooks?.before) {
        beforeHooks.push({
          matcher: () => true,
          handler: options.hooks.before
        });
      }
      if (options.hooks?.after) {
        afterHooks.push({
          matcher: () => true,
          handler: options.hooks.after
        });
      }
      for (const hook of beforeHooks) {
        if (!hook.matcher(internalContext)) continue;
        const hookRes = await hook.handler(internalContext);
        if (hookRes && "context" in hookRes) {
          internalContext = {
            ...internalContext,
            ...hookRes.context
          };
          continue;
        }
        if (hookRes) {
          return hookRes;
        }
      }
      let endpointRes;
      try {
        endpointRes = await endpoint(internalContext);
        if (newSession) {
          internalContext.context.newSession = newSession;
        }
      } catch (e) {
        if (newSession) {
          internalContext.context.newSession = newSession;
        }
        if (e instanceof APIError) {
          if (!afterHooks?.length) {
            e.headers = endpoint.headers;
            throw e;
          }
          internalContext.context.returned = e;
          internalContext.context.returned.headers = endpoint.headers;
          for (const hook of afterHooks || []) {
            const match = hook.matcher(internalContext);
            if (match) {
              try {
                const hookRes = await hook.handler(internalContext);
                if (hookRes && "response" in hookRes) {
                  internalContext.context.returned = hookRes.response;
                }
              } catch (e2) {
                if (e2 instanceof APIError) {
                  internalContext.context.returned = e2;
                  continue;
                }
                throw e2;
              }
            }
          }
          if (internalContext.context.returned instanceof APIError) {
            internalContext.context.returned.headers = endpoint.headers;
            throw internalContext.context.returned;
          }
          return internalContext.context.returned;
        }
        throw e;
      }
      internalContext.context.returned = endpointRes;
      internalContext.responseHeader = endpoint.headers;
      for (const hook of afterHooks) {
        const match = hook.matcher(internalContext);
        if (match) {
          try {
            const hookRes = await hook.handler(internalContext);
            if (hookRes) {
              if ("responseHeader" in hookRes) {
                const headers = hookRes.responseHeader;
                internalContext.responseHeader = headers;
              } else {
                internalContext.context.returned = hookRes;
              }
            }
          } catch (e) {
            if (e instanceof APIError) {
              internalContext.context.returned = e;
              continue;
            }
            throw e;
          }
        }
      }
      const response = internalContext.context.returned;
      if (response instanceof Response) {
        endpoint.headers.forEach((value, key2) => {
          if (key2 === "set-cookie") {
            response.headers.append(key2, value);
          } else {
            response.headers.set(key2, value);
          }
        });
      }
      if (response instanceof APIError) {
        response.headers = endpoint.headers;
        throw response;
      }
      return response;
    };
    api[key].path = endpoint.path;
    api[key].method = endpoint.method;
    api[key].options = endpoint.options;
    api[key].headers = endpoint.headers;
  }
  return {
    api,
    middlewares
  };
}
var router = (ctx, options) => {
  const { api, middlewares } = getEndpoints(ctx, options);
  const basePath = new URL(ctx.baseURL).pathname;
  return createRouter(api, {
    extraContext: ctx,
    basePath,
    routerMiddleware: [
      {
        path: "/**",
        middleware: originCheckMiddleware
      },
      ...middlewares
    ],
    async onRequest(req) {
      for (const plugin of ctx.options.plugins || []) {
        if (plugin.onRequest) {
          const response = await plugin.onRequest(req, ctx);
          if (response && "response" in response) {
            return response.response;
          }
        }
      }
      return onRequestRateLimit(req, ctx);
    },
    async onResponse(res) {
      for (const plugin of ctx.options.plugins || []) {
        if (plugin.onResponse) {
          const response = await plugin.onResponse(res, ctx);
          if (response) {
            return response.response;
          }
        }
      }
      return res;
    },
    onError(e) {
      if (e instanceof APIError && e.status === "FOUND") {
        return;
      }
      if (options.onAPIError?.throw) {
        throw e;
      }
      if (options.onAPIError?.onError) {
        options.onAPIError.onError(e, ctx);
        return;
      }
      const optLogLevel = options.logger?.level;
      const log = optLogLevel === "error" || optLogLevel === "warn" || optLogLevel === "debug" ? logger : void 0;
      if (options.logger?.disabled !== true) {
        if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
          if (e.message.includes("no column") || e.message.includes("column") || e.message.includes("relation") || e.message.includes("table") || e.message.includes("does not exist")) {
            ctx.logger?.error(e.message);
            return;
          }
        }
        if (e instanceof APIError) {
          if (e.status === "INTERNAL_SERVER_ERROR") {
            ctx.logger.error(e.status, e);
          }
          log?.error(e.message);
        } else {
          ctx.logger?.error(
            e && typeof e === "object" && "name" in e ? e.name : "",
            e
          );
        }
      }
    }
  });
};

export { BASE_ERROR_CODES, callbackOAuth, changeEmail, changePassword, createAuthEndpoint, createAuthMiddleware, createEmailVerificationToken, deleteUser, deleteUserCallback, error, forgetPassword, forgetPasswordCallback, freshSessionMiddleware, getEndpoints, getSession, getSessionFromCtx, handleOAuthUserInfo, linkSocialAccount, listSessions, listUserAccounts, ok, optionsMiddleware, originCheck, originCheckMiddleware, resetPassword, revokeOtherSessions, revokeSession, revokeSessions, router, sendVerificationEmail, sendVerificationEmailFn, sessionMiddleware, setPassword, signInEmail, signInSocial, signOut, signUpEmail, unlinkAccount, updateUser, verifyEmail };
