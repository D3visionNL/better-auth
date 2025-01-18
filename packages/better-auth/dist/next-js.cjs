'use strict';

var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
require('./chunk-2HPSCSV7.cjs');
require('./chunk-VXYIYABQ.cjs');
require('./chunk-PEZRSDZS.cjs');
var headers = require('next/headers');

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
              const parsed = chunkOJX3P352_cjs.parseSetCookieHeader(setCookies);
              const cookieHelper = await headers.cookies();
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

exports.nextCookies = nextCookies;
exports.toNextJsHandler = toNextJsHandler;
