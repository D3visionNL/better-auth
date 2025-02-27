'use strict';

var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var chunkG2LZ73E2_cjs = require('./chunk-G2LZ73E2.cjs');
var zod = require('zod');
var betterCall = require('better-call');

var magicLink = (options) => {
  return {
    id: "magic-link",
    endpoints: {
      signInMagicLink: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/sign-in/magic-link",
        {
          method: "POST",
          requireHeaders: true,
          body: zod.z.object({
            email: zod.z.string({
              description: "Email address to send the magic link"
            }).email(),
            name: zod.z.string({
              description: "User display name. Only used if the user is registering for the first time."
            }).optional(),
            callbackURL: zod.z.string({
              description: "URL to redirect after magic link verification"
            }).optional()
          }),
          metadata: {
            openapi: {
              description: "Sign in with magic link",
              responses: {
                200: {
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
          const { email } = ctx.body;
          if (options.disableSignUp) {
            const user = await ctx.context.internalAdapter.findUserByEmail(email);
            if (!user) {
              throw new betterCall.APIError("BAD_REQUEST", {
                message: chunkNKDIPVEC_cjs.BASE_ERROR_CODES.USER_NOT_FOUND
              });
            }
          }
          const verificationToken = chunkG2LZ73E2_cjs.generateRandomString(32, "a-z", "A-Z");
          await ctx.context.internalAdapter.createVerificationValue({
            identifier: verificationToken,
            value: JSON.stringify({ email, name: ctx.body.name }),
            expiresAt: new Date(
              Date.now() + (options.expiresIn || 60 * 5) * 1e3
            )
          });
          const url = `${ctx.context.baseURL}/magic-link/verify?token=${verificationToken}&callbackURL=${ctx.body.callbackURL || "/"}`;
          await options.sendMagicLink(
            {
              email,
              url,
              token: verificationToken
            },
            ctx.request
          );
          return ctx.json({
            status: true
          });
        }
      ),
      magicLinkVerify: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/magic-link/verify",
        {
          method: "GET",
          query: zod.z.object({
            token: zod.z.string({
              description: "Verification token"
            }),
            callbackURL: zod.z.string({
              description: "URL to redirect after magic link verification, if not provided will return session"
            }).optional()
          }),
          use: [chunkNKDIPVEC_cjs.originCheck((ctx) => ctx.query.callbackURL)],
          requireHeaders: true,
          metadata: {
            openapi: {
              description: "Verify magic link",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          session: {
                            $ref: "#/components/schemas/Session"
                          },
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
          const { token, callbackURL } = ctx.query;
          const toRedirectTo = callbackURL?.startsWith("http") ? callbackURL : callbackURL ? `${ctx.context.options.baseURL}${callbackURL}` : ctx.context.options.baseURL;
          const tokenValue = await ctx.context.internalAdapter.findVerificationValue(token);
          if (!tokenValue) {
            throw ctx.redirect(`${toRedirectTo}?error=INVALID_TOKEN`);
          }
          if (tokenValue.expiresAt < /* @__PURE__ */ new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              tokenValue.id
            );
            throw ctx.redirect(`${toRedirectTo}?error=EXPIRED_TOKEN`);
          }
          await ctx.context.internalAdapter.deleteVerificationValue(
            tokenValue.id
          );
          const { email, name } = JSON.parse(tokenValue.value);
          let user = await ctx.context.internalAdapter.findUserByEmail(email).then((res) => res?.user);
          if (!user) {
            if (!options.disableSignUp) {
              const newUser = await ctx.context.internalAdapter.createUser({
                email,
                emailVerified: true,
                name: name || email
              });
              user = newUser;
              if (!user) {
                throw ctx.redirect(
                  `${toRedirectTo}?error=failed_to_create_user`
                );
              }
            } else {
              throw ctx.redirect(`${toRedirectTo}?error=failed_to_create_user`);
            }
          }
          if (!user.emailVerified) {
            await ctx.context.internalAdapter.updateUser(user.id, {
              emailVerified: true
            });
          }
          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx.headers
          );
          if (!session) {
            throw ctx.redirect(
              `${toRedirectTo}?error=failed_to_create_session`
            );
          }
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            session,
            user
          });
          if (!callbackURL) {
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
          throw ctx.redirect(callbackURL);
        }
      )
    },
    rateLimit: [
      {
        pathMatcher(path) {
          return path.startsWith("/sign-in/magic-link") || path.startsWith("/magic-link/verify");
        },
        window: options.rateLimit?.window || 60,
        max: options.rateLimit?.max || 5
      }
    ]
  };
};

exports.magicLink = magicLink;
