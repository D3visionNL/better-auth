'use strict';

const organization = require('../shared/better-auth.DNzJK3VH.cjs');
const plugins_twoFactor_index = require('./two-factor/index.cjs');
const plugins_username_index = require('./username/index.cjs');
const plugins_bearer_index = require('./bearer/index.cjs');
const account = require('../shared/better-auth.DxtzDaxH.cjs');
const plugins_magicLink_index = require('./magic-link/index.cjs');
const plugins_phoneNumber_index = require('./phone-number/index.cjs');
const plugins_anonymous_index = require('./anonymous/index.cjs');
const admin = require('../shared/better-auth.DhjBbxfD.cjs');
const plugins_genericOauth_index = require('./generic-oauth/index.cjs');
const plugins_jwt_index = require('./jwt/index.cjs');
const plugins_multiSession_index = require('./multi-session/index.cjs');
const plugins_emailOtp_index = require('./email-otp/index.cjs');
const plugins_oneTap_index = require('./one-tap/index.cjs');
const plugins_oauthProxy_index = require('./oauth-proxy/index.cjs');
const plugins_customSession_index = require('./custom-session/index.cjs');
const plugins_openApi_index = require('./open-api/index.cjs');
const plugins_oidcProvider_index = require('./oidc-provider/index.cjs');
const plugins_captcha_index = require('./captcha/index.cjs');
const betterCall = require('better-call');
const zod = require('zod');
const date = require('../shared/better-auth.C1hdVENX.cjs');
require('../shared/better-auth.DiSjtgs9.cjs');
const base64 = require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
const schema = require('../shared/better-auth.DcWKCjjf.cjs');
require('../shared/better-auth.GpOOav9x.cjs');
const getRequestIp = require('../shared/better-auth.B7cZ2juS.cjs');
require('defu');
require('@better-auth/utils/random');
const hash = require('@better-auth/utils/hash');
require('@noble/ciphers/chacha');
require('@noble/ciphers/utils');
require('@noble/ciphers/webcrypto');
require('jose');
require('@noble/hashes/scrypt');
require('@better-auth/utils');
require('@better-auth/utils/hex');
require('@noble/hashes/utils');
require('../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
const parser = require('../shared/better-auth.DhsGZ30Q.cjs');
const json = require('../shared/better-auth.D3mtHEZg.cjs');
const plugins_access_index = require('./access/index.cjs');
const plugins_haveibeenpwned_index = require('./haveibeenpwned/index.cjs');
const plugins_oneTimeToken_index = require('./one-time-token/index.cjs');
const client = require('../shared/better-auth.DnER2-iT.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('../shared/better-auth.DSVbLSt7.cjs');
require('./organization/access/index.cjs');
require('../cookies/index.cjs');
require('../shared/better-auth.C-R0J0n1.cjs');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('../crypto/index.cjs');
require('../shared/better-auth.YUF6P-PB.cjs');
require('../shared/better-auth.BMYo0QR-.cjs');
require('@better-auth/utils/otp');
require('../shared/better-auth.CDXNofOe.cjs');
require('../social-providers/index.cjs');
require('@better-fetch/fetch');
require('../shared/better-auth.6XyKj7DG.cjs');
require('../shared/better-auth.CWJ7qc0w.cjs');
require('jose/errors');
require('@better-auth/utils/binary');
require('../shared/better-auth.DNqtHmvg.cjs');
require('../shared/better-auth.BW8BpneG.cjs');
require('./admin/access/index.cjs');
require('../shared/better-auth.BG6vHVNT.cjs');
require('../api/index.cjs');
require('../shared/better-auth.BEphVDyL.cjs');

const apiKeySchema = ({
  timeWindow,
  rateLimitMax
}) => ({
  apikey: {
    fields: {
      /**
       * The name of the key.
       */
      name: {
        type: "string",
        required: false,
        input: false
      },
      /**
       * Shows the first few characters of the API key
       * This allows you to show those few characters in the UI to make it easier for users to identify the API key.
       */
      start: {
        type: "string",
        required: false,
        input: false
      },
      /**
       * The prefix of the key.
       */
      prefix: {
        type: "string",
        required: false,
        input: false
      },
      /**
       * The hashed key value.
       */
      key: {
        type: "string",
        required: true,
        input: false
      },
      /**
       * The user id of the user who created the key.
       */
      userId: {
        type: "string",
        references: { model: "user", field: "id" },
        required: true,
        input: false
      },
      /**
       * The interval to refill the key in milliseconds.
       */
      refillInterval: {
        type: "number",
        required: false,
        input: false
      },
      /**
       * The amount to refill the remaining count of the key.
       */
      refillAmount: {
        type: "number",
        required: false,
        input: false
      },
      /**
       * The date and time when the key was last refilled.
       */
      lastRefillAt: {
        type: "date",
        required: false,
        input: false
      },
      /**
       * Whether the key is enabled.
       */
      enabled: {
        type: "boolean",
        required: false,
        input: false,
        defaultValue: true
      },
      /**
       * Whether the key has rate limiting enabled.
       */
      rateLimitEnabled: {
        type: "boolean",
        required: false,
        input: false,
        defaultValue: true
      },
      /**
       * The time window in milliseconds for the rate limit.
       */
      rateLimitTimeWindow: {
        type: "number",
        required: false,
        input: false,
        defaultValue: timeWindow
      },
      /**
       * The maximum number of requests allowed within the `rateLimitTimeWindow`.
       */
      rateLimitMax: {
        type: "number",
        required: false,
        input: false,
        defaultValue: rateLimitMax
      },
      /**
       * The number of requests made within the rate limit time window
       */
      requestCount: {
        type: "number",
        required: false,
        input: false,
        defaultValue: 0
      },
      /**
       * The remaining number of requests before the key is revoked.
       *
       * If this is null, then the key is not revoked.
       *
       * If `refillInterval` & `refillAmount` are provided, than this will refill accordingly.
       */
      remaining: {
        type: "number",
        required: false,
        input: false
      },
      /**
       * The date and time of the last request made to the key.
       */
      lastRequest: {
        type: "date",
        required: false,
        input: false
      },
      /**
       * The date and time when the key will expire.
       */
      expiresAt: {
        type: "date",
        required: false,
        input: false
      },
      /**
       * The date and time when the key was created.
       */
      createdAt: {
        type: "date",
        required: true,
        input: false
      },
      /**
       * The date and time when the key was last updated.
       */
      updatedAt: {
        type: "date",
        required: true,
        input: false
      },
      /**
       * The permissions of the key.
       */
      permissions: {
        type: "string",
        required: false,
        input: false
      },
      /**
       * Any additional metadata you want to store with the key.
       */
      metadata: {
        type: "string",
        required: false,
        input: true,
        transform: {
          input(value) {
            return JSON.stringify(value);
          },
          output(value) {
            if (!value) return null;
            return parser.parseJSON(value);
          }
        }
      }
    }
  }
});

function createApiKey({
  keyGenerator,
  opts,
  schema,
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/create",
    {
      method: "POST",
      body: zod.z.object({
        name: zod.z.string({ description: "Name of the Api Key" }).optional(),
        expiresIn: zod.z.number({
          description: "Expiration time of the Api Key in seconds"
        }).min(1).optional().nullable().default(null),
        userId: zod.z.coerce.string({
          description: "User Id of the user that the Api Key belongs to. Useful for server-side only."
        }).optional(),
        prefix: zod.z.string({ description: "Prefix of the Api Key" }).regex(/^[a-zA-Z0-9_-]+$/, {
          message: "Invalid prefix format, must be alphanumeric and contain only underscores and hyphens."
        }).optional(),
        remaining: zod.z.number({
          description: "Remaining number of requests. Server side only"
        }).min(0).optional().nullable().default(null),
        metadata: zod.z.any({ description: "Metadata of the Api Key" }).optional(),
        refillAmount: zod.z.number({
          description: "Amount to refill the remaining count of the Api Key. Server Only Property"
        }).min(1).optional(),
        refillInterval: zod.z.number({
          description: "Interval to refill the Api Key in milliseconds. Server Only Property."
        }).optional(),
        rateLimitTimeWindow: zod.z.number({
          description: "The duration in milliseconds where each request is counted. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. Server Only Property."
        }).optional(),
        rateLimitMax: zod.z.number({
          description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. Server Only Property."
        }).optional(),
        rateLimitEnabled: zod.z.boolean({
          description: "Whether the key has rate limiting enabled. Server Only Property."
        }).optional(),
        permissions: zod.z.record(zod.z.string(), zod.z.array(zod.z.string())).optional()
      }),
      metadata: {
        openapi: {
          description: "Create a new API key for a user",
          responses: {
            "200": {
              description: "API key created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "Unique identifier of the API key"
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "Creation timestamp"
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "Last update timestamp"
                      },
                      name: {
                        type: "string",
                        nullable: true,
                        description: "Name of the API key"
                      },
                      prefix: {
                        type: "string",
                        nullable: true,
                        description: "Prefix of the API key"
                      },
                      start: {
                        type: "string",
                        nullable: true,
                        description: "Starting characters of the key (if configured)"
                      },
                      key: {
                        type: "string",
                        description: "The full API key (only returned on creation)"
                      },
                      enabled: {
                        type: "boolean",
                        description: "Whether the key is enabled"
                      },
                      expiresAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "Expiration timestamp"
                      },
                      userId: {
                        type: "string",
                        description: "ID of the user owning the key"
                      },
                      lastRefillAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "Last refill timestamp"
                      },
                      lastRequest: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "Last request timestamp"
                      },
                      metadata: {
                        type: "object",
                        nullable: true,
                        additionalProperties: true,
                        description: "Metadata associated with the key"
                      },
                      rateLimitMax: {
                        type: "number",
                        nullable: true,
                        description: "Maximum requests in time window"
                      },
                      rateLimitTimeWindow: {
                        type: "number",
                        nullable: true,
                        description: "Rate limit time window in milliseconds"
                      },
                      remaining: {
                        type: "number",
                        nullable: true,
                        description: "Remaining requests"
                      },
                      refillAmount: {
                        type: "number",
                        nullable: true,
                        description: "Amount to refill"
                      },
                      refillInterval: {
                        type: "number",
                        nullable: true,
                        description: "Refill interval in milliseconds"
                      },
                      rateLimitEnabled: {
                        type: "boolean",
                        description: "Whether rate limiting is enabled"
                      },
                      requestCount: {
                        type: "number",
                        description: "Current request count in window"
                      },
                      permissions: {
                        type: "object",
                        nullable: true,
                        additionalProperties: {
                          type: "array",
                          items: { type: "string" }
                        },
                        description: "Permissions associated with the key"
                      }
                    },
                    required: [
                      "id",
                      "createdAt",
                      "updatedAt",
                      "key",
                      "enabled",
                      "userId",
                      "rateLimitEnabled",
                      "requestCount"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      const {
        name,
        expiresIn,
        prefix,
        remaining,
        metadata,
        refillAmount,
        refillInterval,
        permissions,
        rateLimitMax,
        rateLimitTimeWindow,
        rateLimitEnabled
      } = ctx.body;
      const session = await account.getSessionFromCtx(ctx);
      const authRequired = (ctx.request || ctx.headers) && !ctx.body.userId;
      const user = session?.user ?? (authRequired ? null : { id: ctx.body.userId });
      if (!user?.id) {
        throw new betterCall.APIError("UNAUTHORIZED", {
          message: ERROR_CODES.UNAUTHORIZED_SESSION
        });
      }
      if (authRequired) {
        if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || permissions !== void 0 || remaining !== null) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.SERVER_ONLY_PROPERTY
          });
        }
      }
      if (metadata) {
        if (opts.enableMetadata === false) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.METADATA_DISABLED
          });
        }
        if (typeof metadata !== "object") {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_METADATA_TYPE
          });
        }
      }
      if (refillAmount && !refillInterval) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED
        });
      }
      if (refillInterval && !refillAmount) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED
        });
      }
      if (expiresIn) {
        if (opts.keyExpiration.disableCustomExpiresTime === true) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.KEY_DISABLED_EXPIRATION
          });
        }
        const expiresIn_in_days = expiresIn / (60 * 60 * 24);
        if (opts.keyExpiration.minExpiresIn > expiresIn_in_days) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL
          });
        } else if (opts.keyExpiration.maxExpiresIn < expiresIn_in_days) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE
          });
        }
      }
      if (prefix) {
        if (prefix.length < opts.minimumPrefixLength) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_PREFIX_LENGTH
          });
        }
        if (prefix.length > opts.maximumPrefixLength) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_PREFIX_LENGTH
          });
        }
      }
      if (name) {
        if (name.length < opts.minimumNameLength) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_NAME_LENGTH
          });
        }
        if (name.length > opts.maximumNameLength) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_NAME_LENGTH
          });
        }
      }
      deleteAllExpiredApiKeys(ctx.context);
      const key = await keyGenerator({
        length: opts.defaultKeyLength,
        prefix: prefix || opts.defaultPrefix
      });
      const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
      let start = null;
      if (opts.startingCharactersConfig.shouldStore) {
        start = key.substring(
          0,
          opts.startingCharactersConfig.charactersLength
        );
      }
      const defaultPermissions = opts.permissions?.defaultPermissions ? typeof opts.permissions.defaultPermissions === "function" ? await opts.permissions.defaultPermissions(user.id, ctx) : opts.permissions.defaultPermissions : void 0;
      const permissionsToApply = permissions ? JSON.stringify(permissions) : defaultPermissions ? JSON.stringify(defaultPermissions) : void 0;
      let data = {
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        name: name ?? null,
        prefix: prefix ?? opts.defaultPrefix ?? null,
        start,
        key: hashed,
        enabled: true,
        expiresAt: expiresIn ? date.getDate(expiresIn, "sec") : opts.keyExpiration.defaultExpiresIn ? date.getDate(opts.keyExpiration.defaultExpiresIn, "sec") : null,
        userId: user.id,
        lastRefillAt: null,
        lastRequest: null,
        metadata: null,
        rateLimitMax: rateLimitMax ?? opts.rateLimit.maxRequests ?? null,
        rateLimitTimeWindow: rateLimitTimeWindow ?? opts.rateLimit.timeWindow ?? null,
        remaining: remaining || refillAmount || null,
        refillAmount: refillAmount ?? null,
        refillInterval: refillInterval ?? null,
        rateLimitEnabled: rateLimitEnabled === void 0 ? opts.rateLimit.enabled ?? true : rateLimitEnabled,
        requestCount: 0,
        //@ts-ignore - we intentionally save the permissions as string on DB.
        permissions: permissionsToApply
      };
      if (metadata) {
        data.metadata = schema.apikey.fields.metadata.transform.input(metadata);
      }
      const apiKey = await ctx.context.adapter.create({
        model: API_KEY_TABLE_NAME,
        data
      });
      return ctx.json({
        ...apiKey,
        key,
        metadata: metadata ?? null,
        permissions: apiKey.permissions ? json.safeJSONParse(
          //@ts-ignore - from DB, this value is always a string
          apiKey.permissions
        ) : null
      });
    }
  );
}

function deleteApiKey({
  opts,
  schema,
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/delete",
    {
      method: "POST",
      body: zod.z.object({
        keyId: zod.z.string({
          description: "The id of the Api Key"
        })
      }),
      use: [account.sessionMiddleware],
      metadata: {
        openapi: {
          description: "Delete an existing API key",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    keyId: {
                      type: "string",
                      description: "The id of the API key to delete"
                    }
                  },
                  required: ["keyId"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "API key deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        description: "Indicates if the API key was successfully deleted"
                      }
                    },
                    required: ["success"]
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      const { keyId } = ctx.body;
      const session = ctx.context.session;
      if (session.user.banned === true) {
        throw new betterCall.APIError("UNAUTHORIZED", {
          message: ERROR_CODES.USER_BANNED
        });
      }
      const apiKey = await ctx.context.adapter.findOne({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "id",
            value: keyId
          }
        ]
      });
      if (!apiKey || apiKey.userId !== session.user.id) {
        throw new betterCall.APIError("NOT_FOUND", {
          message: ERROR_CODES.KEY_NOT_FOUND
        });
      }
      try {
        await ctx.context.adapter.delete({
          model: API_KEY_TABLE_NAME,
          where: [
            {
              field: "id",
              value: apiKey.id
            }
          ]
        });
      } catch (error) {
        throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
          message: error?.message
        });
      }
      deleteAllExpiredApiKeys(ctx.context);
      return ctx.json({
        success: true
      });
    }
  );
}

function getApiKey({
  opts,
  schema,
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/get",
    {
      method: "GET",
      query: zod.z.object({
        id: zod.z.string({
          description: "The id of the Api Key"
        })
      }),
      use: [account.sessionMiddleware],
      metadata: {
        openapi: {
          description: "Retrieve an existing API key by ID",
          responses: {
            "200": {
              description: "API key retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "ID"
                      },
                      name: {
                        type: "string",
                        nullable: true,
                        description: "The name of the key"
                      },
                      start: {
                        type: "string",
                        nullable: true,
                        description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
                      },
                      prefix: {
                        type: "string",
                        nullable: true,
                        description: "The API Key prefix. Stored as plain text."
                      },
                      userId: {
                        type: "string",
                        description: "The owner of the user id"
                      },
                      refillInterval: {
                        type: "number",
                        nullable: true,
                        description: "The interval in which the `remaining` count is refilled by day. Example: 1 // every day"
                      },
                      refillAmount: {
                        type: "number",
                        nullable: true,
                        description: "The amount to refill"
                      },
                      lastRefillAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "The last refill date"
                      },
                      enabled: {
                        type: "boolean",
                        description: "Sets if key is enabled or disabled",
                        default: true
                      },
                      rateLimitEnabled: {
                        type: "boolean",
                        description: "Whether the key has rate limiting enabled"
                      },
                      rateLimitTimeWindow: {
                        type: "number",
                        nullable: true,
                        description: "The duration in milliseconds"
                      },
                      rateLimitMax: {
                        type: "number",
                        nullable: true,
                        description: "Maximum amount of requests allowed within a window"
                      },
                      requestCount: {
                        type: "number",
                        description: "The number of requests made within the rate limit time window"
                      },
                      remaining: {
                        type: "number",
                        nullable: true,
                        description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
                      },
                      lastRequest: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "When last request occurred"
                      },
                      expiresAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "Expiry date of a key"
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "created at"
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "updated at"
                      },
                      metadata: {
                        type: "object",
                        nullable: true,
                        additionalProperties: true,
                        description: "Extra metadata about the apiKey"
                      },
                      permissions: {
                        type: "string",
                        nullable: true,
                        description: "Permissions for the api key (stored as JSON string)"
                      }
                    },
                    required: [
                      "id",
                      "userId",
                      "enabled",
                      "rateLimitEnabled",
                      "requestCount",
                      "createdAt",
                      "updatedAt"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      const { id } = ctx.query;
      const session = ctx.context.session;
      let apiKey = await ctx.context.adapter.findOne({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "id",
            value: id
          },
          {
            field: "userId",
            value: session.user.id
          }
        ]
      });
      if (!apiKey) {
        throw new betterCall.APIError("NOT_FOUND", {
          message: ERROR_CODES.KEY_NOT_FOUND
        });
      }
      deleteAllExpiredApiKeys(ctx.context);
      apiKey.metadata = schema.apikey.fields.metadata.transform.output(
        apiKey.metadata
      );
      const { key, ...returningApiKey } = apiKey;
      return ctx.json({
        ...returningApiKey,
        permissions: returningApiKey.permissions ? json.safeJSONParse(
          //@ts-ignore - From DB this is always a string
          returningApiKey.permissions
        ) : null
      });
    }
  );
}

function updateApiKey({
  opts,
  schema,
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/update",
    {
      method: "POST",
      body: zod.z.object({
        keyId: zod.z.string({
          description: "The id of the Api Key"
        }),
        userId: zod.z.coerce.string().optional(),
        name: zod.z.string({
          description: "The name of the key"
        }).optional(),
        enabled: zod.z.boolean({
          description: "Whether the Api Key is enabled or not"
        }).optional(),
        remaining: zod.z.number({
          description: "The number of remaining requests"
        }).min(1).optional(),
        refillAmount: zod.z.number({
          description: "The refill amount"
        }).optional(),
        refillInterval: zod.z.number({
          description: "The refill interval"
        }).optional(),
        metadata: zod.z.any({
          description: "The metadata of the Api Key"
        }).optional(),
        expiresIn: zod.z.number({
          description: "Expiration time of the Api Key in seconds"
        }).min(1).optional().nullable(),
        rateLimitEnabled: zod.z.boolean({
          description: "Whether the key has rate limiting enabled."
        }).optional(),
        rateLimitTimeWindow: zod.z.number({
          description: "The duration in milliseconds where each request is counted."
        }).optional(),
        rateLimitMax: zod.z.number({
          description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset."
        }).optional(),
        permissions: zod.z.record(zod.z.string(), zod.z.array(zod.z.string())).optional().nullable()
      }),
      metadata: {
        openapi: {
          description: "Retrieve an existing API key by ID",
          responses: {
            "200": {
              description: "API key retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "ID"
                      },
                      name: {
                        type: "string",
                        nullable: true,
                        description: "The name of the key"
                      },
                      start: {
                        type: "string",
                        nullable: true,
                        description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
                      },
                      prefix: {
                        type: "string",
                        nullable: true,
                        description: "The API Key prefix. Stored as plain text."
                      },
                      userId: {
                        type: "string",
                        description: "The owner of the user id"
                      },
                      refillInterval: {
                        type: "number",
                        nullable: true,
                        description: "The interval in which the `remaining` count is refilled by day. Example: 1 // every day"
                      },
                      refillAmount: {
                        type: "number",
                        nullable: true,
                        description: "The amount to refill"
                      },
                      lastRefillAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "The last refill date"
                      },
                      enabled: {
                        type: "boolean",
                        description: "Sets if key is enabled or disabled",
                        default: true
                      },
                      rateLimitEnabled: {
                        type: "boolean",
                        description: "Whether the key has rate limiting enabled"
                      },
                      rateLimitTimeWindow: {
                        type: "number",
                        nullable: true,
                        description: "The duration in milliseconds"
                      },
                      rateLimitMax: {
                        type: "number",
                        nullable: true,
                        description: "Maximum amount of requests allowed within a window"
                      },
                      requestCount: {
                        type: "number",
                        description: "The number of requests made within the rate limit time window"
                      },
                      remaining: {
                        type: "number",
                        nullable: true,
                        description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
                      },
                      lastRequest: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "When last request occurred"
                      },
                      expiresAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        description: "Expiry date of a key"
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "created at"
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "updated at"
                      },
                      metadata: {
                        type: "object",
                        nullable: true,
                        additionalProperties: true,
                        description: "Extra metadata about the apiKey"
                      },
                      permissions: {
                        type: "string",
                        nullable: true,
                        description: "Permissions for the api key (stored as JSON string)"
                      }
                    },
                    required: [
                      "id",
                      "userId",
                      "enabled",
                      "rateLimitEnabled",
                      "requestCount",
                      "createdAt",
                      "updatedAt"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    async (ctx) => {
      const {
        keyId,
        expiresIn,
        enabled,
        metadata,
        refillAmount,
        refillInterval,
        remaining,
        name,
        permissions,
        rateLimitEnabled,
        rateLimitTimeWindow,
        rateLimitMax
      } = ctx.body;
      const session = await account.getSessionFromCtx(ctx);
      const authRequired = (ctx.request || ctx.headers) && !ctx.body.userId;
      const user = session?.user ?? (authRequired ? null : { id: ctx.body.userId });
      if (!user?.id) {
        throw new betterCall.APIError("UNAUTHORIZED", {
          message: ERROR_CODES.UNAUTHORIZED_SESSION
        });
      }
      if (authRequired) {
        if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || remaining !== void 0 || permissions !== void 0) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.SERVER_ONLY_PROPERTY
          });
        }
      }
      const apiKey = await ctx.context.adapter.findOne({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "id",
            value: keyId
          },
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!apiKey) {
        throw new betterCall.APIError("NOT_FOUND", {
          message: ERROR_CODES.KEY_NOT_FOUND
        });
      }
      let newValues = {};
      if (name !== void 0) {
        if (name.length < opts.minimumNameLength) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_NAME_LENGTH
          });
        } else if (name.length > opts.maximumNameLength) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_NAME_LENGTH
          });
        }
        newValues.name = name;
      }
      if (enabled !== void 0) {
        newValues.enabled = enabled;
      }
      if (expiresIn !== void 0) {
        if (opts.keyExpiration.disableCustomExpiresTime === true) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.KEY_DISABLED_EXPIRATION
          });
        }
        if (expiresIn !== null) {
          const expiresIn_in_days = expiresIn / (60 * 60 * 24);
          if (expiresIn_in_days < opts.keyExpiration.minExpiresIn) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL
            });
          } else if (expiresIn_in_days > opts.keyExpiration.maxExpiresIn) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE
            });
          }
        }
        newValues.expiresAt = expiresIn ? date.getDate(expiresIn, "sec") : null;
      }
      if (metadata !== void 0) {
        if (typeof metadata !== "object") {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_METADATA_TYPE
          });
        }
        newValues.metadata = schema.apikey.fields.metadata.transform.input(metadata);
      }
      if (remaining !== void 0) {
        newValues.remaining = remaining;
      }
      if (refillAmount !== void 0 || refillInterval !== void 0) {
        if (refillAmount !== void 0 && refillInterval === void 0) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED
          });
        } else if (refillInterval !== void 0 && refillAmount === void 0) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED
          });
        }
        newValues.refillAmount = refillAmount;
        newValues.refillInterval = refillInterval;
      }
      if (rateLimitEnabled !== void 0) {
        newValues.rateLimitEnabled = rateLimitEnabled;
      }
      if (rateLimitTimeWindow !== void 0) {
        newValues.rateLimitTimeWindow = rateLimitTimeWindow;
      }
      if (rateLimitMax !== void 0) {
        newValues.rateLimitMax = rateLimitMax;
      }
      if (permissions !== void 0) {
        newValues.permissions = JSON.stringify(permissions);
      }
      if (Object.keys(newValues).length === 0) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: ERROR_CODES.NO_VALUES_TO_UPDATE
        });
      }
      let newApiKey = apiKey;
      try {
        let result = await ctx.context.adapter.update({
          model: API_KEY_TABLE_NAME,
          where: [
            {
              field: "id",
              value: apiKey.id
            },
            {
              field: "userId",
              value: user.id
            }
          ],
          update: {
            lastRequest: /* @__PURE__ */ new Date(),
            remaining: apiKey.remaining === null ? null : apiKey.remaining - 1,
            ...newValues
          }
        });
        if (result) newApiKey = result;
      } catch (error) {
        throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
          message: error?.message
        });
      }
      deleteAllExpiredApiKeys(ctx.context);
      newApiKey.metadata = schema.apikey.fields.metadata.transform.output(
        newApiKey.metadata
      );
      const { key, ...returningApiKey } = newApiKey;
      return ctx.json({
        ...returningApiKey,
        permissions: returningApiKey.permissions ? json.safeJSONParse(
          //@ts-ignore - from DB, this value is always a string
          returningApiKey.permissions
        ) : null
      });
    }
  );
}

function isRateLimited(apiKey, opts) {
  const now = /* @__PURE__ */ new Date();
  const lastRequest = apiKey.lastRequest;
  const rateLimitTimeWindow = apiKey.rateLimitTimeWindow;
  const rateLimitMax = apiKey.rateLimitMax;
  let requestCount = apiKey.requestCount;
  if (opts.rateLimit.enabled === false)
    return {
      success: true,
      message: null,
      update: { lastRequest: now },
      tryAgainIn: null
    };
  if (apiKey.rateLimitEnabled === false)
    return {
      success: true,
      message: null,
      update: { lastRequest: now },
      tryAgainIn: null
    };
  if (rateLimitTimeWindow === null || rateLimitMax === null) {
    return {
      success: true,
      message: null,
      update: null,
      tryAgainIn: null
    };
  }
  if (lastRequest === null) {
    return {
      success: true,
      message: null,
      update: { lastRequest: now, requestCount: 1 },
      tryAgainIn: null
    };
  }
  const timeSinceLastRequest = now.getTime() - lastRequest.getTime();
  if (timeSinceLastRequest > rateLimitTimeWindow) {
    return {
      success: true,
      message: null,
      update: { lastRequest: now, requestCount: 1 },
      tryAgainIn: null
    };
  }
  if (requestCount >= rateLimitMax) {
    return {
      success: false,
      message: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      update: null,
      tryAgainIn: Math.ceil(rateLimitTimeWindow - timeSinceLastRequest)
    };
  }
  requestCount++;
  return {
    success: true,
    message: null,
    tryAgainIn: null,
    update: { lastRequest: now, requestCount }
  };
}

function verifyApiKey({
  opts,
  schema,
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/verify",
    {
      method: "POST",
      body: zod.z.object({
        key: zod.z.string({
          description: "The key to verify"
        }),
        permissions: zod.z.record(zod.z.string(), zod.z.array(zod.z.string())).optional()
      }),
      metadata: {
        SERVER_ONLY: true
      }
    },
    async (ctx) => {
      const { key } = ctx.body;
      if (key.length < opts.defaultKeyLength) {
        return ctx.json({
          valid: false,
          error: {
            message: ERROR_CODES.INVALID_API_KEY,
            code: "KEY_NOT_FOUND"
          },
          key: null
        });
      }
      if (opts.customAPIKeyValidator && !opts.customAPIKeyValidator({ ctx, key })) {
        return ctx.json({
          valid: false,
          error: {
            message: ERROR_CODES.INVALID_API_KEY,
            code: "KEY_NOT_FOUND"
          },
          key: null
        });
      }
      const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
      const apiKey = await ctx.context.adapter.findOne({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "key",
            value: hashed
          }
        ]
      });
      if (!apiKey) {
        return ctx.json({
          valid: false,
          error: {
            message: ERROR_CODES.KEY_NOT_FOUND,
            code: "KEY_NOT_FOUND"
          },
          key: null
        });
      }
      if (apiKey.enabled === false) {
        return ctx.json({
          valid: false,
          error: {
            message: ERROR_CODES.USAGE_EXCEEDED,
            code: "KEY_DISABLED"
          },
          key: null
        });
      }
      if (apiKey.expiresAt) {
        const now = (/* @__PURE__ */ new Date()).getTime();
        const expiresAt = apiKey.expiresAt.getTime();
        if (now > expiresAt) {
          try {
            ctx.context.adapter.delete({
              model: API_KEY_TABLE_NAME,
              where: [
                {
                  field: "id",
                  value: apiKey.id
                }
              ]
            });
          } catch (error) {
            ctx.context.logger.error(
              `Failed to delete expired API keys:`,
              error
            );
          }
          return ctx.json({
            valid: false,
            error: {
              message: ERROR_CODES.KEY_EXPIRED,
              code: "KEY_EXPIRED"
            },
            key: null
          });
        }
      }
      const requiredPermissions = ctx.body.permissions;
      const apiKeyPermissions = apiKey.permissions ? json.safeJSONParse(
        //@ts-ignore - from DB, this value is always a string
        apiKey.permissions
      ) : null;
      if (requiredPermissions) {
        if (!apiKeyPermissions) {
          return ctx.json({
            valid: false,
            error: {
              message: ERROR_CODES.KEY_NOT_FOUND,
              code: "KEY_NOT_FOUND"
            },
            key: null
          });
        }
        const r = plugins_access_index.role(apiKeyPermissions);
        const result = r.authorize(requiredPermissions);
        if (!result.success) {
          return ctx.json({
            valid: false,
            error: {
              message: ERROR_CODES.KEY_NOT_FOUND,
              code: "KEY_NOT_FOUND"
            },
            key: null
          });
        }
      }
      let remaining = apiKey.remaining;
      let lastRefillAt = apiKey.lastRefillAt;
      if (apiKey.remaining === 0 && apiKey.refillAmount === null) {
        try {
          ctx.context.adapter.delete({
            model: API_KEY_TABLE_NAME,
            where: [
              {
                field: "id",
                value: apiKey.id
              }
            ]
          });
        } catch (error) {
          ctx.context.logger.error(`Failed to delete expired API keys:`, error);
        }
        return ctx.json({
          valid: false,
          error: {
            message: ERROR_CODES.USAGE_EXCEEDED,
            code: "USAGE_EXCEEDED"
          },
          key: null
        });
      } else if (remaining !== null) {
        let now = (/* @__PURE__ */ new Date()).getTime();
        const refillInterval = apiKey.refillInterval;
        const refillAmount = apiKey.refillAmount;
        let lastTime = (lastRefillAt ?? apiKey.createdAt).getTime();
        if (refillInterval && refillAmount) {
          const timeSinceLastRequest = (now - lastTime) / (1e3 * 60 * 60 * 24);
          if (timeSinceLastRequest > refillInterval) {
            remaining = refillAmount;
            lastRefillAt = /* @__PURE__ */ new Date();
          }
        }
        if (remaining === 0) {
          return ctx.json({
            valid: false,
            error: {
              message: ERROR_CODES.USAGE_EXCEEDED,
              code: "USAGE_EXCEEDED"
            },
            key: null
          });
        } else {
          remaining--;
        }
      }
      const { message, success, update, tryAgainIn } = isRateLimited(
        apiKey,
        opts
      );
      const newApiKey = await ctx.context.adapter.update({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "id",
            value: apiKey.id
          }
        ],
        update: {
          ...update,
          remaining,
          lastRefillAt
        }
      });
      if (success === false) {
        return ctx.json({
          valid: false,
          error: {
            message,
            code: "RATE_LIMITED",
            details: {
              tryAgainIn
            }
          },
          key: null
        });
      }
      deleteAllExpiredApiKeys(ctx.context);
      const { key: _, ...returningApiKey } = newApiKey ?? {
        key: 1,
        permissions: void 0
      };
      if ("metadata" in returningApiKey) {
        returningApiKey.metadata = schema.apikey.fields.metadata.transform.output(
          returningApiKey.metadata
        );
      }
      returningApiKey.permissions = returningApiKey.permissions ? json.safeJSONParse(
        //@ts-ignore - from DB, this value is always a string
        returningApiKey.permissions
      ) : null;
      return ctx.json({
        valid: true,
        error: null,
        key: newApiKey === null ? null : returningApiKey
      });
    }
  );
}

function listApiKeys({
  opts,
  schema,
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/list",
    {
      method: "GET",
      use: [account.sessionMiddleware],
      metadata: {
        openapi: {
          description: "List all API keys for the authenticated user",
          responses: {
            "200": {
              description: "API keys retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "ID"
                        },
                        name: {
                          type: "string",
                          nullable: true,
                          description: "The name of the key"
                        },
                        start: {
                          type: "string",
                          nullable: true,
                          description: "Shows the first few characters of the API key, including the prefix. This allows you to show those few characters in the UI to make it easier for users to identify the API key."
                        },
                        prefix: {
                          type: "string",
                          nullable: true,
                          description: "The API Key prefix. Stored as plain text."
                        },
                        userId: {
                          type: "string",
                          description: "The owner of the user id"
                        },
                        refillInterval: {
                          type: "number",
                          nullable: true,
                          description: "The interval in which the `remaining` count is refilled by day. Example: 1 // every day"
                        },
                        refillAmount: {
                          type: "number",
                          nullable: true,
                          description: "The amount to refill"
                        },
                        lastRefillAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          description: "The last refill date"
                        },
                        enabled: {
                          type: "boolean",
                          description: "Sets if key is enabled or disabled",
                          default: true
                        },
                        rateLimitEnabled: {
                          type: "boolean",
                          description: "Whether the key has rate limiting enabled"
                        },
                        rateLimitTimeWindow: {
                          type: "number",
                          nullable: true,
                          description: "The duration in milliseconds"
                        },
                        rateLimitMax: {
                          type: "number",
                          nullable: true,
                          description: "Maximum amount of requests allowed within a window"
                        },
                        requestCount: {
                          type: "number",
                          description: "The number of requests made within the rate limit time window"
                        },
                        remaining: {
                          type: "number",
                          nullable: true,
                          description: "Remaining requests (every time api key is used this should updated and should be updated on refill as well)"
                        },
                        lastRequest: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          description: "When last request occurred"
                        },
                        expiresAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          description: "Expiry date of a key"
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          description: "created at"
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          description: "updated at"
                        },
                        metadata: {
                          type: "object",
                          nullable: true,
                          additionalProperties: true,
                          description: "Extra metadata about the apiKey"
                        },
                        permissions: {
                          type: "string",
                          nullable: true,
                          description: "Permissions for the api key (stored as JSON string)"
                        }
                      },
                      required: [
                        "id",
                        "userId",
                        "enabled",
                        "rateLimitEnabled",
                        "requestCount",
                        "createdAt",
                        "updatedAt"
                      ]
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
      let apiKeys = await ctx.context.adapter.findMany({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "userId",
            value: session.user.id
          }
        ]
      });
      deleteAllExpiredApiKeys(ctx.context);
      apiKeys = apiKeys.map((apiKey) => {
        return {
          ...apiKey,
          metadata: schema.apikey.fields.metadata.transform.output(
            apiKey.metadata
          )
        };
      });
      let returningApiKey = apiKeys.map((x) => {
        const { key, ...returningApiKey2 } = x;
        return {
          ...returningApiKey2,
          permissions: returningApiKey2.permissions ? json.safeJSONParse(
            //@ts-ignore - From DB this is always a string
            returningApiKey2.permissions
          ) : null
        };
      });
      return ctx.json(returningApiKey);
    }
  );
}

function deleteAllExpiredApiKeysEndpoint({
  deleteAllExpiredApiKeys
}) {
  return account.createAuthEndpoint(
    "/api-key/delete-all-expired-api-keys",
    {
      method: "POST",
      metadata: {
        SERVER_ONLY: true
      }
    },
    async (ctx) => {
      try {
        await deleteAllExpiredApiKeys(ctx.context, true);
      } catch (error) {
        ctx.context.logger.error(
          "[API KEY PLUGIN] Failed to delete expired API keys:",
          error
        );
        return ctx.json({
          success: false,
          error
        });
      }
      return ctx.json({ success: true, error: null });
    }
  );
}

function createApiKeyRoutes({
  keyGenerator,
  opts,
  schema
}) {
  let lastChecked = null;
  function deleteAllExpiredApiKeys(ctx, byPassLastCheckTime = false) {
    if (lastChecked && !byPassLastCheckTime) {
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - lastChecked.getTime();
      if (diff < 1e4) {
        return;
      }
    }
    lastChecked = /* @__PURE__ */ new Date();
    try {
      return ctx.adapter.deleteMany({
        model: API_KEY_TABLE_NAME,
        where: [
          {
            field: "expiresAt",
            operator: "lt",
            value: /* @__PURE__ */ new Date()
          }
        ]
      });
    } catch (error) {
      ctx.logger.error(`Failed to delete expired API keys:`, error);
    }
  }
  return {
    createApiKey: createApiKey({
      keyGenerator,
      opts,
      schema,
      deleteAllExpiredApiKeys
    }),
    verifyApiKey: verifyApiKey({ opts, schema, deleteAllExpiredApiKeys }),
    getApiKey: getApiKey({ opts, schema, deleteAllExpiredApiKeys }),
    updateApiKey: updateApiKey({ opts, schema, deleteAllExpiredApiKeys }),
    deleteApiKey: deleteApiKey({ opts, schema, deleteAllExpiredApiKeys }),
    listApiKeys: listApiKeys({ opts, schema, deleteAllExpiredApiKeys }),
    deleteAllExpiredApiKeys: deleteAllExpiredApiKeysEndpoint({
      deleteAllExpiredApiKeys
    })
  };
}

const defaultKeyHasher = async (key) => {
  const hash$1 = await hash.createHash("SHA-256").digest(
    new TextEncoder().encode(key)
  );
  const hashed = base64.base64Url.encode(new Uint8Array(hash$1), {
    padding: false
  });
  return hashed;
};
const ERROR_CODES = {
  INVALID_METADATA_TYPE: "metadata must be an object or undefined",
  REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided",
  REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided",
  USER_BANNED: "User is banned",
  UNAUTHORIZED_SESSION: "Unauthorized or invalid session",
  KEY_NOT_FOUND: "API Key not found",
  KEY_DISABLED: "API Key is disabled",
  KEY_EXPIRED: "API Key has expired",
  USAGE_EXCEEDED: "API Key has reached its usage limit",
  KEY_NOT_RECOVERABLE: "API Key is not recoverable",
  EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.",
  EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.",
  INVALID_REMAINING: "The remaining count is either too large or too small.",
  INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.",
  INVALID_NAME_LENGTH: "The name length is either too large or too small.",
  METADATA_DISABLED: "Metadata is disabled.",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded.",
  NO_VALUES_TO_UPDATE: "No values to update.",
  KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.",
  INVALID_API_KEY: "Invalid API key.",
  INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.",
  INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.",
  SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only."
};
const API_KEY_TABLE_NAME = "apikey";
const apiKey = (options) => {
  const opts = {
    ...options,
    apiKeyHeaders: options?.apiKeyHeaders ?? "x-api-key",
    defaultKeyLength: options?.defaultKeyLength || 64,
    maximumPrefixLength: options?.maximumPrefixLength ?? 32,
    minimumPrefixLength: options?.minimumPrefixLength ?? 1,
    maximumNameLength: options?.maximumNameLength ?? 32,
    minimumNameLength: options?.minimumNameLength ?? 1,
    enableMetadata: options?.enableMetadata ?? false,
    disableKeyHashing: options?.disableKeyHashing ?? false,
    rateLimit: {
      enabled: options?.rateLimit?.enabled === void 0 ? true : options?.rateLimit?.enabled,
      timeWindow: options?.rateLimit?.timeWindow ?? 1e3 * 60 * 60 * 24,
      maxRequests: options?.rateLimit?.maxRequests ?? 10
    },
    keyExpiration: {
      defaultExpiresIn: options?.keyExpiration?.defaultExpiresIn ?? null,
      disableCustomExpiresTime: options?.keyExpiration?.disableCustomExpiresTime ?? false,
      maxExpiresIn: options?.keyExpiration?.maxExpiresIn ?? 365,
      minExpiresIn: options?.keyExpiration?.minExpiresIn ?? 1
    },
    startingCharactersConfig: {
      shouldStore: options?.startingCharactersConfig?.shouldStore ?? true,
      charactersLength: options?.startingCharactersConfig?.charactersLength ?? 6
    },
    disableSessionForAPIKeys: options?.disableSessionForAPIKeys ?? false
  };
  const schema$1 = schema.mergeSchema(
    apiKeySchema({
      rateLimitMax: opts.rateLimit.maxRequests,
      timeWindow: opts.rateLimit.timeWindow
    }),
    opts.schema
  );
  const getter = opts.customAPIKeyGetter || ((ctx) => {
    if (Array.isArray(opts.apiKeyHeaders)) {
      for (const header of opts.apiKeyHeaders) {
        const value = ctx.headers?.get(header);
        if (value) {
          return value;
        }
      }
    } else {
      return ctx.headers?.get(opts.apiKeyHeaders);
    }
  });
  const keyGenerator = opts.customKeyGenerator || (async (options2) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let apiKey2 = `${options2.prefix || ""}`;
    for (let i = 0; i < options2.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      apiKey2 += characters[randomIndex];
    }
    return apiKey2;
  });
  const routes = createApiKeyRoutes({ keyGenerator, opts, schema: schema$1 });
  return {
    id: "api-key",
    $ERROR_CODES: ERROR_CODES,
    hooks: {
      before: [
        {
          matcher: (ctx) => !!getter(ctx) && opts.disableSessionForAPIKeys === false,
          handler: account.createAuthMiddleware(async (ctx) => {
            const key = getter(ctx);
            if (typeof key !== "string") {
              throw new betterCall.APIError("BAD_REQUEST", {
                message: ERROR_CODES.INVALID_API_KEY_GETTER_RETURN_TYPE
              });
            }
            if (key.length < opts.defaultKeyLength) {
              throw new betterCall.APIError("FORBIDDEN", {
                message: ERROR_CODES.INVALID_API_KEY
              });
            }
            if (opts.customAPIKeyValidator && !opts.customAPIKeyValidator({ ctx, key })) {
              throw new betterCall.APIError("FORBIDDEN", {
                message: ERROR_CODES.INVALID_API_KEY
              });
            }
            const hashed = opts.disableKeyHashing ? key : await defaultKeyHasher(key);
            const apiKey2 = await ctx.context.adapter.findOne({
              model: API_KEY_TABLE_NAME,
              where: [
                {
                  field: "key",
                  value: hashed
                }
              ]
            });
            if (!apiKey2) {
              throw new betterCall.APIError("UNAUTHORIZED", {
                message: ERROR_CODES.INVALID_API_KEY
              });
            }
            let user;
            try {
              const userResult = await ctx.context.internalAdapter.findUserById(
                apiKey2.userId
              );
              if (!userResult) {
                throw new betterCall.APIError("UNAUTHORIZED", {
                  message: ERROR_CODES.INVALID_USER_ID_FROM_API_KEY
                });
              }
              user = userResult;
            } catch (error) {
              throw error;
            }
            const session = {
              user,
              session: {
                id: apiKey2.id,
                token: key,
                userId: user.id,
                userAgent: ctx.request?.headers.get("user-agent") ?? null,
                ipAddress: ctx.request ? getRequestIp.getIp(ctx.request, ctx.context.options) : null,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                expiresAt: apiKey2.expiresAt || date.getDate(
                  ctx.context.options.session?.expiresIn || 60 * 60 * 24 * 7,
                  // 7 days
                  "ms"
                )
              }
            };
            ctx.context.session = session;
            if (ctx.path === "/get-session") {
              return session;
            } else {
              return {
                context: ctx
              };
            }
          })
        }
      ]
    },
    endpoints: {
      createApiKey: routes.createApiKey,
      verifyApiKey: routes.verifyApiKey,
      getApiKey: routes.getApiKey,
      updateApiKey: routes.updateApiKey,
      deleteApiKey: routes.deleteApiKey,
      listApiKeys: routes.listApiKeys
    },
    schema: schema$1
  };
};

exports.organization = organization.organization;
exports.parseRoles = organization.parseRoles;
exports.TWO_FACTOR_ERROR_CODES = plugins_twoFactor_index.TWO_FACTOR_ERROR_CODES;
exports.twoFactor = plugins_twoFactor_index.twoFactor;
exports.USERNAME_ERROR_CODES = plugins_username_index.USERNAME_ERROR_CODES;
exports.username = plugins_username_index.username;
exports.bearer = plugins_bearer_index.bearer;
exports.HIDE_METADATA = account.HIDE_METADATA;
exports.createAuthEndpoint = account.createAuthEndpoint;
exports.createAuthMiddleware = account.createAuthMiddleware;
exports.optionsMiddleware = account.optionsMiddleware;
exports.magicLink = plugins_magicLink_index.magicLink;
exports.phoneNumber = plugins_phoneNumber_index.phoneNumber;
exports.anonymous = plugins_anonymous_index.anonymous;
exports.admin = admin.admin;
exports.genericOAuth = plugins_genericOauth_index.genericOAuth;
exports.getJwtToken = plugins_jwt_index.getJwtToken;
exports.jwt = plugins_jwt_index.jwt;
exports.multiSession = plugins_multiSession_index.multiSession;
exports.emailOTP = plugins_emailOtp_index.emailOTP;
exports.oneTap = plugins_oneTap_index.oneTap;
exports.oAuthProxy = plugins_oauthProxy_index.oAuthProxy;
exports.customSession = plugins_customSession_index.customSession;
exports.openAPI = plugins_openApi_index.openAPI;
exports.oidcProvider = plugins_oidcProvider_index.oidcProvider;
exports.captcha = plugins_captcha_index.captcha;
exports.haveIBeenPwned = plugins_haveibeenpwned_index.haveIBeenPwned;
exports.oneTimeToken = plugins_oneTimeToken_index.oneTimeToken;
exports.twoFactorClient = client.twoFactorClient;
exports.API_KEY_TABLE_NAME = API_KEY_TABLE_NAME;
exports.ERROR_CODES = ERROR_CODES;
exports.apiKey = apiKey;
exports.defaultKeyHasher = defaultKeyHasher;
