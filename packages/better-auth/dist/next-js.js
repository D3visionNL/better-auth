import { parseSetCookieHeader } from './chunk-IWEXZ2ES.js';
import './chunk-FURNA6HY.js';
import './chunk-TQQSPPNA.js';
import './chunk-UNWCXKMP.js';
import { cookies } from 'next/headers';

function toNextJsHandler(auth) {
  const handler = async (request) => {
    return "handler" in auth ? auth.handler(request) : auth(request);
  };
  return {
    GET: handler,
    POST: handler
  };
}
var nextCookies = () => {
  return {
    id: "next-cookies",
    hooks: {
      after: [
        {
          matcher(ctx) {
            return true;
          },
          handler: async (ctx) => {
            const returned = ctx.responseHeader;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookies = returned?.get("set-cookie");
              if (!setCookies) return;
              const parsed = parseSetCookieHeader(setCookies);
              const cookieHelper = await cookies();
              parsed.forEach((value, key) => {
                if (!key) return;
                const opts = {
                  sameSite: value.samesite,
                  secure: value.secure,
                  maxAge: value["max-age"],
                  httpOnly: value.httponly,
                  domain: value.domain,
                  path: value.path
                };
                try {
                  cookieHelper.set(key, decodeURIComponent(value.value), opts);
                } catch (e) {
                }
              });
              return;
            }
          }
        }
      ]
    }
  };
};

export { nextCookies, toNextJsHandler };
