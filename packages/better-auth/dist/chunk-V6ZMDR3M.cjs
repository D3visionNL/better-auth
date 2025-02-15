'use strict';

var chunkNKDIPVEC_cjs = require('./chunk-NKDIPVEC.cjs');
var chunkME4Q5ZEC_cjs = require('./chunk-ME4Q5ZEC.cjs');
var chunkG2LZ73E2_cjs = require('./chunk-G2LZ73E2.cjs');
var zod = require('zod');
var jose = require('jose');

var schema = {
  jwks: {
    fields: {
      publicKey: {
        type: "string",
        required: true
      },
      privateKey: {
        type: "string",
        required: true
      },
      createdAt: {
        type: "date",
        required: true
      }
    }
  }
};
zod.z.object({
  id: zod.z.string(),
  publicKey: zod.z.string(),
  privateKey: zod.z.string(),
  createdAt: zod.z.date()
});

// src/plugins/jwt/adapter.ts
var getJwksAdapter = (adapter) => {
  return {
    getAllKeys: async () => {
      return await adapter.findMany({
        model: "jwks"
      });
    },
    getLatestKey: async () => {
      const key = await adapter.findMany({
        model: "jwks",
        sortBy: {
          field: "createdAt",
          direction: "desc"
        },
        limit: 1
      });
      return key[0];
    },
    createJwk: async (webKey) => {
      const jwk2 = await adapter.create({
        model: "jwks",
        data: {
          ...webKey,
          createdAt: /* @__PURE__ */ new Date()
        }
      });
      return jwk2;
    }
  };
};
var jwt = (options) => {
  return {
    id: "jwt",
    endpoints: {
      getJwks: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/jwks",
        {
          method: "GET",
          metadata: {
            openapi: {
              description: "Get the JSON Web Key Set",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          keys: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                kid: {
                                  type: "string"
                                },
                                kty: {
                                  type: "string"
                                },
                                use: {
                                  type: "string"
                                },
                                alg: {
                                  type: "string"
                                },
                                n: {
                                  type: "string"
                                },
                                e: {
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
              }
            }
          }
        },
        async (ctx) => {
          const adapter = getJwksAdapter(ctx.context.adapter);
          const keySets = await adapter.getAllKeys();
          if (keySets.length === 0) {
            const { publicKey, privateKey } = await jose.generateKeyPair(
              options?.jwks?.keyPairConfig?.alg ?? "EdDSA",
              options?.jwks?.keyPairConfig ?? {
                crv: "Ed25519",
                extractable: true
              }
            );
            const publicWebKey = await jose.exportJWK(publicKey);
            const privateWebKey = await jose.exportJWK(privateKey);
            const stringifiedPrivateWebKey = JSON.stringify(privateWebKey);
            const privateKeyEncryptionEnabled = !options?.jwks?.disablePrivateKeyEncryption;
            let jwk2 = {
              id: ctx.context.generateId({
                model: "jwks"
              }),
              publicKey: JSON.stringify(publicWebKey),
              privateKey: privateKeyEncryptionEnabled ? JSON.stringify(
                await chunkG2LZ73E2_cjs.symmetricEncrypt({
                  key: ctx.context.options.secret,
                  data: stringifiedPrivateWebKey
                })
              ) : stringifiedPrivateWebKey,
              createdAt: /* @__PURE__ */ new Date()
            };
            await adapter.createJwk(jwk2);
            return ctx.json({
              keys: [
                {
                  ...publicWebKey,
                  kid: jwk2.id
                }
              ]
            });
          }
          return ctx.json({
            keys: keySets.map((keySet) => ({
              ...JSON.parse(keySet.publicKey),
              kid: keySet.id
            }))
          });
        }
      ),
      getToken: chunkNKDIPVEC_cjs.createAuthEndpoint(
        "/token",
        {
          method: "GET",
          requireHeaders: true,
          use: [chunkNKDIPVEC_cjs.sessionMiddleware],
          metadata: {
            openapi: {
              description: "Get a JWT token",
              responses: {
                200: {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          token: {
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
          const adapter = getJwksAdapter(ctx.context.adapter);
          let key = await adapter.getLatestKey();
          const privateKeyEncryptionEnabled = !options?.jwks?.disablePrivateKeyEncryption;
          if (key === void 0) {
            const { publicKey, privateKey: privateKey2 } = await jose.generateKeyPair(
              options?.jwks?.keyPairConfig?.alg ?? "EdDSA",
              options?.jwks?.keyPairConfig ?? {
                crv: "Ed25519",
                extractable: true
              }
            );
            const publicWebKey = await jose.exportJWK(publicKey);
            const privateWebKey2 = await jose.exportJWK(privateKey2);
            const stringifiedPrivateWebKey = JSON.stringify(privateWebKey2);
            let jwk2 = {
              id: ctx.context.generateId({
                model: "jwks"
              }),
              publicKey: JSON.stringify(publicWebKey),
              privateKey: privateKeyEncryptionEnabled ? JSON.stringify(
                await chunkG2LZ73E2_cjs.symmetricEncrypt({
                  key: ctx.context.options.secret,
                  data: stringifiedPrivateWebKey
                })
              ) : stringifiedPrivateWebKey,
              createdAt: /* @__PURE__ */ new Date()
            };
            key = await adapter.createJwk(jwk2);
          }
          let privateWebKey = privateKeyEncryptionEnabled ? await chunkG2LZ73E2_cjs.symmetricDecrypt({
            key: ctx.context.options.secret,
            data: JSON.parse(key.privateKey)
          }) : key.privateKey;
          const privateKey = await jose.importJWK(
            JSON.parse(privateWebKey),
            options?.jwks?.keyPairConfig?.alg ?? "EdDSA"
          );
          const payload = !options?.jwt?.definePayload ? ctx.context.session.user : await options?.jwt.definePayload(ctx.context.session);
          const jwt2 = await new jose.SignJWT({
            ...payload,
            // I am aware that this is not the best way to handle this, but this is the only way I know to get the impersonatedBy field
            ...ctx.context.session.session.impersonatedBy ? {
              impersonatedBy: ctx.context.session.session.impersonatedBy
            } : {}
          }).setProtectedHeader({
            alg: options?.jwks?.keyPairConfig?.alg ?? "EdDSA",
            kid: key.id
          }).setIssuedAt().setIssuer(options?.jwt?.issuer ?? ctx.context.options.baseURL).setAudience(options?.jwt?.audience ?? ctx.context.options.baseURL).setExpirationTime(options?.jwt?.expirationTime ?? "15m").setSubject(ctx.context.session.user.id).sign(privateKey);
          return ctx.json({
            token: jwt2
          });
        }
      )
    },
    schema: chunkME4Q5ZEC_cjs.mergeSchema(schema, options?.schema)
  };
};

exports.jwt = jwt;
