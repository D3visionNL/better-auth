'use strict';

var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var betterCall = require('better-call');
var hmac = require('@better-auth/utils/hmac');

var bearer = (options) => {
  return {
    id: "bearer",
    hooks: {
      before: [
        {
          matcher(context) {
            return Boolean(
              context.request?.headers.get("authorization") || context.headers?.get("authorization")
            );
          },
          handler: async (c) => {
            const token = c.request?.headers.get("authorization")?.replace("Bearer ", "") || c.headers?.get("authorization")?.replace("Bearer ", "");
            if (!token) {
              return;
            }
            let signedToken = "";
            if (token.includes(".")) {
              signedToken = token.replace("=", "");
            } else {
              if (options?.requireSignature) {
                return;
              }
              signedToken = (await betterCall.serializeSigned("", token, c.context.secret)).replace("=", "");
            }
            try {
              const decodedToken = decodeURIComponent(signedToken);
              const isValid = await hmac.createHMAC(
                "SHA-256",
                "base64urlnopad"
              ).verify(
                c.context.secret,
                decodedToken.split(".")[0],
                decodedToken.split(".")[1]
              );
              if (!isValid) {
                return;
              }
            } catch (e) {
              return;
            }
            if (c.request) {
              c.request.headers.append(
                "cookie",
                `${c.context.authCookies.sessionToken.name}=${signedToken}`
              );
            }
            if (c.headers) {
              c.headers.append(
                "cookie",
                `${c.context.authCookies.sessionToken.name}=${signedToken}`
              );
            }
            return {
              context: c
            };
          }
        }
      ],
      after: [
        {
          matcher(context) {
            return !!context.responseHeader.get("set-cookie");
          },
          handler: chunkNKDIPVEC_cjs.createAuthMiddleware(async (ctx) => {
            const setCookie = ctx.responseHeader.get("set-cookie");
            if (!setCookie) {
              return;
            }
            const parsedCookies = chunkOJX3P352_cjs.parseSetCookieHeader(setCookie);
            const cookieName = ctx.context.authCookies.sessionToken.name;
            const sessionCookie = parsedCookies.get(cookieName);
            if (!sessionCookie || !sessionCookie.value || sessionCookie["max-age"] === 0) {
              return;
            }
            const token = sessionCookie.value;
            ctx.responseHeader.set("set-auth-token", token);
            return {
              responseHeader: ctx.responseHeader
            };
          })
        }
      ]
    }
  };
};

exports.bearer = bearer;
