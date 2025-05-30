import { z } from 'zod';
import 'better-call';
import { c as createAuthMiddleware, a as createAuthEndpoint, o as originCheck } from '../../shared/better-auth.c4QO78Xh.mjs';
import { e as env } from '../../shared/better-auth.8zoxzg-F.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import { g as getOrigin } from '../../shared/better-auth.VTXNLFMT.mjs';
import '../../shared/better-auth.Cc72UxUH.mjs';
import '../../shared/better-auth.Cqykj82J.mjs';
import 'defu';
import { symmetricEncrypt, symmetricDecrypt } from '../../crypto/index.mjs';
import '../../cookies/index.mjs';
import '../../shared/better-auth.DdzSJf-n.mjs';
import '../../shared/better-auth.CW6D9eSx.mjs';
import '../../shared/better-auth.tB5eU6EY.mjs';
import '@better-auth/utils/random';
import '../../shared/better-auth.dn8_oqOu.mjs';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha';
import '@noble/ciphers/utils';
import '@noble/ciphers/webcrypto';
import 'jose';
import '@noble/hashes/scrypt';
import '@better-auth/utils';
import '@better-auth/utils/hex';
import '@noble/hashes/utils';
import '../../shared/better-auth.B4Qoxdgc.mjs';
import '../../social-providers/index.mjs';
import '@better-fetch/fetch';
import '../../shared/better-auth.DufyW0qf.mjs';
import '../../shared/better-auth.BUPPRXfK.mjs';
import '../../shared/better-auth.DDEbWX-S.mjs';
import 'jose/errors';
import '@better-auth/utils/binary';
import '../../shared/better-auth.OT3XFeFk.mjs';

function getVenderBaseURL() {
  const vercel = env.VERCEL_URL;
  const netlify = env.NETLIFY_URL;
  const render = env.RENDER_URL;
  const aws = env.AWS_LAMBDA_FUNCTION_NAME;
  const google = env.GOOGLE_CLOUD_FUNCTION_NAME;
  const azure = env.AZURE_FUNCTION_NAME;
  return vercel || netlify || render || aws || google || azure;
}
const oAuthProxy = (opts) => {
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
            return context.path?.startsWith("/callback") || context.path?.startsWith("/oauth2/callback");
          },
          handler: createAuthMiddleware(async (ctx) => {
            const headers = ctx.context.responseHeaders;
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
            return context.path?.startsWith("/sign-in/social") || context.path?.startsWith("/sign-in/oauth2");
          },
          handler: createAuthMiddleware(async (ctx) => {
            const url = new URL(
              opts?.currentURL || ctx.request?.url || getVenderBaseURL() || ctx.context.baseURL
            );
            const productionURL = opts?.productionURL || env.BETTER_AUTH_URL;
            if (productionURL === ctx.context.options.baseURL) {
              return;
            }
            ctx.body.callbackURL = `${url.origin}${ctx.context.options.basePath || "/api/auth"}/oauth-proxy-callback?callbackURL=${encodeURIComponent(
              ctx.body.callbackURL || ctx.context.baseURL
            )}`;
            return {
              context: ctx
            };
          })
        }
      ]
    }
  };
};

export { oAuthProxy };
