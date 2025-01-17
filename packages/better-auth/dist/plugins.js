export { twoFactor } from './chunk-FPLOAA3L.js';
export { username } from './chunk-EPI6I7I5.js';
import './chunk-WMXBA6LX.js';
export { magicLink } from './chunk-G7UTRW64.js';
export { multiSession } from './chunk-2BRUVYG4.js';
export { oneTap } from './chunk-6XFMDBNJ.js';
export { openAPI } from './chunk-ZETM5PP5.js';
export { organization } from './chunk-U6GVHSHT.js';
export { oidcProvider } from './chunk-LMBJI5AS.js';
export { phoneNumber } from './chunk-OWTPH73C.js';
export { admin } from './chunk-U7I4BCDK.js';
export { anonymous } from './chunk-6NMWS2S3.js';
export { bearer } from './chunk-L4E7N7DF.js';
export { customSession } from './chunk-QLQ3JH2U.js';
export { emailOTP } from './chunk-4TIFD76R.js';
export { genericOAuth } from './chunk-76PFBXXD.js';
export { jwt } from './chunk-U6BEDC3F.js';
export { twoFactorClient } from './chunk-GYDUPG7X.js';
import './chunk-GBLEGHZW.js';
import './chunk-TOKZL3ZI.js';
import { createAuthEndpoint, originCheck, createAuthMiddleware, APIError } from './chunk-BTIGCS3E.js';
export { createAuthEndpoint, createAuthMiddleware, optionsMiddleware } from './chunk-BTIGCS3E.js';
import './chunk-USVA5AOK.js';
import './chunk-EQHSHTP2.js';
import './chunk-HVHN3Y2L.js';
import { getOrigin } from './chunk-XFCIANZX.js';
import './chunk-IWEXZ2ES.js';
import './chunk-WMXORMNQ.js';
import './chunk-BO77WNCJ.js';
export { HIDE_METADATA } from './chunk-KLDFBLYL.js';
import './chunk-6YL5J5JY.js';
import './chunk-SK6Y2YH6.js';
import './chunk-3XTQSPPA.js';
import { symmetricDecrypt, symmetricEncrypt } from './chunk-WN2RDYR6.js';
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
