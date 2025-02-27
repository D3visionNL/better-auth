'use strict';

var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var zod = require('zod');

var multiSession = (options) => {
  const opts = {
    maximumSessions: 5,
    ...options
  };
  const isMultiSessionCookie = (key) => key.includes("_multi-");
  const ERROR_CODES = {
    INVALID_SESSION_TOKEN: "Invalid session token"
  };
  return {
    id: "multi-session",
    endpoints: {
      listDeviceSessions: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/multi-session/list-device-sessions",
        {
          method: "GET",
          requireHeaders: true
        },
        async (ctx) => {
          const cookieHeader = ctx.headers?.get("cookie");
          if (!cookieHeader) return ctx.json([]);
          const cookies = Object.fromEntries(chunkOJX3P352_cjs.parseCookies(cookieHeader));
          const sessionTokens = (await Promise.all(
            Object.entries(cookies).filter(([key]) => isMultiSessionCookie(key)).map(
              async ([key]) => await ctx.getSignedCookie(key, ctx.context.secret)
            )
          )).filter((v) => v !== void 0);
          if (!sessionTokens.length) return ctx.json([]);
          const sessions = await ctx.context.internalAdapter.findSessions(sessionTokens);
          const validSessions = sessions.filter(
            (session) => session && session.session.expiresAt > /* @__PURE__ */ new Date()
          );
          return ctx.json(validSessions);
        }
      ),
      setActiveSession: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/multi-session/set-active",
        {
          method: "POST",
          body: zod.z.object({
            sessionToken: zod.z.string({
              description: "The session token to set as active"
            })
          }),
          requireHeaders: true,
          use: [chunkNKDIPVEC_cjs.sessionMiddleware],
          metadata: {
            openapi: {
              description: "Set the active session",
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
          const sessionToken = ctx.body.sessionToken;
          const multiSessionCookieName = `${ctx.context.authCookies.sessionToken.name}_multi-${sessionToken}`;
          const sessionCookie = await ctx.getSignedCookie(
            multiSessionCookieName,
            ctx.context.secret
          );
          if (!sessionCookie) {
            throw new chunkNKDIPVEC_cjs.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_SESSION_TOKEN
            });
          }
          const session = await ctx.context.internalAdapter.findSession(sessionToken);
          if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
            ctx.setCookie(multiSessionCookieName, "", {
              ...ctx.context.authCookies.sessionToken.options,
              maxAge: 0
            });
            throw new chunkNKDIPVEC_cjs.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_SESSION_TOKEN
            });
          }
          await chunkOJX3P352_cjs.setSessionCookie(ctx, session);
          return ctx.json(session);
        }
      ),
      revokeDeviceSession: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/multi-session/revoke",
        {
          method: "POST",
          body: zod.z.object({
            sessionToken: zod.z.string({
              description: "The session token to revoke"
            })
          }),
          requireHeaders: true,
          use: [chunkNKDIPVEC_cjs.sessionMiddleware],
          metadata: {
            openapi: {
              description: "Revoke a device session",
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
          const sessionToken = ctx.body.sessionToken;
          const multiSessionCookieName = `${ctx.context.authCookies.sessionToken.name}_multi-${sessionToken}`;
          const sessionCookie = await ctx.getSignedCookie(
            multiSessionCookieName,
            ctx.context.secret
          );
          if (!sessionCookie) {
            throw new chunkNKDIPVEC_cjs.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_SESSION_TOKEN
            });
          }
          await ctx.context.internalAdapter.deleteSession(sessionToken);
          ctx.setCookie(multiSessionCookieName, "", {
            ...ctx.context.authCookies.sessionToken.options,
            maxAge: 0
          });
          const isActive = ctx.context.session?.session.token === sessionToken;
          if (!isActive) return ctx.json({ status: true });
          const cookieHeader = ctx.headers?.get("cookie");
          if (cookieHeader) {
            const cookies = Object.fromEntries(chunkOJX3P352_cjs.parseCookies(cookieHeader));
            const sessionTokens = (await Promise.all(
              Object.entries(cookies).filter(([key]) => isMultiSessionCookie(key)).map(
                async ([key]) => await ctx.getSignedCookie(key, ctx.context.secret)
              )
            )).filter((v) => v !== void 0);
            const internalAdapter = ctx.context.internalAdapter;
            if (sessionTokens.length > 0) {
              const sessions = await internalAdapter.findSessions(sessionTokens);
              const validSessions = sessions.filter(
                (session) => session && session.session.expiresAt > /* @__PURE__ */ new Date()
              );
              if (validSessions.length > 0) {
                const nextSession = validSessions[0];
                await chunkOJX3P352_cjs.setSessionCookie(ctx, nextSession);
              } else {
                chunkOJX3P352_cjs.deleteSessionCookie(ctx);
              }
            } else {
              chunkOJX3P352_cjs.deleteSessionCookie(ctx);
            }
          } else {
            chunkOJX3P352_cjs.deleteSessionCookie(ctx);
          }
          return ctx.json({
            status: true
          });
        }
      )
    },
    hooks: {
      after: [
        {
          matcher: () => true,
          handler: chunkNKDIPVEC_cjs.createAuthMiddleware(async (ctx) => {
            const cookieString = ctx.responseHeader.get("set-cookie");
            if (!cookieString) return;
            const setCookies = chunkOJX3P352_cjs.parseSetCookieHeader(cookieString);
            const sessionCookieConfig = ctx.context.authCookies.sessionToken;
            const sessionToken = setCookies.get(
              sessionCookieConfig.name
            )?.value;
            if (!sessionToken) return;
            const cookies = chunkOJX3P352_cjs.parseCookies(ctx.headers?.get("cookie") || "");
            const rawSession = sessionToken.split(".")[0];
            if (!rawSession) {
              return;
            }
            const cookieName = `${sessionCookieConfig.name}_multi-${rawSession}`;
            if (setCookies.get(cookieName) || cookies.get(cookieName)) return;
            const currentMultiSessions = Object.keys(Object.fromEntries(cookies)).filter(
              isMultiSessionCookie
            ).length + (cookieString.includes("session_token") ? 1 : 0);
            if (currentMultiSessions > opts.maximumSessions) {
              return;
            }
            await ctx.setSignedCookie(
              cookieName,
              rawSession,
              ctx.context.secret,
              sessionCookieConfig.options
            );
          })
        },
        {
          matcher: (context) => context.path === "/sign-out",
          handler: chunkNKDIPVEC_cjs.createAuthMiddleware(async (ctx) => {
            const cookieHeader = ctx.headers?.get("cookie");
            if (!cookieHeader) return;
            const cookies = Object.fromEntries(chunkOJX3P352_cjs.parseCookies(cookieHeader));
            const ids = Object.keys(cookies).map((key) => {
              if (isMultiSessionCookie(key)) {
                ctx.setCookie(key, "", { maxAge: 0 });
                const id = key.split("_multi-")[1];
                return id;
              }
              return null;
            }).filter((v) => v !== null);
            await ctx.context.internalAdapter.deleteSessions(ids);
          })
        }
      ]
    },
    $ERROR_CODES: ERROR_CODES
  };
};

exports.multiSession = multiSession;
