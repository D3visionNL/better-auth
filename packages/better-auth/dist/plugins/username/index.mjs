import { z } from 'zod';
import { c as createAuthMiddleware, a as createAuthEndpoint, d as sendVerificationEmailFn, B as BASE_ERROR_CODES } from '../../shared/better-auth.c4QO78Xh.mjs';
import { APIError } from 'better-call';
import { setSessionCookie } from '../../cookies/index.mjs';
import { m as mergeSchema } from '../../shared/better-auth.Cc72UxUH.mjs';
import '../../shared/better-auth.8zoxzg-F.mjs';
import '../../shared/better-auth.Cqykj82J.mjs';
import 'defu';
import '@better-auth/utils/random';
import '../../shared/better-auth.dn8_oqOu.mjs';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha';
import '@noble/ciphers/utils';
import '@noble/ciphers/webcrypto';
import '@better-auth/utils/base64';
import 'jose';
import '@noble/hashes/scrypt';
import '@better-auth/utils';
import '@better-auth/utils/hex';
import '@noble/hashes/utils';
import '../../shared/better-auth.B4Qoxdgc.mjs';
import '../../social-providers/index.mjs';
import '@better-fetch/fetch';
import '../../shared/better-auth.DufyW0qf.mjs';
import '../../shared/better-auth.CW6D9eSx.mjs';
import '../../shared/better-auth.DdzSJf-n.mjs';
import '../../shared/better-auth.tB5eU6EY.mjs';
import '../../shared/better-auth.BUPPRXfK.mjs';
import '@better-auth/utils/hmac';
import '../../shared/better-auth.DDEbWX-S.mjs';
import '../../shared/better-auth.VTXNLFMT.mjs';
import 'jose/errors';
import '@better-auth/utils/binary';

const schema = {
  user: {
    fields: {
      username: {
        type: "string",
        required: false,
        sortable: true,
        unique: true,
        returned: true,
        transform: {
          input(value) {
            return value?.toString().toLowerCase();
          }
        }
      },
      displayUsername: {
        type: "string",
        required: false
      }
    }
  }
};

const USERNAME_ERROR_CODES = {
  INVALID_USERNAME_OR_PASSWORD: "invalid username or password",
  EMAIL_NOT_VERIFIED: "email not verified",
  UNEXPECTED_ERROR: "unexpected error",
  USERNAME_IS_ALREADY_TAKEN: "username is already taken. please try another.",
  USERNAME_TOO_SHORT: "username is too short",
  USERNAME_TOO_LONG: "username is too long",
  INVALID_USERNAME: "username is invalid"
};

function defaultUsernameValidator(username2) {
  return /^[a-zA-Z0-9_.]+$/.test(username2);
}
const username = (options) => {
  return {
    id: "username",
    endpoints: {
      signInUsername: createAuthEndpoint(
        "/sign-in/username",
        {
          method: "POST",
          body: z.object({
            username: z.string({
              description: "The username of the user"
            }),
            password: z.string({
              description: "The password of the user"
            }),
            rememberMe: z.boolean({
              description: "Remember the user session"
            }).optional()
          }),
          metadata: {
            openapi: {
              summary: "Sign in with username",
              description: "Sign in with username",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          token: {
                            type: "string",
                            description: "Session token for the authenticated session"
                          },
                          user: {
                            $ref: "#/components/schemas/User"
                          }
                        },
                        required: ["token", "user"]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          if (!ctx.body.username || !ctx.body.password) {
            ctx.context.logger.error("Username or password not found");
            throw new APIError("UNAUTHORIZED", {
              message: USERNAME_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const minUsernameLength = options?.minUsernameLength || 3;
          const maxUsernameLength = options?.maxUsernameLength || 30;
          if (ctx.body.username.length < minUsernameLength) {
            ctx.context.logger.error("Username too short", {
              username: ctx.body.username
            });
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: USERNAME_ERROR_CODES.USERNAME_TOO_SHORT
            });
          }
          if (ctx.body.username.length > maxUsernameLength) {
            ctx.context.logger.error("Username too long", {
              username: ctx.body.username
            });
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: USERNAME_ERROR_CODES.USERNAME_TOO_LONG
            });
          }
          const validator = options?.usernameValidator || defaultUsernameValidator;
          if (!validator(ctx.body.username)) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: USERNAME_ERROR_CODES.INVALID_USERNAME
            });
          }
          const user = await ctx.context.adapter.findOne({
            model: "user",
            where: [
              {
                field: "username",
                value: ctx.body.username.toLowerCase()
              }
            ]
          });
          if (!user) {
            await ctx.context.password.hash(ctx.body.password);
            ctx.context.logger.error("User not found", { username });
            throw new APIError("UNAUTHORIZED", {
              message: USERNAME_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          if (!user.emailVerified && ctx.context.options.emailAndPassword?.requireEmailVerification) {
            await sendVerificationEmailFn(ctx, user);
            throw new APIError("FORBIDDEN", {
              message: USERNAME_ERROR_CODES.EMAIL_NOT_VERIFIED
            });
          }
          const account = await ctx.context.adapter.findOne({
            model: "account",
            where: [
              {
                field: "userId",
                value: user.id
              },
              {
                field: "providerId",
                value: "credential"
              }
            ]
          });
          if (!account) {
            throw new APIError("UNAUTHORIZED", {
              message: USERNAME_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const currentPassword = account?.password;
          if (!currentPassword) {
            ctx.context.logger.error("Password not found", { username });
            throw new APIError("UNAUTHORIZED", {
              message: USERNAME_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const validPassword = await ctx.context.password.verify({
            hash: currentPassword,
            password: ctx.body.password
          });
          if (!validPassword) {
            ctx.context.logger.error("Invalid password");
            throw new APIError("UNAUTHORIZED", {
              message: USERNAME_ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx,
            ctx.body.rememberMe === false
          );
          if (!session) {
            return ctx.json(null, {
              status: 500,
              body: {
                message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION
              }
            });
          }
          await setSessionCookie(
            ctx,
            { session, user },
            ctx.body.rememberMe === false
          );
          return ctx.json({
            token: session.token,
            user: {
              id: user.id,
              email: user.email,
              emailVerified: user.emailVerified,
              username: user.username,
              name: user.name,
              image: user.image,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
          });
        }
      )
    },
    schema: mergeSchema(schema, options?.schema),
    hooks: {
      before: [
        {
          matcher(context) {
            return context.path === "/sign-up/email" || context.path === "/update-user";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const username2 = ctx.body.username;
            if (username2 !== void 0 && typeof username2 === "string") {
              const minUsernameLength = options?.minUsernameLength || 3;
              const maxUsernameLength = options?.maxUsernameLength || 30;
              if (username2.length < minUsernameLength) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: USERNAME_ERROR_CODES.USERNAME_TOO_SHORT
                });
              }
              if (username2.length > maxUsernameLength) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: USERNAME_ERROR_CODES.USERNAME_TOO_LONG
                });
              }
              const validator = options?.usernameValidator || defaultUsernameValidator;
              const valid = await validator(username2);
              if (!valid) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: USERNAME_ERROR_CODES.INVALID_USERNAME
                });
              }
              const user = await ctx.context.adapter.findOne({
                model: "user",
                where: [
                  {
                    field: "username",
                    value: username2.toLowerCase()
                  }
                ]
              });
              if (user) {
                throw new APIError("UNPROCESSABLE_ENTITY", {
                  message: USERNAME_ERROR_CODES.USERNAME_IS_ALREADY_TAKEN
                });
              }
            }
          })
        },
        {
          matcher(context) {
            return context.path === "/sign-up/email" || context.path === "/update-user";
          },
          handler: createAuthMiddleware(async (ctx) => {
            if (!ctx.body.displayUsername && ctx.body.username) {
              ctx.body.displayUsername = ctx.body.username;
            }
          })
        }
      ]
    },
    $ERROR_CODES: USERNAME_ERROR_CODES
  };
};

export { USERNAME_ERROR_CODES, username };
