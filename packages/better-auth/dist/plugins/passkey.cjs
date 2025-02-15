'use strict';

var chunkYLFV4SQL_cjs = require('../chunk-YLFV4SQL.cjs');
var chunkNKDIPVEC_cjs = require('../chunk-NKDIPVEC.cjs');
require('../chunk-MUVD76IU.cjs');
require('../chunk-2D7VGWTP.cjs');
require('../chunk-RBN34WVC.cjs');
require('../chunk-CXGP5FNG.cjs');
require('../chunk-U4I57HJ4.cjs');
require('../chunk-S5UORXJH.cjs');
var chunkOJX3P352_cjs = require('../chunk-OJX3P352.cjs');
var chunkME4Q5ZEC_cjs = require('../chunk-ME4Q5ZEC.cjs');
var chunkH74YRRNV_cjs = require('../chunk-H74YRRNV.cjs');
require('../chunk-5E75URIA.cjs');
require('../chunk-CCKQSGIR.cjs');
var chunkG2LZ73E2_cjs = require('../chunk-G2LZ73E2.cjs');
require('../chunk-2HPSCSV7.cjs');
require('../chunk-VXYIYABQ.cjs');
require('../chunk-PEZRSDZS.cjs');
var server = require('@simplewebauthn/server');
var betterCall = require('better-call');
var zod = require('zod');

function getRpID(options, baseURL) {
  return options.rpID || (baseURL ? new URL(baseURL).hostname : "localhost");
}
var passkey = (options) => {
  const opts = {
    origin: null,
    ...options,
    advanced: {
      webAuthnChallengeCookie: "better-auth-passkey",
      ...options?.advanced
    }
  };
  const expirationTime = new Date(Date.now() + 1e3 * 60 * 5);
  const currentTime = /* @__PURE__ */ new Date();
  const maxAgeInSeconds = Math.floor(
    (expirationTime.getTime() - currentTime.getTime()) / 1e3
  );
  const ERROR_CODES = {
    CHALLENGE_NOT_FOUND: "Challenge not found",
    YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "You are not allowed to register this passkey",
    FAILED_TO_VERIFY_REGISTRATION: "Failed to verify registration",
    PASSKEY_NOT_FOUND: "Passkey not found",
    AUTHENTICATION_FAILED: "Authentication failed",
    UNABLE_TO_CREATE_SESSION: "Unable to create session",
    FAILED_TO_UPDATE_PASSKEY: "Failed to update passkey"
  };
  return {
    id: "passkey",
    endpoints: {
      generatePasskeyRegistrationOptions: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/generate-register-options",
        {
          method: "GET",
          use: [chunkNKDIPVEC_cjs.freshSessionMiddleware],
          metadata: {
            client: false,
            openapi: {
              description: "Generate registration options for a new passkey",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          challenge: {
                            type: "string"
                          },
                          rp: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string"
                              },
                              id: {
                                type: "string"
                              }
                            }
                          },
                          user: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string"
                              },
                              name: {
                                type: "string"
                              },
                              displayName: {
                                type: "string"
                              }
                            }
                          },
                          pubKeyCredParams: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "string"
                                },
                                alg: {
                                  type: "number"
                                }
                              }
                            }
                          },
                          timeout: {
                            type: "number"
                          },
                          excludeCredentials: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string"
                                },
                                type: {
                                  type: "string"
                                },
                                transports: {
                                  type: "array",
                                  items: {
                                    type: "string"
                                  }
                                }
                              }
                            }
                          },
                          authenticatorSelection: {
                            type: "object",
                            properties: {
                              authenticatorAttachment: {
                                type: "string"
                              },
                              requireResidentKey: {
                                type: "boolean"
                              },
                              userVerification: {
                                type: "string"
                              }
                            }
                          },
                          attestation: {
                            type: "string"
                          },
                          extensions: {
                            type: "object"
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
          const session = ctx.context.session;
          const userPasskeys = await ctx.context.adapter.findMany({
            model: "passkey",
            where: [
              {
                field: "userId",
                value: session.user.id
              }
            ]
          });
          const userID = new Uint8Array(
            Buffer.from(chunkG2LZ73E2_cjs.generateRandomString(32, "a-z", "0-9"))
          );
          let options2;
          options2 = await server.generateRegistrationOptions({
            rpName: opts.rpName || ctx.context.appName,
            rpID: getRpID(opts, ctx.context.baseURL),
            userID,
            userName: session.user.email || session.user.id,
            attestationType: "none",
            excludeCredentials: userPasskeys.map((passkey2) => ({
              id: passkey2.credentialID,
              transports: passkey2.transports?.split(
                ","
              )
            })),
            authenticatorSelection: {
              residentKey: "preferred",
              userVerification: "preferred",
              authenticatorAttachment: "platform"
            }
          });
          const id = chunkH74YRRNV_cjs.generateId(32);
          const webAuthnCookie = ctx.context.createAuthCookie(
            opts.advanced.webAuthnChallengeCookie
          );
          await ctx.setSignedCookie(
            webAuthnCookie.name,
            id,
            ctx.context.secret,
            {
              ...webAuthnCookie.attributes,
              maxAge: maxAgeInSeconds
            }
          );
          await ctx.context.internalAdapter.createVerificationValue({
            identifier: id,
            value: JSON.stringify({
              expectedChallenge: options2.challenge,
              userData: {
                id: session.user.id
              }
            }),
            expiresAt: expirationTime
          });
          return ctx.json(options2, {
            status: 200
          });
        }
      ),
      generatePasskeyAuthenticationOptions: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/generate-authenticate-options",
        {
          method: "POST",
          body: zod.z.object({
            email: zod.z.string({
              description: "The email address of the user"
            }).optional()
          }).optional(),
          metadata: {
            openapi: {
              description: "Generate authentication options for a passkey",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          challenge: {
                            type: "string"
                          },
                          rp: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string"
                              },
                              id: {
                                type: "string"
                              }
                            }
                          },
                          user: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string"
                              },
                              name: {
                                type: "string"
                              },
                              displayName: {
                                type: "string"
                              }
                            }
                          },
                          timeout: {
                            type: "number"
                          },
                          allowCredentials: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string"
                                },
                                type: {
                                  type: "string"
                                },
                                transports: {
                                  type: "array",
                                  items: {
                                    type: "string"
                                  }
                                }
                              }
                            }
                          },
                          userVerification: {
                            type: "string"
                          },
                          authenticatorSelection: {
                            type: "object",
                            properties: {
                              authenticatorAttachment: {
                                type: "string"
                              },
                              requireResidentKey: {
                                type: "boolean"
                              },
                              userVerification: {
                                type: "string"
                              }
                            }
                          },
                          extensions: {
                            type: "object"
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
          const session = await chunkNKDIPVEC_cjs.getSessionFromCtx(ctx);
          let userPasskeys = [];
          if (session) {
            userPasskeys = await ctx.context.adapter.findMany({
              model: "passkey",
              where: [
                {
                  field: "userId",
                  value: session.user.id
                }
              ]
            });
          }
          const options2 = await server.generateAuthenticationOptions({
            rpID: getRpID(opts, ctx.context.baseURL),
            userVerification: "preferred",
            ...userPasskeys.length ? {
              allowCredentials: userPasskeys.map((passkey2) => ({
                id: passkey2.credentialID,
                transports: passkey2.transports?.split(
                  ","
                )
              }))
            } : {}
          });
          const data = {
            expectedChallenge: options2.challenge,
            userData: {
              id: session?.user.id || ""
            }
          };
          const id = chunkH74YRRNV_cjs.generateId(32);
          const webAuthnCookie = ctx.context.createAuthCookie(
            opts.advanced.webAuthnChallengeCookie
          );
          await ctx.setSignedCookie(
            webAuthnCookie.name,
            id,
            ctx.context.secret,
            {
              ...webAuthnCookie.attributes,
              maxAge: maxAgeInSeconds
            }
          );
          await ctx.context.internalAdapter.createVerificationValue({
            identifier: id,
            value: JSON.stringify(data),
            expiresAt: expirationTime
          });
          return ctx.json(options2, {
            status: 200
          });
        }
      ),
      verifyPasskeyRegistration: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/verify-registration",
        {
          method: "POST",
          body: zod.z.object({
            response: zod.z.any({
              description: "The response from the authenticator"
            }),
            name: zod.z.string({
              description: "Name of the passkey"
            }).optional()
          }),
          use: [chunkNKDIPVEC_cjs.freshSessionMiddleware],
          metadata: {
            openapi: {
              description: "Verify registration of a new passkey",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Passkey"
                      }
                    }
                  }
                },
                400: {
                  description: "Bad request"
                }
              }
            }
          }
        },
        async (ctx) => {
          const origin = options?.origin || ctx.headers?.get("origin") || "";
          if (!origin) {
            return ctx.json(null, {
              status: 400
            });
          }
          const resp = ctx.body.response;
          const webAuthnCookie = ctx.context.createAuthCookie(
            opts.advanced.webAuthnChallengeCookie
          );
          const challengeId = await ctx.getSignedCookie(
            webAuthnCookie.name,
            ctx.context.secret
          );
          if (!challengeId) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.CHALLENGE_NOT_FOUND
            });
          }
          const data = await ctx.context.internalAdapter.findVerificationValue(
            challengeId
          );
          if (!data) {
            return ctx.json(null, {
              status: 400
            });
          }
          const { expectedChallenge, userData } = JSON.parse(
            data.value
          );
          if (userData.id !== ctx.context.session.user.id) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY
            });
          }
          try {
            const verification = await server.verifyRegistrationResponse({
              response: resp,
              expectedChallenge,
              expectedOrigin: origin,
              expectedRPID: getRpID(opts, ctx.context.baseURL),
              requireUserVerification: false
            });
            const { verified, registrationInfo } = verification;
            if (!verified || !registrationInfo) {
              return ctx.json(null, {
                status: 400
              });
            }
            const {
              // credentialID,
              // credentialPublicKey,
              // counter,
              credentialDeviceType,
              credentialBackedUp,
              credential,
              credentialType
            } = registrationInfo;
            const pubKey = Buffer.from(credential.publicKey).toString("base64");
            const newPasskey = {
              name: ctx.body.name,
              userId: userData.id,
              id: ctx.context.generateId({ model: "passkey" }),
              credentialID: credential.id,
              publicKey: pubKey,
              counter: credential.counter,
              deviceType: credentialDeviceType,
              transports: resp.response.transports.join(","),
              backedUp: credentialBackedUp,
              createdAt: /* @__PURE__ */ new Date()
            };
            const newPasskeyRes = await ctx.context.adapter.create({
              model: "passkey",
              data: newPasskey
            });
            return ctx.json(newPasskeyRes, {
              status: 200
            });
          } catch (e) {
            console.log(e);
            throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
              message: ERROR_CODES.FAILED_TO_VERIFY_REGISTRATION
            });
          }
        }
      ),
      verifyPasskeyAuthentication: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/verify-authentication",
        {
          method: "POST",
          body: zod.z.object({
            response: zod.z.record(zod.z.any())
          }),
          metadata: {
            openapi: {
              description: "Verify authentication of a passkey",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          session: {
                            $ref: "#/components/schemas/Session"
                          },
                          user: {
                            $ref: "#/components/schemas/User"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            $Infer: {
              body: {}
            }
          }
        },
        async (ctx) => {
          const origin = options?.origin || ctx.headers?.get("origin") || "";
          if (!origin) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: "origin missing"
            });
          }
          const resp = ctx.body.response;
          const webAuthnCookie = ctx.context.createAuthCookie(
            opts.advanced.webAuthnChallengeCookie
          );
          const challengeId = await ctx.getSignedCookie(
            webAuthnCookie.name,
            ctx.context.secret
          );
          if (!challengeId) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.CHALLENGE_NOT_FOUND
            });
          }
          const data = await ctx.context.internalAdapter.findVerificationValue(
            challengeId
          );
          if (!data) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.CHALLENGE_NOT_FOUND
            });
          }
          const { expectedChallenge } = JSON.parse(
            data.value
          );
          const passkey2 = await ctx.context.adapter.findOne({
            model: "passkey",
            where: [
              {
                field: "credentialID",
                value: resp.id
              }
            ]
          });
          if (!passkey2) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.PASSKEY_NOT_FOUND
            });
          }
          try {
            const verification = await server.verifyAuthenticationResponse({
              response: resp,
              expectedChallenge,
              expectedOrigin: origin,
              expectedRPID: getRpID(opts, ctx.context.baseURL),
              credential: {
                id: passkey2.credentialID,
                publicKey: new Uint8Array(
                  Buffer.from(passkey2.publicKey, "base64")
                ),
                counter: passkey2.counter,
                transports: passkey2.transports?.split(
                  ","
                )
              },
              requireUserVerification: false
            });
            const { verified } = verification;
            if (!verified)
              throw new betterCall.APIError("UNAUTHORIZED", {
                message: ERROR_CODES.AUTHENTICATION_FAILED
              });
            await ctx.context.adapter.update({
              model: "passkey",
              where: [
                {
                  field: "id",
                  value: passkey2.id
                }
              ],
              update: {
                counter: verification.authenticationInfo.newCounter
              }
            });
            const s = await ctx.context.internalAdapter.createSession(
              passkey2.userId,
              ctx.request
            );
            if (!s) {
              throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
                message: ERROR_CODES.UNABLE_TO_CREATE_SESSION
              });
            }
            const user = await ctx.context.internalAdapter.findUserById(
              passkey2.userId
            );
            if (!user) {
              throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
                message: "User not found"
              });
            }
            await chunkOJX3P352_cjs.setSessionCookie(ctx, {
              session: s,
              user
            });
            return ctx.json(
              {
                session: s
              },
              {
                status: 200
              }
            );
          } catch (e) {
            ctx.context.logger.error("Failed to verify authentication", e);
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.AUTHENTICATION_FAILED
            });
          }
        }
      ),
      listPasskeys: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/list-user-passkeys",
        {
          method: "GET",
          use: [chunkNKDIPVEC_cjs.sessionMiddleware]
        },
        async (ctx) => {
          const passkeys = await ctx.context.adapter.findMany({
            model: "passkey",
            where: [{ field: "userId", value: ctx.context.session.user.id }]
          });
          return ctx.json(passkeys, {
            status: 200
          });
        }
      ),
      deletePasskey: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/delete-passkey",
        {
          method: "POST",
          body: zod.z.object({
            id: zod.z.string()
          }),
          use: [chunkNKDIPVEC_cjs.sessionMiddleware]
        },
        async (ctx) => {
          await ctx.context.adapter.delete({
            model: "passkey",
            where: [
              {
                field: "id",
                value: ctx.body.id
              }
            ]
          });
          return ctx.json(null, {
            status: 200
          });
        }
      ),
      updatePasskey: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/passkey/update-passkey",
        {
          method: "POST",
          body: zod.z.object({
            id: zod.z.string(),
            name: zod.z.string()
          }),
          use: [chunkNKDIPVEC_cjs.sessionMiddleware]
        },
        async (ctx) => {
          const passkey2 = await ctx.context.adapter.findOne({
            model: "passkey",
            where: [
              {
                field: "id",
                value: ctx.body.id
              }
            ]
          });
          if (!passkey2) {
            throw new betterCall.APIError("NOT_FOUND", {
              message: ERROR_CODES.PASSKEY_NOT_FOUND
            });
          }
          if (passkey2.userId !== ctx.context.session.user.id) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              message: ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY
            });
          }
          const updatedPasskey = await ctx.context.adapter.update({
            model: "passkey",
            where: [
              {
                field: "id",
                value: ctx.body.id
              }
            ],
            update: {
              name: ctx.body.name
            }
          });
          if (!updatedPasskey) {
            throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
              message: ERROR_CODES.FAILED_TO_UPDATE_PASSKEY
            });
          }
          return ctx.json(
            {
              passkey: updatedPasskey
            },
            {
              status: 200
            }
          );
        }
      )
    },
    schema: chunkME4Q5ZEC_cjs.mergeSchema(schema, options?.schema),
    $ERROR_CODES: ERROR_CODES
  };
};
var schema = {
  passkey: {
    fields: {
      name: {
        type: "string",
        required: false
      },
      publicKey: {
        type: "string",
        required: true
      },
      userId: {
        type: "string",
        references: {
          model: "user",
          field: "id"
        },
        required: true
      },
      credentialID: {
        type: "string",
        required: true
      },
      counter: {
        type: "number",
        required: true
      },
      deviceType: {
        type: "string",
        required: true
      },
      backedUp: {
        type: "boolean",
        required: true
      },
      transports: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        required: false
      }
    }
  }
};

Object.defineProperty(exports, "getPasskeyActions", {
  enumerable: true,
  get: function () { return chunkYLFV4SQL_cjs.getPasskeyActions; }
});
Object.defineProperty(exports, "passkeyClient", {
  enumerable: true,
  get: function () { return chunkYLFV4SQL_cjs.passkeyClient; }
});
exports.passkey = passkey;
