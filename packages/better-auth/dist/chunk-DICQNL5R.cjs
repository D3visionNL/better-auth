'use strict';

var chunkZBKCS3KP_cjs = require('./chunk-ZBKCS3KP.cjs');
var chunkVADINYB6_cjs = require('./chunk-VADINYB6.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var chunkWRPAFI4I_cjs = require('./chunk-WRPAFI4I.cjs');
var zod = require('zod');
var betterCall = require('better-call');

// src/plugins/username/schema.ts
var schema = {
  user: {
    fields: {
      username: {
        type: "string",
        required: false,
        unique: true,
        returned: true,
        transform: {
          input(value) {
            return value?.toString().toLowerCase();
          }
        }
      }
    }
  }
};

// src/plugins/username/index.ts
var username = (options) => {
  const ERROR_CODES = {
    INVALID_USERNAME_OR_PASSWORD: "invalid username or password",
    EMAIL_NOT_VERIFIED: "email not verified",
    UNEXPECTED_ERROR: "unexpected error",
    USERNAME_IS_ALREADY_TAKEN: "username is already taken. please try another."
  };
  return {
    id: "username",
    endpoints: {
      signInUsername: chunkVADINYB6_cjs.createAuthEndpoint(
        "/sign-in/username",
        {
          method: "POST",
          body: zod.z.object({
            username: zod.z.string({
              description: "The username of the user"
            }),
            password: zod.z.string({
              description: "The password of the user"
            }),
            rememberMe: zod.z.boolean({
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
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          if (!user.emailVerified && ctx.context.options.emailAndPassword?.requireEmailVerification) {
            await chunkVADINYB6_cjs.sendVerificationEmailFn(ctx, user);
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
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
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const currentPassword = account?.password;
          if (!currentPassword) {
            ctx.context.logger.error("Password not found", { username });
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const validPassword = await ctx.context.password.verify({
            hash: currentPassword,
            password: ctx.body.password
          });
          if (!validPassword) {
            ctx.context.logger.error("Invalid password");
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD
            });
          }
          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx.request,
            ctx.body.rememberMe === false
          );
          if (!session) {
            return ctx.json(null, {
              status: 500,
              body: {
                message: chunkVADINYB6_cjs.BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION,
                status: 500
              }
            });
          }
          await chunkOJX3P352_cjs.setSessionCookie(
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
              name: user.name,
              image: user.image,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
          });
        }
      )
    },
    schema: chunkWRPAFI4I_cjs.mergeSchema(schema, options?.schema),
    hooks: {
      before: [
        {
          matcher(context) {
            return context.path === "/sign-up/email";
          },
          async handler(ctx) {
            const username2 = ctx.body.username;
            if (username2) {
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
                throw new betterCall.APIError("UNPROCESSABLE_ENTITY", {
                  message: ERROR_CODES.USERNAME_IS_ALREADY_TAKEN
                });
              }
            }
          }
        }
      ]
    },
    $ERROR_CODES: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES
  };
};

exports.username = username;
