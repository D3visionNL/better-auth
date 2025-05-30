import '../shared/better-auth.8zoxzg-F.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import { parseSetCookieHeader } from '../cookies/index.mjs';
import 'better-call';
import 'zod';
import { c as createAuthMiddleware } from '../shared/better-auth.c4QO78Xh.mjs';
import '../shared/better-auth.Cc72UxUH.mjs';
import '../shared/better-auth.B07VZSbw.mjs';
import '../plugins/organization/access/index.mjs';
import '../shared/better-auth.B4Qoxdgc.mjs';
import '../shared/better-auth.Cqykj82J.mjs';
import 'defu';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha';
import '@noble/ciphers/utils';
import '@noble/ciphers/webcrypto';
import 'jose';
import '@noble/hashes/scrypt';
import '@better-auth/utils';
import '@better-auth/utils/hex';
import '@noble/hashes/utils';
import '@better-auth/utils/otp';
import '../plugins/admin/access/index.mjs';
import '@better-fetch/fetch';
import '@better-auth/utils/random';
import '../shared/better-auth.fsvwNeUx.mjs';
import 'kysely';
import '../shared/better-auth.DdzSJf-n.mjs';
import '../shared/better-auth.CW6D9eSx.mjs';
import '../shared/better-auth.tB5eU6EY.mjs';
import '../shared/better-auth.VTXNLFMT.mjs';
import '../shared/better-auth.dn8_oqOu.mjs';
import '../social-providers/index.mjs';
import '../shared/better-auth.DufyW0qf.mjs';
import '../shared/better-auth.BUPPRXfK.mjs';
import '../shared/better-auth.DDEbWX-S.mjs';
import 'jose/errors';
import '@better-auth/utils/binary';
import '../shared/better-auth.ffWeg50w.mjs';
import '../shared/better-auth.OuYYTHC7.mjs';
import '../plugins/access/index.mjs';

function toNextJsHandler(auth) {
  const handler = async (request) => {
    return "handler" in auth ? auth.handler(request) : auth(request);
  };
  return {
    GET: handler,
    POST: handler
  };
}
const nextCookies = () => {
  return {
    id: "next-cookies",
    hooks: {
      after: [
        {
          matcher(ctx) {
            return true;
          },
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookies = returned?.get("set-cookie");
              if (!setCookies) return;
              const parsed = parseSetCookieHeader(setCookies);
              const { cookies } = await import('next/headers');
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
          })
        }
      ]
    }
  };
};

export { nextCookies, toNextJsHandler };
