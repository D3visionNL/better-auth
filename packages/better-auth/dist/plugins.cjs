'use strict';

var chunk4A2ND2JN_cjs = require('./chunk-4A2ND2JN.cjs');
var chunkJFZ5NVPR_cjs = require('./chunk-JFZ5NVPR.cjs');
var chunk4S2LIYFD_cjs = require('./chunk-4S2LIYFD.cjs');
require('./chunk-ZBKCS3KP.cjs');
var chunkMYBN3AXO_cjs = require('./chunk-MYBN3AXO.cjs');
var chunkR2Y7MRBK_cjs = require('./chunk-R2Y7MRBK.cjs');
var chunkVHMCQZ4B_cjs = require('./chunk-VHMCQZ4B.cjs');
var chunkUKPEBXXJ_cjs = require('./chunk-UKPEBXXJ.cjs');
var chunkS7BF3O5O_cjs = require('./chunk-S7BF3O5O.cjs');
var chunkIJ5RUQWK_cjs = require('./chunk-IJ5RUQWK.cjs');
var chunkDHVUBWAN_cjs = require('./chunk-DHVUBWAN.cjs');
var chunkXFLIBF5N_cjs = require('./chunk-XFLIBF5N.cjs');
var chunkX24AQUES_cjs = require('./chunk-X24AQUES.cjs');
var chunkKHHEHVDN_cjs = require('./chunk-KHHEHVDN.cjs');
var chunkG5THDG5I_cjs = require('./chunk-G5THDG5I.cjs');
var chunkAJAQCPM5_cjs = require('./chunk-AJAQCPM5.cjs');
var chunkEPLMXXSE_cjs = require('./chunk-EPLMXXSE.cjs');
var chunkCF7NIEGH_cjs = require('./chunk-CF7NIEGH.cjs');
require('./chunk-2X5G64P2.cjs');
require('./chunk-EHFDU6IF.cjs');
var chunkDYWEYR5R_cjs = require('./chunk-DYWEYR5R.cjs');
require('./chunk-J7OQS4OO.cjs');
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
      oAuthProxy: chunkDYWEYR5R_cjs.createAuthEndpoint(
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
          use: [chunkDYWEYR5R_cjs.originCheck((ctx) => ctx.query.callbackURL)],
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
          handler: chunkDYWEYR5R_cjs.createAuthMiddleware(async (ctx) => {
            const response = ctx.context.returned;
            const headers = response instanceof chunkDYWEYR5R_cjs.APIError ? response.headers : null;
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
  get: function () { return chunk4A2ND2JN_cjs.phoneNumber; }
});
Object.defineProperty(exports, "twoFactor", {
  enumerable: true,
  get: function () { return chunkJFZ5NVPR_cjs.twoFactor; }
});
Object.defineProperty(exports, "username", {
  enumerable: true,
  get: function () { return chunk4S2LIYFD_cjs.username; }
});
Object.defineProperty(exports, "jwt", {
  enumerable: true,
  get: function () { return chunkMYBN3AXO_cjs.jwt; }
});
Object.defineProperty(exports, "magicLink", {
  enumerable: true,
  get: function () { return chunkR2Y7MRBK_cjs.magicLink; }
});
Object.defineProperty(exports, "multiSession", {
  enumerable: true,
  get: function () { return chunkVHMCQZ4B_cjs.multiSession; }
});
Object.defineProperty(exports, "oneTap", {
  enumerable: true,
  get: function () { return chunkUKPEBXXJ_cjs.oneTap; }
});
Object.defineProperty(exports, "openAPI", {
  enumerable: true,
  get: function () { return chunkS7BF3O5O_cjs.openAPI; }
});
Object.defineProperty(exports, "organization", {
  enumerable: true,
  get: function () { return chunkIJ5RUQWK_cjs.organization; }
});
Object.defineProperty(exports, "oidcProvider", {
  enumerable: true,
  get: function () { return chunkDHVUBWAN_cjs.oidcProvider; }
});
Object.defineProperty(exports, "admin", {
  enumerable: true,
  get: function () { return chunkXFLIBF5N_cjs.admin; }
});
Object.defineProperty(exports, "anonymous", {
  enumerable: true,
  get: function () { return chunkX24AQUES_cjs.anonymous; }
});
Object.defineProperty(exports, "bearer", {
  enumerable: true,
  get: function () { return chunkKHHEHVDN_cjs.bearer; }
});
Object.defineProperty(exports, "customSession", {
  enumerable: true,
  get: function () { return chunkG5THDG5I_cjs.customSession; }
});
Object.defineProperty(exports, "emailOTP", {
  enumerable: true,
  get: function () { return chunkAJAQCPM5_cjs.emailOTP; }
});
Object.defineProperty(exports, "genericOAuth", {
  enumerable: true,
  get: function () { return chunkEPLMXXSE_cjs.genericOAuth; }
});
Object.defineProperty(exports, "twoFactorClient", {
  enumerable: true,
  get: function () { return chunkCF7NIEGH_cjs.twoFactorClient; }
});
Object.defineProperty(exports, "createAuthEndpoint", {
  enumerable: true,
  get: function () { return chunkDYWEYR5R_cjs.createAuthEndpoint; }
});
Object.defineProperty(exports, "createAuthMiddleware", {
  enumerable: true,
  get: function () { return chunkDYWEYR5R_cjs.createAuthMiddleware; }
});
Object.defineProperty(exports, "optionsMiddleware", {
  enumerable: true,
  get: function () { return chunkDYWEYR5R_cjs.optionsMiddleware; }
});
Object.defineProperty(exports, "HIDE_METADATA", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.HIDE_METADATA; }
});
exports.oAuthProxy = oAuthProxy;
