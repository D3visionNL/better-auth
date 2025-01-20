'use strict';

var chunkWKDNDAQL_cjs = require('./chunk-WKDNDAQL.cjs');
var chunkPIETOYUJ_cjs = require('./chunk-PIETOYUJ.cjs');
var chunkDYBVL3QY_cjs = require('./chunk-DYBVL3QY.cjs');
require('./chunk-ZBKCS3KP.cjs');
var chunkBSE5DZ63_cjs = require('./chunk-BSE5DZ63.cjs');
var chunkMBMBJ43P_cjs = require('./chunk-MBMBJ43P.cjs');
var chunkOXKXXPSG_cjs = require('./chunk-OXKXXPSG.cjs');
var chunkN7VBZKE2_cjs = require('./chunk-N7VBZKE2.cjs');
var chunkH5RGYZEY_cjs = require('./chunk-H5RGYZEY.cjs');
var chunkMQVIE3DC_cjs = require('./chunk-MQVIE3DC.cjs');
var chunkH5N4W7NY_cjs = require('./chunk-H5N4W7NY.cjs');
var chunkH4GWR5SW_cjs = require('./chunk-H4GWR5SW.cjs');
var chunkDUHECX3Y_cjs = require('./chunk-DUHECX3Y.cjs');
var chunkCP7DTVTA_cjs = require('./chunk-CP7DTVTA.cjs');
var chunk2JC36KNX_cjs = require('./chunk-2JC36KNX.cjs');
var chunk3H3QVYMP_cjs = require('./chunk-3H3QVYMP.cjs');
var chunkFY5E74QP_cjs = require('./chunk-FY5E74QP.cjs');
var chunkCF7NIEGH_cjs = require('./chunk-CF7NIEGH.cjs');
require('./chunk-2X5G64P2.cjs');
require('./chunk-EHFDU6IF.cjs');
var chunkDRGY4F3Z_cjs = require('./chunk-DRGY4F3Z.cjs');
require('./chunk-6RC2OKSQ.cjs');
require('./chunk-2D7VGWTP.cjs');
require('./chunk-U4I57HJ4.cjs');
var chunkS5UORXJH_cjs = require('./chunk-S5UORXJH.cjs');
require('./chunk-OJX3P352.cjs');
require('./chunk-HH5YHQO2.cjs');
require('./chunk-ME4Q5ZEC.cjs');
var chunkH74YRRNV_cjs = require('./chunk-H74YRRNV.cjs');
require('./chunk-5E75URIA.cjs');
require('./chunk-NIMYOIVU.cjs');
require('./chunk-CCKQSGIR.cjs');
var chunkG2LZ73E2_cjs = require('./chunk-G2LZ73E2.cjs');
require('./chunk-2HPSCSV7.cjs');
var chunkVXYIYABQ_cjs = require('./chunk-VXYIYABQ.cjs');
require('./chunk-PEZRSDZS.cjs');
var zod = require('zod');

function getVenderBaseURL() {
  const vercel = chunkVXYIYABQ_cjs.env.VERCEL_URL;
  const netlify = chunkVXYIYABQ_cjs.env.NETLIFY_URL;
  const render = chunkVXYIYABQ_cjs.env.RENDER_URL;
  const aws = chunkVXYIYABQ_cjs.env.AWS_LAMBDA_FUNCTION_NAME;
  const google = chunkVXYIYABQ_cjs.env.GOOGLE_CLOUD_FUNCTION_NAME;
  const azure = chunkVXYIYABQ_cjs.env.AZURE_FUNCTION_NAME;
  return vercel || netlify || render || aws || google || azure;
}
var oAuthProxy = (opts) => {
  return {
    id: "oauth-proxy",
    endpoints: {
      oAuthProxy: chunkDRGY4F3Z_cjs.createAuthEndpoint(
        "/oauth-proxy-callback",
        {
          method: "GET",
          query: zod.z.object({
            callbackURL: zod.z.string({
              description: "The URL to redirect to after the proxy"
            }),
            cookies: zod.z.string({
              description: "The cookies to set after the proxy"
            })
          }),
          use: [chunkDRGY4F3Z_cjs.originCheck((ctx) => ctx.query.callbackURL)],
          metadata: {
            openapi: {
              description: "OAuth Proxy Callback",
              parameters: [
                {
                  in: "query",
                  name: "callbackURL",
                  required: true,
                  description: "The URL to redirect to after the proxy"
                },
                {
                  in: "query",
                  name: "cookies",
                  required: true,
                  description: "The cookies to set after the proxy"
                }
              ],
              responses: {
                302: {
                  description: "Redirect",
                  headers: {
                    Location: {
                      description: "The URL to redirect to",
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
          const cookies = ctx.query.cookies;
          const decryptedCookies = await chunkG2LZ73E2_cjs.symmetricDecrypt({
            key: ctx.context.secret,
            data: cookies
          });
          ctx.setHeader("set-cookie", decryptedCookies);
          throw ctx.redirect(ctx.query.callbackURL);
        }
      )
    },
    hooks: {
      after: [
        {
          matcher(context) {
            return context.path?.startsWith("/callback");
          },
          handler: chunkDRGY4F3Z_cjs.createAuthMiddleware(async (ctx) => {
            const response = ctx.context.returned;
            const headers = response instanceof chunkDRGY4F3Z_cjs.APIError ? response.headers : null;
            const location = headers?.get("location");
            if (location?.includes("/oauth-proxy-callback?callbackURL")) {
              if (!location.startsWith("http")) {
                return;
              }
              const locationURL = new URL(location);
              const origin = locationURL.origin;
              if (origin === chunkS5UORXJH_cjs.getOrigin(ctx.context.baseURL)) {
                const newLocation = locationURL.searchParams.get("callbackURL");
                if (!newLocation) {
                  return;
                }
                ctx.setHeader("location", newLocation);
                return;
              }
              const setCookies = headers?.get("set-cookie");
              if (!setCookies) {
                return;
              }
              const encryptedCookies = await chunkG2LZ73E2_cjs.symmetricEncrypt({
                key: ctx.context.secret,
                data: setCookies
              });
              const locationWithCookies = `${location}&cookies=${encodeURIComponent(
                encryptedCookies
              )}`;
              ctx.setHeader("location", locationWithCookies);
            }
          })
        }
      ],
      before: [
        {
          matcher(context) {
            return context.path?.startsWith("/sign-in/social");
          },
          async handler(ctx) {
            const url = new URL(
              opts?.currentURL || ctx.request?.url || getVenderBaseURL() || ctx.context.baseURL
            );
            ctx.body.callbackURL = `${url.origin}${ctx.context.options.basePath || "/api/auth"}/oauth-proxy-callback?callbackURL=${encodeURIComponent(
              ctx.body.callbackURL || ctx.context.baseURL
            )}`;
            return {
              context: ctx
            };
          }
        }
      ]
    }
  };
};

Object.defineProperty(exports, "phoneNumber", {
  enumerable: true,
  get: function () { return chunkWKDNDAQL_cjs.phoneNumber; }
});
Object.defineProperty(exports, "twoFactor", {
  enumerable: true,
  get: function () { return chunkPIETOYUJ_cjs.twoFactor; }
});
Object.defineProperty(exports, "username", {
  enumerable: true,
  get: function () { return chunkDYBVL3QY_cjs.username; }
});
Object.defineProperty(exports, "jwt", {
  enumerable: true,
  get: function () { return chunkBSE5DZ63_cjs.jwt; }
});
Object.defineProperty(exports, "magicLink", {
  enumerable: true,
  get: function () { return chunkMBMBJ43P_cjs.magicLink; }
});
Object.defineProperty(exports, "multiSession", {
  enumerable: true,
  get: function () { return chunkOXKXXPSG_cjs.multiSession; }
});
Object.defineProperty(exports, "oneTap", {
  enumerable: true,
  get: function () { return chunkN7VBZKE2_cjs.oneTap; }
});
Object.defineProperty(exports, "openAPI", {
  enumerable: true,
  get: function () { return chunkH5RGYZEY_cjs.openAPI; }
});
Object.defineProperty(exports, "organization", {
  enumerable: true,
  get: function () { return chunkMQVIE3DC_cjs.organization; }
});
Object.defineProperty(exports, "oidcProvider", {
  enumerable: true,
  get: function () { return chunkH5N4W7NY_cjs.oidcProvider; }
});
Object.defineProperty(exports, "admin", {
  enumerable: true,
  get: function () { return chunkH4GWR5SW_cjs.admin; }
});
Object.defineProperty(exports, "anonymous", {
  enumerable: true,
  get: function () { return chunkDUHECX3Y_cjs.anonymous; }
});
Object.defineProperty(exports, "bearer", {
  enumerable: true,
  get: function () { return chunkCP7DTVTA_cjs.bearer; }
});
Object.defineProperty(exports, "customSession", {
  enumerable: true,
  get: function () { return chunk2JC36KNX_cjs.customSession; }
});
Object.defineProperty(exports, "emailOTP", {
  enumerable: true,
  get: function () { return chunk3H3QVYMP_cjs.emailOTP; }
});
Object.defineProperty(exports, "genericOAuth", {
  enumerable: true,
  get: function () { return chunkFY5E74QP_cjs.genericOAuth; }
});
Object.defineProperty(exports, "twoFactorClient", {
  enumerable: true,
  get: function () { return chunkCF7NIEGH_cjs.twoFactorClient; }
});
Object.defineProperty(exports, "createAuthEndpoint", {
  enumerable: true,
  get: function () { return chunkDRGY4F3Z_cjs.createAuthEndpoint; }
});
Object.defineProperty(exports, "createAuthMiddleware", {
  enumerable: true,
  get: function () { return chunkDRGY4F3Z_cjs.createAuthMiddleware; }
});
Object.defineProperty(exports, "optionsMiddleware", {
  enumerable: true,
  get: function () { return chunkDRGY4F3Z_cjs.optionsMiddleware; }
});
Object.defineProperty(exports, "HIDE_METADATA", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.HIDE_METADATA; }
});
exports.oAuthProxy = oAuthProxy;
