'use strict';

var chunkZBKCS3KP_cjs = require('./chunk-ZBKCS3KP.cjs');
var chunkEHFDU6IF_cjs = require('./chunk-EHFDU6IF.cjs');
var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var chunkME4Q5ZEC_cjs = require('./chunk-ME4Q5ZEC.cjs');
var chunkG2LZ73E2_cjs = require('./chunk-G2LZ73E2.cjs');
var zod = require('zod');
var betterCall = require('better-call');
var hmac = require('@better-auth/utils/hmac');
var otp = require('@better-auth/utils/otp');

// src/plugins/two-factor/constant.ts
var TWO_FACTOR_COOKIE_NAME = "two_factor";
var TRUST_DEVICE_COOKIE_NAME = "trust_device";
var verifyTwoFactorMiddleware = chunkNKDIPVEC_cjs.createAuthMiddleware(
  {
    body: zod.z.object({
      /**
       * if true, the device will be trusted
       * for 30 days. It'll be refreshed on
       * every sign in request within this time.
       */
      trustDevice: zod.z.boolean().optional()
    })
  },
  async (ctx) => {
    const session = await chunkNKDIPVEC_cjs.getSessionFromCtx(ctx);
    if (!session) {
      const cookieName = ctx.context.createAuthCookie(TWO_FACTOR_COOKIE_NAME);
      const userId = await ctx.getSignedCookie(
        cookieName.name,
        ctx.context.secret
      );
      if (!userId) {
        throw new betterCall.APIError("UNAUTHORIZED", {
          message: "invalid two factor cookie"
        });
      }
      const user = await ctx.context.internalAdapter.findUserById(
        userId
      );
      if (!user) {
        throw new betterCall.APIError("UNAUTHORIZED", {
          message: "invalid two factor cookie"
        });
      }
      const session2 = await ctx.context.internalAdapter.createSession(
        userId,
        ctx.request
      );
      if (!session2) {
        throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
          message: "failed to create session"
        });
      }
      return {
        valid: async () => {
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            session: session2,
            user
          });
          if (ctx.body.trustDevice) {
            const trustDeviceCookie = ctx.context.createAuthCookie(
              TRUST_DEVICE_COOKIE_NAME,
              {
                maxAge: 30 * 24 * 60 * 60
                // 30 days, it'll be refreshed on sign in requests
              }
            );
            const token = await hmac.createHMAC("SHA-256", "base64urlnopad").sign(
              ctx.context.secret,
              `${user.id}!${session2.token}`
            );
            await ctx.setSignedCookie(
              trustDeviceCookie.name,
              `${token}!${session2.token}`,
              ctx.context.secret,
              trustDeviceCookie.attributes
            );
          }
          return ctx.json({
            token: session2.token,
            user: {
              id: user.id,
              email: user.email,
              emailVerified: user.emailVerified,
              name: user.name,
              image: user.image,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            }
          });
        },
        invalid: async () => {
          throw new betterCall.APIError("UNAUTHORIZED", {
            message: "invalid two factor authentication"
          });
        },
        session: {
          session: session2,
          user
        }
      };
    }
    return {
      valid: async () => {
        return ctx.json({
          token: session.session.token,
          user: {
            id: session.user.id,
            email: session.user.email,
            emailVerified: session.user.emailVerified,
            name: session.user.name,
            image: session.user.image,
            createdAt: session.user.createdAt,
            updatedAt: session.user.updatedAt
          }
        });
      },
      invalid: async () => {
        throw new betterCall.APIError("UNAUTHORIZED", {
          message: "invalid two factor authentication"
        });
      },
      session
    };
  }
);
function generateBackupCodesFn(options) {
  return Array.from({ length: 10 }).fill(null).map(() => chunkG2LZ73E2_cjs.generateRandomString(10, "a-z", "0-9", "A-Z")).map((code) => `${code.slice(0, 5)}-${code.slice(5)}`);
}
async function generateBackupCodes(secret, options) {
  const key = secret;
  const backupCodes = options?.customBackupCodesGenerate ? options.customBackupCodesGenerate() : generateBackupCodesFn();
  const encCodes = await chunkG2LZ73E2_cjs.symmetricEncrypt({
    data: JSON.stringify(backupCodes),
    key
  });
  return {
    backupCodes,
    encryptedBackupCodes: encCodes
  };
}
async function verifyBackupCode(data, key) {
  const codes = await getBackupCodes(data.backupCodes, key);
  if (!codes) {
    return {
      status: false,
      updated: null
    };
  }
  return {
    status: codes.includes(data.code),
    updated: codes.filter((code) => code !== data.code)
  };
}
async function getBackupCodes(backupCodes, key) {
  const secret = Buffer.from(
    await chunkG2LZ73E2_cjs.symmetricDecrypt({ key, data: backupCodes })
  ).toString("utf-8");
  const data = JSON.parse(secret);
  const result = zod.z.array(zod.z.string()).safeParse(data);
  if (result.success) {
    return result.data;
  }
  return null;
}
var backupCode2fa = (options) => {
  const twoFactorTable = "twoFactor";
  return {
    id: "backup_code",
    endpoints: {
      verifyBackupCode: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/two-factor/verify-backup-code",
        {
          method: "POST",
          body: zod.z.object({
            code: zod.z.string(),
            /**
             * Disable setting the session cookie
             */
            disableSession: zod.z.boolean().optional()
          }),
          use: [verifyTwoFactorMiddleware]
        },
        async (ctx) => {
          const user = ctx.context.session.user;
          const twoFactor2 = await ctx.context.adapter.findOne({
            model: twoFactorTable,
            where: [
              {
                field: "userId",
                value: user.id
              }
            ]
          });
          if (!twoFactor2) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.BACKUP_CODES_NOT_ENABLED
            });
          }
          const validate = await verifyBackupCode(
            {
              backupCodes: twoFactor2.backupCodes,
              code: ctx.body.code
            },
            ctx.context.secret
          );
          if (!validate.status) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.INVALID_BACKUP_CODE
            });
          }
          const updatedBackupCodes = await chunkG2LZ73E2_cjs.symmetricEncrypt({
            key: ctx.context.secret,
            data: JSON.stringify(validate.updated)
          });
          await ctx.context.adapter.updateMany({
            model: twoFactorTable,
            update: {
              backupCodes: updatedBackupCodes
            },
            where: [
              {
                field: "userId",
                value: user.id
              }
            ]
          });
          if (!ctx.body.disableSession) {
            await chunkOJX3P352_cjs.setSessionCookie(ctx, {
              session: ctx.context.session.session,
              user
            });
          }
          return ctx.json({
            user,
            session: ctx.context.session
          });
        }
      ),
      generateBackupCodes: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/two-factor/generate-backup-codes",
        {
          method: "POST",
          body: zod.z.object({
            password: zod.z.string()
          }),
          use: [chunkNKDIPVEC_cjs.sessionMiddleware]
        },
        async (ctx) => {
          const user = ctx.context.session.user;
          if (!user.twoFactorEnabled) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.TWO_FACTOR_NOT_ENABLED
            });
          }
          await ctx.context.password.checkPassword(user.id, ctx);
          const backupCodes = await generateBackupCodes(
            ctx.context.secret,
            options
          );
          await ctx.context.adapter.update({
            model: twoFactorTable,
            update: {
              backupCodes: backupCodes.encryptedBackupCodes
            },
            where: [
              {
                field: "userId",
                value: ctx.context.session.user.id
              }
            ]
          });
          return ctx.json({
            status: true,
            backupCodes: backupCodes.backupCodes
          });
        }
      ),
      viewBackupCodes: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/two-factor/view-backup-codes",
        {
          method: "GET",
          body: zod.z.object({
            userId: zod.z.string()
          }),
          metadata: {
            SERVER_ONLY: true
          }
        },
        async (ctx) => {
          const twoFactor2 = await ctx.context.adapter.findOne({
            model: twoFactorTable,
            where: [
              {
                field: "userId",
                value: ctx.body.userId
              }
            ]
          });
          if (!twoFactor2) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: "Backup codes aren't enabled"
            });
          }
          const backupCodes = await getBackupCodes(
            twoFactor2.backupCodes,
            ctx.context.secret
          );
          if (!backupCodes) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.BACKUP_CODES_NOT_ENABLED
            });
          }
          return ctx.json({
            status: true,
            backupCodes
          });
        }
      )
    }
  };
};
var otp2fa = (options) => {
  const opts = {
    ...options,
    digits: options?.digits || 6,
    period: (options?.period || 3) * 60 * 1e3
  };
  const twoFactorTable = "twoFactor";
  const send2FaOTP = chunkNKDIPVEC_cjs.createAuthEndpoint(
    "/two-factor/send-otp",
    {
      method: "POST",
      use: [verifyTwoFactorMiddleware],
      metadata: {
        openapi: {
          summary: "Send two factor OTP",
          description: "Send two factor OTP to the user",
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "boolean"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      if (!options || !options.sendOTP) {
        ctx.context.logger.error(
          "send otp isn't configured. Please configure the send otp function on otp options."
        );
        throw new betterCall.APIError("BAD_REQUEST", {
          message: "otp isn't configured"
        });
      }
      const user = ctx.context.session.user;
      const twoFactor2 = await ctx.context.adapter.findOne({
        model: twoFactorTable,
        where: [
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!twoFactor2) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.OTP_NOT_ENABLED
        });
      }
      const code = chunkG2LZ73E2_cjs.generateRandomString(opts.digits, "0-9");
      await ctx.context.internalAdapter.createVerificationValue({
        value: code,
        identifier: `2fa-otp-${user.id}`,
        expiresAt: new Date(Date.now() + opts.period)
      });
      await options.sendOTP({ user, otp: code }, ctx.request);
      return ctx.json({ status: true });
    }
  );
  const verifyOTP = chunkNKDIPVEC_cjs.createAuthEndpoint(
    "/two-factor/verify-otp",
    {
      method: "POST",
      body: zod.z.object({
        code: zod.z.string({
          description: "The otp code to verify"
        })
      }),
      use: [verifyTwoFactorMiddleware],
      metadata: {
        openapi: {
          summary: "Verify two factor OTP",
          description: "Verify two factor OTP",
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "boolean"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      const user = ctx.context.session.user;
      if (!user.twoFactorEnabled) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: "two factor isn't enabled"
        });
      }
      const twoFactor2 = await ctx.context.adapter.findOne({
        model: twoFactorTable,
        where: [
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!twoFactor2) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.OTP_NOT_ENABLED
        });
      }
      const toCheckOtp = await ctx.context.internalAdapter.findVerificationValue(
        `2fa-otp-${user.id}`
      );
      if (!toCheckOtp || toCheckOtp.expiresAt < /* @__PURE__ */ new Date()) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.OTP_HAS_EXPIRED
        });
      }
      if (toCheckOtp.value === ctx.body.code) {
        return ctx.context.valid();
      } else {
        return ctx.context.invalid();
      }
    }
  );
  return {
    id: "otp",
    endpoints: {
      sendTwoFactorOTP: send2FaOTP,
      verifyTwoFactorOTP: verifyOTP
    }
  };
};
var totp2fa = (options) => {
  const opts = {
    ...options,
    digits: options?.digits || 6,
    period: options?.period || 30
  };
  const twoFactorTable = "twoFactor";
  const generateTOTP = chunkNKDIPVEC_cjs.createAuthEndpoint(
    "/totp/generate",
    {
      method: "POST",
      use: [chunkNKDIPVEC_cjs.sessionMiddleware],
      metadata: {
        openapi: {
          summary: "Generate TOTP code",
          description: "Use this endpoint to generate a TOTP code",
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      if (options?.disable) {
        ctx.context.logger.error(
          "totp isn't configured. please pass totp option on two factor plugin to enable totp"
        );
        throw new betterCall.APIError("BAD_REQUEST", {
          message: "totp isn't configured"
        });
      }
      const user = ctx.context.session.user;
      const twoFactor2 = await ctx.context.adapter.findOne({
        model: twoFactorTable,
        where: [
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!twoFactor2) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.TOTP_NOT_ENABLED
        });
      }
      const code = await otp.createOTP(twoFactor2.secret, {
        period: opts.period,
        digits: opts.digits
      }).totp();
      return { code };
    }
  );
  const getTOTPURI = chunkNKDIPVEC_cjs.createAuthEndpoint(
    "/two-factor/get-totp-uri",
    {
      method: "POST",
      use: [chunkNKDIPVEC_cjs.sessionMiddleware],
      body: zod.z.object({
        password: zod.z.string({
          description: "User password"
        })
      }),
      metadata: {
        openapi: {
          summary: "Get TOTP URI",
          description: "Use this endpoint to get the TOTP URI",
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totpURI: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      if (options?.disable) {
        ctx.context.logger.error(
          "totp isn't configured. please pass totp option on two factor plugin to enable totp"
        );
        throw new betterCall.APIError("BAD_REQUEST", {
          message: "totp isn't configured"
        });
      }
      const user = ctx.context.session.user;
      const twoFactor2 = await ctx.context.adapter.findOne({
        model: twoFactorTable,
        where: [
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!twoFactor2 || !user.twoFactorEnabled) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.TOTP_NOT_ENABLED
        });
      }
      const secret = await chunkG2LZ73E2_cjs.symmetricDecrypt({
        key: ctx.context.secret,
        data: twoFactor2.secret
      });
      await ctx.context.password.checkPassword(user.id, ctx);
      const totpURI = otp.createOTP(secret, {
        digits: opts.digits,
        period: opts.period
      }).url(options?.issuer || ctx.context.appName, user.email);
      return {
        totpURI
      };
    }
  );
  const verifyTOTP = chunkNKDIPVEC_cjs.createAuthEndpoint(
    "/two-factor/verify-totp",
    {
      method: "POST",
      body: zod.z.object({
        code: zod.z.string({
          description: "The otp code to verify"
        })
      }),
      use: [verifyTwoFactorMiddleware],
      metadata: {
        openapi: {
          summary: "Verify two factor TOTP",
          description: "Verify two factor TOTP",
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "boolean"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      if (options?.disable) {
        ctx.context.logger.error(
          "totp isn't configured. please pass totp option on two factor plugin to enable totp"
        );
        throw new betterCall.APIError("BAD_REQUEST", {
          message: "totp isn't configured"
        });
      }
      const user = ctx.context.session.user;
      const twoFactor2 = await ctx.context.adapter.findOne({
        model: twoFactorTable,
        where: [
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!twoFactor2) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: chunkZBKCS3KP_cjs.TWO_FACTOR_ERROR_CODES.TOTP_NOT_ENABLED
        });
      }
      const decrypted = await chunkG2LZ73E2_cjs.symmetricDecrypt({
        key: ctx.context.secret,
        data: twoFactor2.secret
      });
      const status = await otp.createOTP(decrypted, {
        period: opts.period,
        digits: opts.digits
      }).verify(ctx.body.code);
      if (!status) {
        return ctx.context.invalid();
      }
      if (!user.twoFactorEnabled) {
        const updatedUser = await ctx.context.internalAdapter.updateUser(
          user.id,
          {
            twoFactorEnabled: true
          }
        );
        const newSession = await ctx.context.internalAdapter.createSession(
          user.id,
          ctx.request,
          false,
          ctx.context.session.session
        ).catch((e) => {
          throw e;
        });
        await ctx.context.internalAdapter.deleteSession(
          ctx.context.session.session.token
        );
        await chunkOJX3P352_cjs.setSessionCookie(ctx, {
          session: newSession,
          user: updatedUser
        });
      }
      return ctx.context.valid();
    }
  );
  return {
    id: "totp",
    endpoints: {
      generateTOTP,
      getTOTPURI,
      verifyTOTP
    }
  };
};

// src/plugins/two-factor/schema.ts
var schema = {
  user: {
    fields: {
      twoFactorEnabled: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false
      }
    }
  },
  twoFactor: {
    fields: {
      secret: {
        type: "string",
        required: true,
        returned: false
      },
      backupCodes: {
        type: "string",
        required: true,
        returned: false
      },
      userId: {
        type: "string",
        required: true,
        returned: false,
        references: {
          model: "user",
          field: "id"
        }
      }
    }
  }
};
var twoFactor = (options) => {
  const opts = {
    twoFactorTable: "twoFactor"
  };
  const totp = totp2fa(options?.totpOptions);
  const backupCode = backupCode2fa(options?.backupCodeOptions);
  const otp$1 = otp2fa(options?.otpOptions);
  return {
    id: "two-factor",
    endpoints: {
      ...totp.endpoints,
      ...otp$1.endpoints,
      ...backupCode.endpoints,
      enableTwoFactor: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/two-factor/enable",
        {
          method: "POST",
          body: zod.z.object({
            password: zod.z.string({
              description: "User password"
            }).min(8)
          }),
          use: [chunkNKDIPVEC_cjs.sessionMiddleware],
          metadata: {
            openapi: {
              summary: "Enable two factor authentication",
              description: "Use this endpoint to enable two factor authentication. This will generate a TOTP URI and backup codes. Once the user verifies the TOTP URI, the two factor authentication will be enabled.",
              responses: {
                200: {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          totpURI: {
                            type: "string",
                            description: "TOTP URI"
                          },
                          backupCodes: {
                            type: "array",
                            items: {
                              type: "string"
                            },
                            description: "Backup codes"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          const user = ctx.context.session.user;
          const { password } = ctx.body;
          const isPasswordValid = await chunkEHFDU6IF_cjs.validatePassword(ctx, {
            password,
            userId: user.id
          });
          if (!isPasswordValid) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: chunkNKDIPVEC_cjs.BASE_ERROR_CODES.INVALID_PASSWORD
            });
          }
          const secret = chunkG2LZ73E2_cjs.generateRandomString(32);
          const encryptedSecret = await chunkG2LZ73E2_cjs.symmetricEncrypt({
            key: ctx.context.secret,
            data: secret
          });
          const backupCodes = await generateBackupCodes(
            ctx.context.secret,
            options?.backupCodeOptions
          );
          if (options?.skipVerificationOnEnable) {
            const updatedUser = await ctx.context.internalAdapter.updateUser(
              user.id,
              {
                twoFactorEnabled: true
              }
            );
            const newSession = await ctx.context.internalAdapter.createSession(
              updatedUser.id,
              ctx.request,
              false,
              ctx.context.session.session
            );
            await chunkOJX3P352_cjs.setSessionCookie(ctx, {
              session: newSession,
              user: updatedUser
            });
            await ctx.context.internalAdapter.deleteSession(
              ctx.context.session.session.token
            );
          }
          await ctx.context.adapter.deleteMany({
            model: opts.twoFactorTable,
            where: [
              {
                field: "userId",
                value: user.id
              }
            ]
          });
          await ctx.context.adapter.create({
            model: opts.twoFactorTable,
            data: {
              secret: encryptedSecret,
              backupCodes: backupCodes.encryptedBackupCodes,
              userId: user.id
            }
          });
          const totpURI = otp.createOTP(secret, {
            digits: options?.totpOptions?.digits || 6,
            period: options?.totpOptions?.period
          }).url(options?.issuer || ctx.context.appName, user.email);
          return ctx.json({ totpURI, backupCodes: backupCodes.backupCodes });
        }
      ),
      disableTwoFactor: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/two-factor/disable",
        {
          method: "POST",
          body: zod.z.object({
            password: zod.z.string({
              description: "User password"
            }).min(8)
          }),
          use: [chunkNKDIPVEC_cjs.sessionMiddleware],
          metadata: {
            openapi: {
              summary: "Disable two factor authentication",
              description: "Use this endpoint to disable two factor authentication.",
              responses: {
                200: {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          status: {
                            type: "boolean"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          const user = ctx.context.session.user;
          const { password } = ctx.body;
          const isPasswordValid = await chunkEHFDU6IF_cjs.validatePassword(ctx, {
            password,
            userId: user.id
          });
          if (!isPasswordValid) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: "Invalid password"
            });
          }
          const updatedUser = await ctx.context.internalAdapter.updateUser(
            user.id,
            {
              twoFactorEnabled: false
            }
          );
          await ctx.context.adapter.delete({
            model: opts.twoFactorTable,
            where: [
              {
                field: "userId",
                value: updatedUser.id
              }
            ]
          });
          const newSession = await ctx.context.internalAdapter.createSession(
            updatedUser.id,
            ctx.request,
            false,
            ctx.context.session.session
          );
          await chunkOJX3P352_cjs.setSessionCookie(ctx, {
            session: newSession,
            user: updatedUser
          });
          await ctx.context.internalAdapter.deleteSession(
            ctx.context.session.session.token
          );
          return ctx.json({ status: true });
        }
      )
    },
    options,
    hooks: {
      after: [
        {
          matcher(context) {
            return context.path === "/sign-in/email" || context.path === "/sign-in/username" || context.path === "/sign-in/phone-number";
          },
          handler: chunkNKDIPVEC_cjs.createAuthMiddleware(async (ctx) => {
            const data = ctx.context.newSession;
            if (!data) {
              return;
            }
            if (!data?.user.twoFactorEnabled) {
              return;
            }
            const trustDeviceCookieName = ctx.context.createAuthCookie(
              TRUST_DEVICE_COOKIE_NAME
            );
            const trustDeviceCookie = await ctx.getSignedCookie(
              trustDeviceCookieName.name,
              ctx.context.secret
            );
            if (trustDeviceCookie) {
              const [token, sessionToken] = trustDeviceCookie.split("!");
              const expectedToken = await hmac.createHMAC(
                "SHA-256",
                "base64urlnopad"
              ).sign(ctx.context.secret, `${data.user.id}!${sessionToken}`);
              if (token === expectedToken) {
                const newToken = await hmac.createHMAC(
                  "SHA-256",
                  "base64urlnopad"
                ).sign(ctx.context.secret, `${data.user.id}!${sessionToken}`);
                await ctx.setSignedCookie(
                  trustDeviceCookieName.name,
                  `${newToken}!${data.session.token}`,
                  ctx.context.secret,
                  trustDeviceCookieName.attributes
                );
                return;
              }
            }
            chunkOJX3P352_cjs.deleteSessionCookie(ctx);
            await ctx.context.internalAdapter.deleteSession(data.session.token);
            const twoFactorCookie = ctx.context.createAuthCookie(
              TWO_FACTOR_COOKIE_NAME,
              {
                maxAge: 60 * 10
                // 10 minutes
              }
            );
            await ctx.setSignedCookie(
              twoFactorCookie.name,
              data.user.id,
              ctx.context.secret,
              twoFactorCookie.attributes
            );
            return ctx.json({
              twoFactorRedirect: true
            });
          })
        }
      ]
    },
    schema: chunkME4Q5ZEC_cjs.mergeSchema(schema, options?.schema),
    rateLimit: [
      {
        pathMatcher(path) {
          return path.startsWith("/two-factor/");
        },
        window: 10,
        max: 3
      }
    ]
  };
};

exports.twoFactor = twoFactor;
