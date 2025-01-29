'use strict';

var chunkSFRU7XKE_cjs = require('./chunk-SFRU7XKE.cjs');
var chunkCV6GZJ6Y_cjs = require('./chunk-CV6GZJ6Y.cjs');
var chunkAHTU4SRG_cjs = require('./chunk-AHTU4SRG.cjs');
require('./chunk-ZBKCS3KP.cjs');
var chunkV6ZMDR3M_cjs = require('./chunk-V6ZMDR3M.cjs');
var chunkVI2ILVQD_cjs = require('./chunk-VI2ILVQD.cjs');
var chunkQEJFH5WX_cjs = require('./chunk-QEJFH5WX.cjs');
var chunkSHIFK5XF_cjs = require('./chunk-SHIFK5XF.cjs');
var chunk2DSWCSH7_cjs = require('./chunk-2DSWCSH7.cjs');
var chunkP3TZTHMB_cjs = require('./chunk-P3TZTHMB.cjs');
var chunkASGYDR3Y_cjs = require('./chunk-ASGYDR3Y.cjs');
var chunkNHKL445J_cjs = require('./chunk-NHKL445J.cjs');
var chunkVS6LW4BJ_cjs = require('./chunk-VS6LW4BJ.cjs');
var chunkAK7JUEIJ_cjs = require('./chunk-AK7JUEIJ.cjs');
var chunkPOUNV6QT_cjs = require('./chunk-POUNV6QT.cjs');
var chunkMTNRWG7N_cjs = require('./chunk-MTNRWG7N.cjs');
var chunkFS3S4EA6_cjs = require('./chunk-FS3S4EA6.cjs');
var chunkCF7NIEGH_cjs = require('./chunk-CF7NIEGH.cjs');
require('./chunk-2X5G64P2.cjs');
require('./chunk-EHFDU6IF.cjs');
var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
require('./chunk-MUVD76IU.cjs');
require('./chunk-2D7VGWTP.cjs');
require('./chunk-U4I57HJ4.cjs');
var chunkS5UORXJH_cjs = require('./chunk-S5UORXJH.cjs');
require('./chunk-OJX3P352.cjs');
require('./chunk-GJKYLDRQ.cjs');
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
      oAuthProxy: chunkNKDIPVEC_cjs.createAuthEndpoint(
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
          use: [chunkNKDIPVEC_cjs.originCheck((ctx) => ctx.query.callbackURL)],
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
          handler: chunkNKDIPVEC_cjs.createAuthMiddleware(async (ctx) => {
            const response = ctx.context.returned;
            const headers = response instanceof chunkNKDIPVEC_cjs.APIError ? response.headers : null;
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
  get: function () { return chunkSFRU7XKE_cjs.phoneNumber; }
});
Object.defineProperty(exports, "twoFactor", {
  enumerable: true,
  get: function () { return chunkCV6GZJ6Y_cjs.twoFactor; }
});
Object.defineProperty(exports, "username", {
  enumerable: true,
  get: function () { return chunkAHTU4SRG_cjs.username; }
});
Object.defineProperty(exports, "jwt", {
  enumerable: true,
  get: function () { return chunkV6ZMDR3M_cjs.jwt; }
});
Object.defineProperty(exports, "magicLink", {
  enumerable: true,
  get: function () { return chunkVI2ILVQD_cjs.magicLink; }
});
Object.defineProperty(exports, "multiSession", {
  enumerable: true,
  get: function () { return chunkQEJFH5WX_cjs.multiSession; }
});
Object.defineProperty(exports, "oneTap", {
  enumerable: true,
  get: function () { return chunkSHIFK5XF_cjs.oneTap; }
});
Object.defineProperty(exports, "openAPI", {
  enumerable: true,
  get: function () { return chunk2DSWCSH7_cjs.openAPI; }
});
Object.defineProperty(exports, "organization", {
  enumerable: true,
  get: function () { return chunkP3TZTHMB_cjs.organization; }
});
Object.defineProperty(exports, "oidcProvider", {
  enumerable: true,
  get: function () { return chunkASGYDR3Y_cjs.oidcProvider; }
});
Object.defineProperty(exports, "admin", {
  enumerable: true,
  get: function () { return chunkNHKL445J_cjs.admin; }
});
Object.defineProperty(exports, "anonymous", {
  enumerable: true,
  get: function () { return chunkVS6LW4BJ_cjs.anonymous; }
});
Object.defineProperty(exports, "bearer", {
  enumerable: true,
  get: function () { return chunkAK7JUEIJ_cjs.bearer; }
});
Object.defineProperty(exports, "customSession", {
  enumerable: true,
  get: function () { return chunkPOUNV6QT_cjs.customSession; }
});
Object.defineProperty(exports, "emailOTP", {
  enumerable: true,
  get: function () { return chunkMTNRWG7N_cjs.emailOTP; }
});
Object.defineProperty(exports, "genericOAuth", {
  enumerable: true,
  get: function () { return chunkFS3S4EA6_cjs.genericOAuth; }
});
Object.defineProperty(exports, "twoFactorClient", {
  enumerable: true,
  get: function () { return chunkCF7NIEGH_cjs.twoFactorClient; }
});
Object.defineProperty(exports, "createAuthEndpoint", {
  enumerable: true,
  get: function () { return chunkNKDIPVEC_cjs.createAuthEndpoint; }
});
Object.defineProperty(exports, "createAuthMiddleware", {
  enumerable: true,
  get: function () { return chunkNKDIPVEC_cjs.createAuthMiddleware; }
});
Object.defineProperty(exports, "optionsMiddleware", {
  enumerable: true,
  get: function () { return chunkNKDIPVEC_cjs.optionsMiddleware; }
});
Object.defineProperty(exports, "HIDE_METADATA", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.HIDE_METADATA; }
});
exports.oAuthProxy = oAuthProxy;
