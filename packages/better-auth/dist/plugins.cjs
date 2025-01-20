'use strict';

var chunkRENZB7WA_cjs = require('./chunk-RENZB7WA.cjs');
var chunkCPP7MESR_cjs = require('./chunk-CPP7MESR.cjs');
var chunkWBYSED27_cjs = require('./chunk-WBYSED27.cjs');
require('./chunk-ZBKCS3KP.cjs');
var chunkCVEQFRTQ_cjs = require('./chunk-CVEQFRTQ.cjs');
var chunkWZWVL4N7_cjs = require('./chunk-WZWVL4N7.cjs');
var chunk66SVUDXF_cjs = require('./chunk-66SVUDXF.cjs');
var chunkXRXMJW5T_cjs = require('./chunk-XRXMJW5T.cjs');
var chunkQ4T7PEKK_cjs = require('./chunk-Q4T7PEKK.cjs');
var chunkW4Q6RC25_cjs = require('./chunk-W4Q6RC25.cjs');
var chunkKMAQSSFN_cjs = require('./chunk-KMAQSSFN.cjs');
var chunkVI6FWNOG_cjs = require('./chunk-VI6FWNOG.cjs');
var chunk3FRFRPHM_cjs = require('./chunk-3FRFRPHM.cjs');
var chunkT4EAMLW3_cjs = require('./chunk-T4EAMLW3.cjs');
var chunkX7NH35H2_cjs = require('./chunk-X7NH35H2.cjs');
var chunkVS32Z4VX_cjs = require('./chunk-VS32Z4VX.cjs');
var chunkOPB6JB4F_cjs = require('./chunk-OPB6JB4F.cjs');
var chunkCF7NIEGH_cjs = require('./chunk-CF7NIEGH.cjs');
require('./chunk-2X5G64P2.cjs');
require('./chunk-EHFDU6IF.cjs');
var chunkDUA2LDZ3_cjs = require('./chunk-DUA2LDZ3.cjs');
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
      oAuthProxy: chunkDUA2LDZ3_cjs.createAuthEndpoint(
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
          use: [chunkDUA2LDZ3_cjs.originCheck((ctx) => ctx.query.callbackURL)],
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
          handler: chunkDUA2LDZ3_cjs.createAuthMiddleware(async (ctx) => {
            const response = ctx.context.returned;
            const headers = response instanceof chunkDUA2LDZ3_cjs.APIError ? response.headers : null;
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
  get: function () { return chunkRENZB7WA_cjs.phoneNumber; }
});
Object.defineProperty(exports, "twoFactor", {
  enumerable: true,
  get: function () { return chunkCPP7MESR_cjs.twoFactor; }
});
Object.defineProperty(exports, "username", {
  enumerable: true,
  get: function () { return chunkWBYSED27_cjs.username; }
});
Object.defineProperty(exports, "jwt", {
  enumerable: true,
  get: function () { return chunkCVEQFRTQ_cjs.jwt; }
});
Object.defineProperty(exports, "magicLink", {
  enumerable: true,
  get: function () { return chunkWZWVL4N7_cjs.magicLink; }
});
Object.defineProperty(exports, "multiSession", {
  enumerable: true,
  get: function () { return chunk66SVUDXF_cjs.multiSession; }
});
Object.defineProperty(exports, "oneTap", {
  enumerable: true,
  get: function () { return chunkXRXMJW5T_cjs.oneTap; }
});
Object.defineProperty(exports, "openAPI", {
  enumerable: true,
  get: function () { return chunkQ4T7PEKK_cjs.openAPI; }
});
Object.defineProperty(exports, "organization", {
  enumerable: true,
  get: function () { return chunkW4Q6RC25_cjs.organization; }
});
Object.defineProperty(exports, "oidcProvider", {
  enumerable: true,
  get: function () { return chunkKMAQSSFN_cjs.oidcProvider; }
});
Object.defineProperty(exports, "admin", {
  enumerable: true,
  get: function () { return chunkVI6FWNOG_cjs.admin; }
});
Object.defineProperty(exports, "anonymous", {
  enumerable: true,
  get: function () { return chunk3FRFRPHM_cjs.anonymous; }
});
Object.defineProperty(exports, "bearer", {
  enumerable: true,
  get: function () { return chunkT4EAMLW3_cjs.bearer; }
});
Object.defineProperty(exports, "customSession", {
  enumerable: true,
  get: function () { return chunkX7NH35H2_cjs.customSession; }
});
Object.defineProperty(exports, "emailOTP", {
  enumerable: true,
  get: function () { return chunkVS32Z4VX_cjs.emailOTP; }
});
Object.defineProperty(exports, "genericOAuth", {
  enumerable: true,
  get: function () { return chunkOPB6JB4F_cjs.genericOAuth; }
});
Object.defineProperty(exports, "twoFactorClient", {
  enumerable: true,
  get: function () { return chunkCF7NIEGH_cjs.twoFactorClient; }
});
Object.defineProperty(exports, "createAuthEndpoint", {
  enumerable: true,
  get: function () { return chunkDUA2LDZ3_cjs.createAuthEndpoint; }
});
Object.defineProperty(exports, "createAuthMiddleware", {
  enumerable: true,
  get: function () { return chunkDUA2LDZ3_cjs.createAuthMiddleware; }
});
Object.defineProperty(exports, "optionsMiddleware", {
  enumerable: true,
  get: function () { return chunkDUA2LDZ3_cjs.optionsMiddleware; }
});
Object.defineProperty(exports, "HIDE_METADATA", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.HIDE_METADATA; }
});
exports.oAuthProxy = oAuthProxy;
