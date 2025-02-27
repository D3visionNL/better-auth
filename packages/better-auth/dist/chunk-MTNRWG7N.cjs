'use strict';

var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var chunkG2LZ73E2_cjs = require('./chunk-G2LZ73E2.cjs');
var chunk2HPSCSV7_cjs = require('./chunk-2HPSCSV7.cjs');
var zod = require('zod');

var types = ["email-verification", "sign-in", "forget-password"];
var emailOTP = (options) => {
  const opts = {
    expiresIn: 5 * 60,
    otpLength: 6,
    ...options
  };
  const ERROR_CODES = {
    OTP_EXPIRED: "otp expired",
    INVALID_OTP: "invalid otp",
    INVALID_EMAIL: "invalid email",
    USER_NOT_FOUND: "user not found"
  };
  return {
    id: "email-otp",
    endpoints: {
      sendVerificationOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/email-otp/send-verification-otp",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to send the OTP"
            }),
            type: zod.z.enum(types, {
              description: "Type of the OTP"
            })
          }),
          metadata: {
            openapi: {
              description: "Send verification OTP",
              responses: {
                200: {
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
          if (!options?.sendVerificationOTP) {
            ctx.context.logger.error(
              "send email verification is not implemented"
            );
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: "send email verification is not implemented"
            });
          }
          const email = ctx.body.email;
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(email)) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_EMAIL
            });
          }
          if (ctx.body.type === "forget-password" || opts.disableSignUp) {
            const user = await ctx.context.internalAdapter.findUserByEmail(email);
            if (!user) {
              return ctx.json({
                success: true
              });
            }
          }
          const otp = chunkG2LZ73E2_cjs.generateRandomString(opts.otpLength, "0-9");
          await ctx.context.internalAdapter.createVerificationValue({
            value: otp,
            identifier: `${ctx.body.type}-otp-${email}`,
            expiresAt: chunk2HPSCSV7_cjs.getDate(opts.expiresIn, "sec")
          }).catch(async (error) => {
            await ctx.context.internalAdapter.deleteVerificationByIdentifier(
              `${ctx.body.type}-otp-${email}`
            );
            await ctx.context.internalAdapter.createVerificationValue({
              value: otp,
              identifier: `${ctx.body.type}-otp-${email}`,
              expiresAt: chunk2HPSCSV7_cjs.getDate(opts.expiresIn, "sec")
            });
          });
          await options.sendVerificationOTP(
            {
              email,
              otp,
              type: ctx.body.type
            },
            ctx.request
          );
          return ctx.json({
            success: true
          });
        }
      ),
      createVerificationOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/email-otp/create-verification-otp",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to send the OTP"
            }),
            type: zod.z.enum(types, {
              description: "Type of the OTP"
            })
          }),
          metadata: {
            SERVER_ONLY: true,
            openapi: {
              description: "Create verification OTP",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
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
        async (ctx) => {
          const email = ctx.body.email;
          const otp = chunkG2LZ73E2_cjs.generateRandomString(opts.otpLength, "0-9");
          await ctx.context.internalAdapter.createVerificationValue({
            value: otp,
            identifier: `${ctx.body.type}-otp-${email}`,
            expiresAt: chunk2HPSCSV7_cjs.getDate(opts.expiresIn, "sec")
          });
          return otp;
        }
      ),
      getVerificationOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/email-otp/get-verification-otp",
        {
          method: "GET",
          query: zod.z.object({
            email: zod.z.string({
              description: "Email address to get the OTP"
            }),
            type: zod.z.enum(types)
          }),
          metadata: {
            SERVER_ONLY: true,
            openapi: {
              description: "Get verification OTP",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          otp: {
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
          const email = ctx.query.email;
          const verificationValue = await ctx.context.internalAdapter.findVerificationValue(
            `${ctx.query.type}-otp-${email}`
          );
          if (!verificationValue || verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            return ctx.json({
              otp: null
            });
          }
          return ctx.json({
            otp: verificationValue.value
          });
        }
      ),
      verifyEmailOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/email-otp/verify-email",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to verify"
            }),
            otp: zod.z.string({
              description: "OTP to verify"
            })
          }),
          metadata: {
            openapi: {
              description: "Verify email OTP",
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
          const email = ctx.body.email;
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(email)) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_EMAIL
            });
          }
          const verificationValue = await ctx.context.internalAdapter.findVerificationValue(
            `email-verification-otp-${email}`
          );
          if (!verificationValue) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OTP
            });
          }
          if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verificationValue.id
            );
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.OTP_EXPIRED
            });
          }
          const otp = ctx.body.otp;
          if (verificationValue.value !== otp) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OTP
            });
          }
          await ctx.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          const user = await ctx.context.internalAdapter.findUserByEmail(email);
          if (!user) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.USER_NOT_FOUND
            });
          }
          const updatedUser = await ctx.context.internalAdapter.updateUser(
            user.user.id,
            {
              email,
              emailVerified: true
            }
          );
          if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
            const session = await ctx.context.internalAdapter.createSession(
              updatedUser.id,
              ctx.request
            );
            await chunkOJX3P352_cjs.setSessionCookie(ctx, {
              session,
              user: updatedUser
            });
            return ctx.json({
              status: true,
              token: session.token,
              user: {
                id: updatedUser.id,
                email: updatedUser.email,
                emailVerified: updatedUser.emailVerified,
                name: updatedUser.name,
                image: updatedUser.image,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
              }
            });
          }
          return ctx.json({
            status: true,
            token: null,
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              emailVerified: updatedUser.emailVerified,
              name: updatedUser.name,
              image: updatedUser.image,
              createdAt: updatedUser.createdAt,
              updatedAt: updatedUser.updatedAt
            }
          });
        }
      ),
      signInEmailOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/sign-in/email-otp",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to sign in"
            }),
            otp: zod.z.string({
              description: "OTP sent to the email"
            })
          }),
          metadata: {
            openapi: {
              description: "Sign in with email OTP",
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
          const email = ctx.body.email;
          const verificationValue = await ctx.context.internalAdapter.findVerificationValue(
            `sign-in-otp-${email}`
          );
          if (!verificationValue) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OTP
            });
          }
          if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verificationValue.id
            );
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.OTP_EXPIRED
            });
          }
          const otp = ctx.body.otp;
          if (verificationValue.value !== otp) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OTP
            });
          }
          await ctx.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          const user = await ctx.context.internalAdapter.findUserByEmail(email);
          if (!user) {
            if (opts.disableSignUp) {
              throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
                message: ERROR_CODES.USER_NOT_FOUND
              });
            }
            const newUser = await ctx.context.internalAdapter.createUser({
              email,
              emailVerified: true,
              name: email
            });
            const session2 = await ctx.context.internalAdapter.createSession(
              newUser.id,
              ctx.request
            );
            await chunkOJX3P352_cjs.setSessionCookie(ctx, {
              session: session2,
              user: newUser
            });
            return ctx.json({
              token: session2.token,
              user: {
                id: newUser.id,
                email: newUser.email,
                emailVerified: newUser.emailVerified,
                name: newUser.name,
                image: newUser.image,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
              }
            });
          }
          if (!user.user.emailVerified) {
            await ctx.context.internalAdapter.updateUser(user.user.id, {
              emailVerified: true
            });
          }
          const session = await ctx.context.internalAdapter.createSession(
            user.user.id,
            ctx.request
          );
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            session,
            user: user.user
          });
          return ctx.json({
            token: session.token,
            user: {
              id: user.user.id,
              email: user.user.email,
              emailVerified: user.user.emailVerified,
              name: user.user.name,
              image: user.user.image,
              createdAt: user.user.createdAt,
              updatedAt: user.user.updatedAt
            }
          });
        }
      ),
      forgetPasswordEmailOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/forget-password/email-otp",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to send the OTP"
            })
          }),
          metadata: {
            openapi: {
              description: "Forget password with email OTP",
              responses: {
                200: {
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
          const email = ctx.body.email;
          const user = await ctx.context.internalAdapter.findUserByEmail(email);
          if (!user) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.USER_NOT_FOUND
            });
          }
          const otp = chunkG2LZ73E2_cjs.generateRandomString(opts.otpLength, "0-9");
          await ctx.context.internalAdapter.createVerificationValue({
            value: otp,
            identifier: `forget-password-otp-${email}`,
            expiresAt: chunk2HPSCSV7_cjs.getDate(opts.expiresIn, "sec")
          });
          await options.sendVerificationOTP(
            {
              email,
              otp,
              type: "forget-password"
            },
            ctx.request
          );
          return ctx.json({
            success: true
          });
        }
      ),
      resetPasswordEmailOTP: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/email-otp/reset-password",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to reset the password"
            }),
            otp: zod.z.string({
              description: "OTP sent to the email"
            }),
            password: zod.z.string({
              description: "New password"
            })
          }),
          metadata: {
            openapi: {
              description: "Reset password with email OTP",
              responses: {
                200: {
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
          const email = ctx.body.email;
          const user = await ctx.context.internalAdapter.findUserByEmail(
            email,
            {
              includeAccounts: true
            }
          );
          if (!user) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.USER_NOT_FOUND
            });
          }
          const verificationValue = await ctx.context.internalAdapter.findVerificationValue(
            `forget-password-otp-${email}`
          );
          if (!verificationValue) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OTP
            });
          }
          if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verificationValue.id
            );
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.OTP_EXPIRED
            });
          }
          const otp = ctx.body.otp;
          if (verificationValue.value !== otp) {
            throw new chunkNKDIPVEC_cjs.APIError("BAD_REQUEST", {
              message: ERROR_CODES.INVALID_OTP
            });
          }
          await ctx.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          const passwordHash = await ctx.context.password.hash(
            ctx.body.password
          );
          const account = user.accounts.find(
            (account2) => account2.providerId === "credential"
          );
          if (!account) {
            await ctx.context.internalAdapter.createAccount({
              userId: user.user.id,
              providerId: "credential",
              accountId: user.user.id,
              password: passwordHash
            });
          } else {
            await ctx.context.internalAdapter.updatePassword(
              user.user.id,
              passwordHash
            );
          }
          return ctx.json({
            success: true
          });
        }
      )
    },
    hooks: {
      after: [
        {
          matcher(context) {
            return !!(context.path?.startsWith("/sign-up") && opts.sendVerificationOnSignUp);
          },
          async handler(ctx) {
            const response = ctx.context.returned;
            if (response instanceof chunkNKDIPVEC_cjs.APIError) {
              return;
            }
            const email = response && "email" in response ? response.email : response instanceof Response ? response.status === 200 ? ctx.body.email : null : null;
            if (email) {
              const otp = chunkG2LZ73E2_cjs.generateRandomString(opts.otpLength, "0-9");
              await ctx.context.internalAdapter.createVerificationValue({
                value: otp,
                identifier: `email-verification-otp-${email}`,
                expiresAt: chunk2HPSCSV7_cjs.getDate(opts.expiresIn, "sec")
              });
              await options.sendVerificationOTP(
                {
                  email,
                  otp,
                  type: "email-verification"
                },
                ctx.request
              );
            }
          }
        }
      ]
    },
    $ERROR_CODES: ERROR_CODES,
    rateLimit: [
      {
        pathMatcher(path) {
          return path === "/email-otp/send-verification-otp";
        },
        window: 60,
        max: 3
      },
      {
        pathMatcher(path) {
          return path === "/email-otp/verify-email";
        },
        window: 60,
        max: 3
      },
      {
        pathMatcher(path) {
          return path === "/sign-in/email-otp";
        },
        window: 60,
        max: 3
      }
    ]
  };
};

exports.emailOTP = emailOTP;
