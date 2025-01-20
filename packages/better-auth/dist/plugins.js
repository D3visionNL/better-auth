export { phoneNumber } from './chunk-XYCVVHHL.js';
export { twoFactor } from './chunk-MGF3OFOD.js';
export { username } from './chunk-F5VAKDM5.js';
import './chunk-WMXBA6LX.js';
export { jwt } from './chunk-2KUDKVMS.js';
export { magicLink } from './chunk-FGHXNRWQ.js';
export { multiSession } from './chunk-5USC66PH.js';
export { oneTap } from './chunk-AW2AXO5V.js';
export { openAPI } from './chunk-7QBC4IRV.js';
export { organization } from './chunk-53D3ZDB4.js';
export { oidcProvider } from './chunk-FWZ5RW27.js';
export { admin } from './chunk-5JQIX7AB.js';
export { anonymous } from './chunk-LQZVYJNZ.js';
export { bearer } from './chunk-BHKSFJ4Y.js';
export { customSession } from './chunk-NB5ABPI2.js';
export { emailOTP } from './chunk-7OH7IQXX.js';
export { genericOAuth } from './chunk-4D5FQ5I2.js';
export { twoFactorClient } from './chunk-GYDUPG7X.js';
import './chunk-GBLEGHZW.js';
import './chunk-TOKZL3ZI.js';
import { createAuthEndpoint, originCheck, createAuthMiddleware, APIError } from './chunk-PZN2DNSD.js';
export { createAuthEndpoint, createAuthMiddleware, optionsMiddleware } from './chunk-PZN2DNSD.js';
import './chunk-PQWBVZN5.js';
import './chunk-M2JCNZEP.js';
import './chunk-HVHN3Y2L.js';
import { getOrigin } from './chunk-XFCIANZX.js';
import './chunk-IWEXZ2ES.js';
import './chunk-LV37BO5S.js';
import './chunk-MEZ6VLJL.js';
export { HIDE_METADATA } from './chunk-KLDFBLYL.js';
import './chunk-NPO64SVN.js';
import './chunk-SK6Y2YH6.js';
import './chunk-3XTQSPPA.js';
import { symmetricDecrypt, symmetricEncrypt } from './chunk-DBPOZRMS.js';
import './chunk-FURNA6HY.js';
import { env } from './chunk-TQQSPPNA.js';
import './chunk-UNWCXKMP.js';
import { z } from 'zod';

function getVenderBaseURL() {
  const vercel = env.VERCEL_URL;
  const netlify = env.NETLIFY_URL;
  const render = env.RENDER_URL;
  const aws = env.AWS_LAMBDA_FUNCTION_NAME;
  const google = env.GOOGLE_CLOUD_FUNCTION_NAME;
  const azure = env.AZURE_FUNCTION_NAME;
  return vercel || netlify || render || aws || google || azure;
}
var oAuthProxy = (opts) => {
  return {
    id: "oauth-proxy",
    endpoints: {
      oAuthProxy: createAuthEndpoint(
        "/oauth-proxy-callback",
        {
          method: "GET",
          query: z.object({
            callbackURL: z.string({
              description: "The URL to redirect to after the proxy"
            }),
            cookies: z.string({
              description: "The cookies to set after the proxy"
            })
          }),
          use: [originCheck((ctx) => ctx.query.callbackURL)],
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
          const decryptedCookies = await symmetricDecrypt({
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
          handler: createAuthMiddleware(async (ctx) => {
            const response = ctx.context.returned;
            const headers = response instanceof APIError ? response.headers : null;
            const location = headers?.get("location");
            if (location?.includes("/oauth-proxy-callback?callbackURL")) {
              if (!location.startsWith("http")) {
                return;
              }
              const locationURL = new URL(location);
              const origin = locationURL.origin;
              if (origin === getOrigin(ctx.context.baseURL)) {
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
              const encryptedCookies = await symmetricEncrypt({
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

export { oAuthProxy };
