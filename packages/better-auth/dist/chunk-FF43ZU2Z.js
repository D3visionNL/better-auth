import { createAuthEndpoint, sessionMiddleware } from './chunk-P6JGS32U.js';
import { mergeSchema } from './chunk-MEZ6VLJL.js';
import { symmetricEncrypt, symmetricDecrypt } from './chunk-DBPOZRMS.js';
import { z } from 'zod';
import { generateKeyPair, exportJWK, importJWK, SignJWT } from 'jose';

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
z.object({
  id: z.string(),
  publicKey: z.string(),
  privateKey: z.string(),
  createdAt: z.date()
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
      getJwks: createAuthEndpoint(
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
            const { publicKey, privateKey } = await generateKeyPair(
              options?.jwks?.keyPairConfig?.alg ?? "EdDSA",
              options?.jwks?.keyPairConfig ?? {
                crv: "Ed25519",
                extractable: true
              }
            );
            const publicWebKey = await exportJWK(publicKey);
            const privateWebKey = await exportJWK(privateKey);
            const stringifiedPrivateWebKey = JSON.stringify(privateWebKey);
            const privateKeyEncryptionEnabled = !options?.jwks?.disablePrivateKeyEncryption;
            let jwk2 = {
              id: ctx.context.generateId({
                model: "jwks"
              }),
              publicKey: JSON.stringify(publicWebKey),
              privateKey: privateKeyEncryptionEnabled ? JSON.stringify(
                await symmetricEncrypt({
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
      getToken: createAuthEndpoint(
        "/token",
        {
          method: "GET",
          requireHeaders: true,
          use: [sessionMiddleware],
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
            const { publicKey, privateKey: privateKey2 } = await generateKeyPair(
              options?.jwks?.keyPairConfig?.alg ?? "EdDSA",
              options?.jwks?.keyPairConfig ?? {
                crv: "Ed25519",
                extractable: true
              }
            );
            const publicWebKey = await exportJWK(publicKey);
            const privateWebKey2 = await exportJWK(privateKey2);
            const stringifiedPrivateWebKey = JSON.stringify(privateWebKey2);
            let jwk2 = {
              id: ctx.context.generateId({
                model: "jwks"
              }),
              publicKey: JSON.stringify(publicWebKey),
              privateKey: privateKeyEncryptionEnabled ? JSON.stringify(
                await symmetricEncrypt({
                  key: ctx.context.options.secret,
                  data: stringifiedPrivateWebKey
                })
              ) : stringifiedPrivateWebKey,
              createdAt: /* @__PURE__ */ new Date()
            };
            key = await adapter.createJwk(jwk2);
          }
          let privateWebKey = privateKeyEncryptionEnabled ? await symmetricDecrypt({
            key: ctx.context.options.secret,
            data: JSON.parse(key.privateKey)
          }) : key.privateKey;
          const privateKey = await importJWK(
            JSON.parse(privateWebKey),
            options?.jwks?.keyPairConfig?.alg ?? "EdDSA"
          );
          const payload = !options?.jwt?.definePayload ? ctx.context.session.user : await options?.jwt.definePayload(ctx.context.session);
          const jwt2 = await new SignJWT({
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
    schema: mergeSchema(schema, options?.schema)
  };
};

export { jwt };
