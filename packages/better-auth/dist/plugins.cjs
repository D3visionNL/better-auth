'use strict';

var chunkHYL7FCPZ_cjs = require('./chunk-HYL7FCPZ.cjs');
var chunkNWZ4RFD3_cjs = require('./chunk-NWZ4RFD3.cjs');
var chunkF6M56YTF_cjs = require('./chunk-F6M56YTF.cjs');
require('./chunk-ZBKCS3KP.cjs');
var chunkFRIBHXVY_cjs = require('./chunk-FRIBHXVY.cjs');
var chunkOXNEWDTR_cjs = require('./chunk-OXNEWDTR.cjs');
var chunkCNNJZ5DD_cjs = require('./chunk-CNNJZ5DD.cjs');
var chunk6RET5VUN_cjs = require('./chunk-6RET5VUN.cjs');
var chunk3UDI3KBO_cjs = require('./chunk-3UDI3KBO.cjs');
var chunkWNVUVJWN_cjs = require('./chunk-WNVUVJWN.cjs');
var chunkVASSJNPE_cjs = require('./chunk-VASSJNPE.cjs');
var chunkRAV6PSGL_cjs = require('./chunk-RAV6PSGL.cjs');
var chunkHEXBRLYO_cjs = require('./chunk-HEXBRLYO.cjs');
var chunkPSNYJEWT_cjs = require('./chunk-PSNYJEWT.cjs');
var chunk5FNK6ML5_cjs = require('./chunk-5FNK6ML5.cjs');
var chunkVUVRLFLK_cjs = require('./chunk-VUVRLFLK.cjs');
var chunkKUFFIBUM_cjs = require('./chunk-KUFFIBUM.cjs');
var chunkCF7NIEGH_cjs = require('./chunk-CF7NIEGH.cjs');
require('./chunk-2X5G64P2.cjs');
require('./chunk-EHFDU6IF.cjs');
var chunkK3D45DZU_cjs = require('./chunk-K3D45DZU.cjs');
require('./chunk-MUVD76IU.cjs');
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
      oAuthProxy: chunkK3D45DZU_cjs.createAuthEndpoint(
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
          use: [chunkK3D45DZU_cjs.originCheck((ctx) => ctx.query.callbackURL)],
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
          handler: chunkK3D45DZU_cjs.createAuthMiddleware(async (ctx) => {
            const response = ctx.context.returned;
            const headers = response instanceof chunkK3D45DZU_cjs.APIError ? response.headers : null;
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
  get: function () { return chunkHYL7FCPZ_cjs.phoneNumber; }
});
Object.defineProperty(exports, "twoFactor", {
  enumerable: true,
  get: function () { return chunkNWZ4RFD3_cjs.twoFactor; }
});
Object.defineProperty(exports, "username", {
  enumerable: true,
  get: function () { return chunkF6M56YTF_cjs.username; }
});
Object.defineProperty(exports, "jwt", {
  enumerable: true,
  get: function () { return chunkFRIBHXVY_cjs.jwt; }
});
Object.defineProperty(exports, "magicLink", {
  enumerable: true,
  get: function () { return chunkOXNEWDTR_cjs.magicLink; }
});
Object.defineProperty(exports, "multiSession", {
  enumerable: true,
  get: function () { return chunkCNNJZ5DD_cjs.multiSession; }
});
Object.defineProperty(exports, "oneTap", {
  enumerable: true,
  get: function () { return chunk6RET5VUN_cjs.oneTap; }
});
Object.defineProperty(exports, "openAPI", {
  enumerable: true,
  get: function () { return chunk3UDI3KBO_cjs.openAPI; }
});
Object.defineProperty(exports, "organization", {
  enumerable: true,
  get: function () { return chunkWNVUVJWN_cjs.organization; }
});
Object.defineProperty(exports, "oidcProvider", {
  enumerable: true,
  get: function () { return chunkVASSJNPE_cjs.oidcProvider; }
});
Object.defineProperty(exports, "admin", {
  enumerable: true,
  get: function () { return chunkRAV6PSGL_cjs.admin; }
});
Object.defineProperty(exports, "anonymous", {
  enumerable: true,
  get: function () { return chunkHEXBRLYO_cjs.anonymous; }
});
Object.defineProperty(exports, "bearer", {
  enumerable: true,
  get: function () { return chunkPSNYJEWT_cjs.bearer; }
});
Object.defineProperty(exports, "customSession", {
  enumerable: true,
  get: function () { return chunk5FNK6ML5_cjs.customSession; }
});
Object.defineProperty(exports, "emailOTP", {
  enumerable: true,
  get: function () { return chunkVUVRLFLK_cjs.emailOTP; }
});
Object.defineProperty(exports, "genericOAuth", {
  enumerable: true,
  get: function () { return chunkKUFFIBUM_cjs.genericOAuth; }
});
Object.defineProperty(exports, "twoFactorClient", {
  enumerable: true,
  get: function () { return chunkCF7NIEGH_cjs.twoFactorClient; }
});
Object.defineProperty(exports, "createAuthEndpoint", {
  enumerable: true,
  get: function () { return chunkK3D45DZU_cjs.createAuthEndpoint; }
});
Object.defineProperty(exports, "createAuthMiddleware", {
  enumerable: true,
  get: function () { return chunkK3D45DZU_cjs.createAuthMiddleware; }
});
Object.defineProperty(exports, "optionsMiddleware", {
  enumerable: true,
  get: function () { return chunkK3D45DZU_cjs.optionsMiddleware; }
});
Object.defineProperty(exports, "HIDE_METADATA", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.HIDE_METADATA; }
});
exports.oAuthProxy = oAuthProxy;
