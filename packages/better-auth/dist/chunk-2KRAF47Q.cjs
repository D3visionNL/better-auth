'use strict';

var chunkVADINYB6_cjs = require('./chunk-VADINYB6.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var zod = require('zod');
var fetch = require('@better-fetch/fetch');

// src/utils/boolean.ts
function toBoolean(value) {
  return value === "true" || value === true;
}

// src/plugins/one-tap/index.ts
var oneTap = (options) => ({
  id: "one-tap",
  endpoints: {
    oneTapCallback: chunkVADINYB6_cjs.createAuthEndpoint(
      "/one-tap/callback",
      {
        method: "POST",
        body: zod.z.object({
          idToken: zod.z.string({
            description: "Google ID token, which the client obtains from the One Tap API"
          })
        }),
        metadata: {
          openapi: {
            summary: "One tap callback",
            description: "Use this endpoint to authenticate with Google One Tap",
            responses: {
              200: {
                description: "Successful response",
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
              },
              400: {
                description: "Invalid token"
              }
            }
          }
        }
      },
      async (ctx) => {
        const { idToken } = ctx.body;
        const { data, error } = await fetch.betterFetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken);
        if (error) {
          return ctx.json({
            error: "Invalid token"
          });
        }
        const user = await ctx.context.internalAdapter.findUserByEmail(
          data.email
        );
        if (!user) {
          if (options?.disableSignup) {
            throw new chunkVADINYB6_cjs.APIError("BAD_GATEWAY", {
              message: "User not found"
            });
          }
          const user2 = await ctx.context.internalAdapter.createOAuthUser(
            {
              email: data.email,
              emailVerified: toBoolean(data.email_verified),
              name: data.name,
              image: data.picture
            },
            {
              providerId: "google",
              accountId: data.sub
            }
          );
          if (!user2) {
            throw new chunkVADINYB6_cjs.APIError("INTERNAL_SERVER_ERROR", {
              message: "Could not create user"
            });
          }
          const session2 = await ctx.context.internalAdapter.createSession(
            user2?.user.id,
            ctx.request
          );
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            user: user2.user,
            session: session2
          });
          return ctx.json({
            token: session2.token,
            user: {
              id: user2.user.id,
              email: user2.user.email,
              emailVerified: user2.user.emailVerified,
              name: user2.user.name,
              image: user2.user.image,
              createdAt: user2.user.createdAt,
              updatedAt: user2.user.updatedAt
            }
          });
        }
        const session = await ctx.context.internalAdapter.createSession(
          user.user.id,
          ctx.request
        );
        await chunkOJX3P352_cjs.setSessionCookie(ctx, {
          user: user.user,
          session
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
    )
  }
});

exports.oneTap = oneTap;
