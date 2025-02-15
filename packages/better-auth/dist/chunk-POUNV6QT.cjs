'use strict';

var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var zod = require('zod');

var customSession = (fn, options) => {
  return {
    id: "custom-session",
    endpoints: {
      getSession: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/get-session",
        {
          method: "GET",
          metadata: {
            CUSTOM_SESSION: true
          },
          query: zod.z.optional(
            zod.z.object({
              /**
               * If cookie cache is enabled, it will disable the cache
               * and fetch the session from the database
               */
              disableCookieCache: zod.z.boolean({
                description: "Disable cookie cache and fetch session from database"
              }).or(zod.z.string().transform((v) => v === "true")).optional(),
              disableRefresh: zod.z.boolean({
                description: "Disable session refresh. Useful for checking session status, without updating the session"
              }).optional()
            })
          )
        },
        async (ctx) => {
          const session = await chunkNKDIPVEC_cjs.getSessionFromCtx(ctx);
          if (!session) {
            return ctx.json(null);
          }
          const fnResult = await fn(session);
          return ctx.json(fnResult);
        }
      )
    }
  };
};

exports.customSession = customSession;
