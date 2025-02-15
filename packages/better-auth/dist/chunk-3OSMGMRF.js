import { createAuthEndpoint, createAuthMiddleware, getSessionFromCtx, APIError } from './chunk-P6JGS32U.js';
import { getOrigin } from './chunk-XFCIANZX.js';
import { setSessionCookie, parseSetCookieHeader } from './chunk-IWEXZ2ES.js';
import { mergeSchema } from './chunk-MEZ6VLJL.js';

// src/plugins/anonymous/index.ts
var schema = {
  user: {
    fields: {
      isAnonymous: {
        type: "boolean",
        required: false
      }
    }
  }
};
var anonymous = (options) => {
  const ERROR_CODES = {
    FAILED_TO_CREATE_USER: "Failed to create user",
    COULD_NOT_CREATE_SESSION: "Could not create session",
    ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: "Anonymous users cannot sign in again anonymously"
  };
  return {
    id: "anonymous",
    endpoints: {
      signInAnonymous: createAuthEndpoint(
        "/sign-in/anonymous",
        {
          method: "POST",
          metadata: {
            openapi: {
              description: "Sign in anonymously",
              responses: {
                200: {
                  description: "Sign in anonymously",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          user: {
                            $ref: "#/components/schemas/User"
                          },
                          session: {
                            $ref: "#/components/schemas/Session"
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
          const { emailDomainName = getOrigin(ctx.context.baseURL) } = options || {};
          const id = ctx.context.generateId({ model: "user" });
          const email = `temp-${id}@${emailDomainName}`;
          const newUser = await ctx.context.internalAdapter.createUser({
            id,
            email,
            emailVerified: false,
            isAnonymous: true,
            name: "Anonymous",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
          if (!newUser) {
            return ctx.json(null, {
              status: 500,
              body: {
                message: ERROR_CODES.FAILED_TO_CREATE_USER,
                status: 500
              }
            });
          }
          const session = await ctx.context.internalAdapter.createSession(
            newUser.id,
            ctx.request
          );
          if (!session) {
            return ctx.json(null, {
              status: 400,
              body: {
                message: ERROR_CODES.COULD_NOT_CREATE_SESSION
              }
            });
          }
          await setSessionCookie(ctx, {
            session,
            user: newUser
          });
          return ctx.json({
            token: session.token,
            user: {
              id: newUser.id,
              email: newUser.email,
              emailVerified: newUser.emailVerified,
              name: newUser.name,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt
            }
          });
        }
      )
    },
    hooks: {
      after: [
        {
          matcher(context) {
            const setCookie = context.responseHeader.get("set-cookie");
            const hasSessionToken = setCookie?.includes(
              context.context.authCookies.sessionToken.name
            );
            return !!hasSessionToken && (context.path.startsWith("/sign-in") || context.path.startsWith("/callback") || context.path.startsWith("/oauth2/callback") || context.path.startsWith("/magic-link/verify") || context.path.startsWith("/email-otp/verify-email"));
          },
          handler: createAuthMiddleware(async (ctx) => {
            const headers = ctx.responseHeader;
            const setCookie = headers.get("set-cookie");
            const sessionTokenName = ctx.context.authCookies.sessionToken.name;
            const sessionCookie = parseSetCookieHeader(setCookie || "").get(sessionTokenName)?.value.split(".")[0];
            if (!sessionCookie) {
              return;
            }
            const session = await getSessionFromCtx(
              ctx,
              {
                disableRefresh: true
              }
            );
            if (!session || !session.user.isAnonymous) {
              return;
            }
            if (ctx.path === "/sign-in/anonymous") {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY
              });
            }
            const newSession = ctx.context.newSession;
            if (!newSession) {
              return;
            }
            if (options?.onLinkAccount) {
              await options?.onLinkAccount?.({
                anonymousUser: session,
                newUser: newSession
              });
            }
            if (!options?.disableDeleteAnonymousUser) {
              await ctx.context.internalAdapter.deleteUser(session.user.id);
            }
          })
        }
      ]
    },
    schema: mergeSchema(schema, options?.schema),
    $ERROR_CODES: ERROR_CODES
  };
};

export { anonymous };
