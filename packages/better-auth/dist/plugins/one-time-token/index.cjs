'use strict';

const zod = require('zod');
require('better-call');
const account = require('../../shared/better-auth.iyK63nvn.cjs');
require('../../shared/better-auth.DiSjtgs9.cjs');
require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
require('../../shared/better-auth.DcWKCjjf.cjs');
require('../../shared/better-auth.D6ERC_IF.cjs');
require('../organization/access/index.cjs');
const random = require('../../shared/better-auth.CYeOI8C-.cjs');
require('../../shared/better-auth.GpOOav9x.cjs');
require('defu');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha');
require('@noble/ciphers/utils');
require('@noble/ciphers/webcrypto');
require('jose');
require('@noble/hashes/scrypt');
require('@better-auth/utils');
require('@better-auth/utils/hex');
require('@noble/hashes/utils');
require('@better-auth/utils/otp');
require('../admin/access/index.cjs');
require('@better-fetch/fetch');
require('@better-auth/utils/random');
require('../../shared/better-auth.BG6vHVNT.cjs');
require('kysely');
require('../../cookies/index.cjs');
require('../../shared/better-auth.ANpbi45u.cjs');
require('../../shared/better-auth.C1hdVENX.cjs');
require('../../shared/better-auth.D3mtHEZg.cjs');
require('../../shared/better-auth.C-R0J0n1.cjs');
require('../../shared/better-auth.CWJ7qc0w.cjs');
require('../../social-providers/index.cjs');
require('../../shared/better-auth.6XyKj7DG.cjs');
require('../../shared/better-auth.Bg6iw3ig.cjs');
require('../../shared/better-auth.BMYo0QR-.cjs');
require('jose/errors');
require('@better-auth/utils/binary');
require('../../shared/better-auth.DhsGZ30Q.cjs');
require('../../shared/better-auth.DSVbLSt7.cjs');
require('../access/index.cjs');

const oneTimeToken = (options) => {
  return {
    id: "one-time-token",
    endpoints: {
      generateOneTimeToken: account.createAuthEndpoint(
        "/one-time-token/generate",
        {
          method: "GET",
          use: [account.sessionMiddleware]
        },
        async (c) => {
          if (options?.disableClientRequest && c.request) {
            throw c.error("BAD_REQUEST", {
              message: "Client requests are disabled"
            });
          }
          const session = c.context.session;
          const token = options?.generateToken ? await options.generateToken(session, c) : random.generateRandomString(32);
          const expiresAt = new Date(
            Date.now() + (options?.expiresIn ?? 3) * 60 * 1e3
          );
          await c.context.internalAdapter.createVerificationValue({
            value: session.session.token,
            identifier: `one-time-token:${token}`,
            expiresAt
          });
          return c.json({ token });
        }
      ),
      verifyOneTimeToken: account.createAuthEndpoint(
        "/one-time-token/verify",
        {
          method: "POST",
          body: zod.z.object({
            token: zod.z.string()
          })
        },
        async (c) => {
          const { token } = c.body;
          const verificationValue = await c.context.internalAdapter.findVerificationValue(
            `one-time-token:${token}`
          );
          if (!verificationValue) {
            throw c.error("BAD_REQUEST", {
              message: "Invalid token"
            });
          }
          if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            await c.context.internalAdapter.deleteVerificationValue(
              verificationValue.id
            );
            throw c.error("BAD_REQUEST", {
              message: "Token expired"
            });
          }
          await c.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          const session = await c.context.internalAdapter.findSession(
            verificationValue.value
          );
          if (!session) {
            throw c.error("BAD_REQUEST", {
              message: "Session not found"
            });
          }
          return c.json(session);
        }
      )
    }
  };
};

exports.oneTimeToken = oneTimeToken;
