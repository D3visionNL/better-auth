import { createAuthEndpoint, getSessionFromCtx } from './chunk-P6JGS32U.js';
import { z } from 'zod';

var customSession = (fn, options) => {
  return {
    id: "custom-session",
    endpoints: {
      getSession: createAuthEndpoint(
        "/get-session",
        {
          method: "GET",
          metadata: {
            CUSTOM_SESSION: true
          },
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
          )
        },
        async (ctx) => {
          const session = await getSessionFromCtx(ctx);
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

export { customSession };
