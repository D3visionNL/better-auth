'use strict';

const organization = require('../shared/better-auth.D6ERC_IF.cjs');
const plugins_twoFactor_index = require('./two-factor/index.cjs');
const plugins_username_index = require('./username/index.cjs');
const plugins_bearer_index = require('./bearer/index.cjs');
const account = require('../shared/better-auth.iyK63nvn.cjs');
const plugins_magicLink_index = require('./magic-link/index.cjs');
const plugins_phoneNumber_index = require('./phone-number/index.cjs');
const plugins_anonymous_index = require('./anonymous/index.cjs');
const admin = require('../shared/better-auth.Bssbmnf8.cjs');
const plugins_genericOauth_index = require('./generic-oauth/index.cjs');
const plugins_jwt_index = require('./jwt/index.cjs');
const plugins_multiSession_index = require('./multi-session/index.cjs');
const plugins_emailOtp_index = require('./email-otp/index.cjs');
const plugins_oneTap_index = require('./one-tap/index.cjs');
const plugins_oauthProxy_index = require('./oauth-proxy/index.cjs');
const plugins_customSession_index = require('./custom-session/index.cjs');
const plugins_openApi_index = require('./open-api/index.cjs');
const plugins_oidcProvider_index = require('../shared/better-auth.yvQmFMBM.cjs');
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
const jose = require('jose');
require('@noble/hashes/scrypt');
const utils = require('@better-auth/utils');
require('@better-auth/utils/hex');
require('@noble/hashes/utils');
const random = require('../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
const parser = require('../shared/better-auth.DhsGZ30Q.cjs');
const json = require('../shared/better-auth.D3mtHEZg.cjs');
const plugins_access_index = require('./access/index.cjs');
const plugins_haveibeenpwned_index = require('./haveibeenpwned/index.cjs');
const plugins_oneTimeToken_index = require('./one-time-token/index.cjs');
const cookies_index = require('../cookies/index.cjs');
require('./organization/access/index.cjs');
require('@better-auth/utils/otp');
require('./admin/access/index.cjs');
require('@better-fetch/fetch');
require('../shared/better-auth.BG6vHVNT.cjs');
const client = require('../shared/better-auth.DnER2-iT.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('../shared/better-auth.DSVbLSt7.cjs');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('../crypto/index.cjs');
require('../shared/better-auth.YUF6P-PB.cjs');
require('../shared/better-auth.BMYo0QR-.cjs');
require('../shared/better-auth.CDXNofOe.cjs');
require('../shared/better-auth.CWJ7qc0w.cjs');
require('../social-providers/index.cjs');
require('../shared/better-auth.6XyKj7DG.cjs');
require('../shared/better-auth.C-R0J0n1.cjs');
require('jose/errors');
require('@better-auth/utils/binary');
require('../shared/better-auth.DNqtHmvg.cjs');
require('../shared/better-auth.BW8BpneG.cjs');
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

function redirectErrorURL(url, error, description) {
  return `${url.includes("?") ? "&" : "?"}error=${error}&error_description=${description}`;
}
async function authorizeMCPOAuth(ctx, options) {
  ctx.setHeader("Access-Control-Allow-Origin", "*");
  ctx.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  ctx.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ctx.setHeader("Access-Control-Max-Age", "86400");
  const opts = {
    codeExpiresIn: 600,
    defaultScope: "openid",
    ...options,
    scopes: [
      "openid",
      "profile",
      "email",
      "offline_access",
      ...options?.scopes || []
    ]
  };
  if (!ctx.request) {
    throw new betterCall.APIError("UNAUTHORIZED", {
      error_description: "request not found",
      error: "invalid_request"
    });
  }
  const session = await account.getSessionFromCtx(ctx);
  if (!session) {
    await ctx.setSignedCookie(
      "oidc_login_prompt",
      JSON.stringify(ctx.query),
      ctx.context.secret,
      {
        maxAge: 600,
        path: "/",
        sameSite: "lax"
      }
    );
    const queryFromURL = ctx.request.url?.split("?")[1];
    throw ctx.redirect(`${options.loginPage}?${queryFromURL}`);
  }
  const query = ctx.query;
  console.log(query);
  if (!query.client_id) {
    throw ctx.redirect(`${ctx.context.baseURL}/error?error=invalid_client`);
  }
  if (!query.response_type) {
    throw ctx.redirect(
      redirectErrorURL(
        `${ctx.context.baseURL}/error`,
        "invalid_request",
        "response_type is required"
      )
    );
  }
  const client = await ctx.context.adapter.findOne({
    model: "oauthApplication",
    where: [
      {
        field: "clientId",
        value: ctx.query.client_id
      }
    ]
  }).then((res) => {
    if (!res) {
      return null;
    }
    return {
      ...res,
      redirectURLs: res.redirectURLs.split(","),
      metadata: res.metadata ? JSON.parse(res.metadata) : {}
    };
  });
  console.log(client);
  if (!client) {
    throw ctx.redirect(`${ctx.context.baseURL}/error?error=invalid_client`);
  }
  const redirectURI = client.redirectURLs.find(
    (url) => url === ctx.query.redirect_uri
  );
  if (!redirectURI || !query.redirect_uri) {
    throw new betterCall.APIError("BAD_REQUEST", {
      message: "Invalid redirect URI"
    });
  }
  if (client.disabled) {
    throw ctx.redirect(`${ctx.context.baseURL}/error?error=client_disabled`);
  }
  if (query.response_type !== "code") {
    throw ctx.redirect(
      `${ctx.context.baseURL}/error?error=unsupported_response_type`
    );
  }
  const requestScope = query.scope?.split(" ").filter((s) => s) || opts.defaultScope.split(" ");
  const invalidScopes = requestScope.filter((scope) => {
    const isInvalid = !opts.scopes.includes(scope) || scope === "offline_access" && query.prompt !== "consent";
    return isInvalid;
  });
  if (invalidScopes.length) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "invalid_scope",
        `The following scopes are invalid: ${invalidScopes.join(", ")}`
      )
    );
  }
  if ((!query.code_challenge || !query.code_challenge_method) && options.requirePKCE) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "invalid_request",
        "pkce is required"
      )
    );
  }
  if (!query.code_challenge_method) {
    query.code_challenge_method = "plain";
  }
  if (![
    "s256",
    options.allowPlainCodeChallengeMethod ? "plain" : "s256"
  ].includes(query.code_challenge_method?.toLowerCase() || "")) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "invalid_request",
        "invalid code_challenge method"
      )
    );
  }
  const code = random.generateRandomString(32, "a-z", "A-Z", "0-9");
  const codeExpiresInMs = opts.codeExpiresIn * 1e3;
  const expiresAt = new Date(Date.now() + codeExpiresInMs);
  try {
    await ctx.context.internalAdapter.createVerificationValue(
      {
        value: JSON.stringify({
          clientId: client.clientId,
          redirectURI: query.redirect_uri,
          scope: requestScope,
          userId: session.user.id,
          authTime: session.session.createdAt.getTime(),
          /**
           * If the prompt is set to `consent`, then we need
           * to require the user to consent to the scopes.
           *
           * This means the code now needs to be treated as a
           * consent request.
           *
           * once the user consents, teh code will be updated
           * with the actual code. This is to prevent the
           * client from using the code before the user
           * consents.
           */
          requireConsent: query.prompt === "consent",
          state: query.prompt === "consent" ? query.state : null,
          codeChallenge: query.code_challenge,
          codeChallengeMethod: query.code_challenge_method,
          nonce: query.nonce
        }),
        identifier: code,
        expiresAt
      },
      ctx
    );
  } catch (e) {
    throw ctx.redirect(
      redirectErrorURL(
        query.redirect_uri,
        "server_error",
        "An error occurred while processing the request"
      )
    );
  }
  const redirectURIWithCode = new URL(redirectURI);
  redirectURIWithCode.searchParams.set("code", code);
  redirectURIWithCode.searchParams.set("state", ctx.query.state);
  if (query.prompt !== "consent") {
    throw ctx.redirect(redirectURIWithCode.toString());
  }
  throw ctx.redirect(redirectURIWithCode.toString());
}

const getMCPProviderMetadata = (ctx, options) => {
  const issuer = ctx.context.options.baseURL;
  const baseURL = ctx.context.baseURL;
  if (!issuer || !baseURL) {
    throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
      error: "invalid_issuer",
      error_description: "issuer or baseURL is not set. If you're the app developer, please make sure to set the `baseURL` in your auth config."
    });
  }
  return {
    issuer,
    authorization_endpoint: `${baseURL}/mcp/authorize`,
    token_endpoint: `${baseURL}/mcp/token`,
    userinfo_endpoint: `${baseURL}/mcp/userinfo`,
    jwks_uri: `${baseURL}/mcp/jwks`,
    registration_endpoint: `${baseURL}/mcp/register`,
    scopes_supported: ["openid", "profile", "email", "offline_access"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code"],
    acr_values_supported: [
      "urn:mace:incommon:iap:silver",
      "urn:mace:incommon:iap:bronze"
    ],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256", "none"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post"
    ],
    code_challenge_methods_supported: ["S256"],
    claims_supported: [
      "sub",
      "iss",
      "aud",
      "exp",
      "nbf",
      "iat",
      "jti",
      "email",
      "email_verified",
      "name"
    ],
    ...options?.metadata
  };
};
const mcp = (options) => {
  const opts = {
    codeExpiresIn: 600,
    defaultScope: "openid",
    accessTokenExpiresIn: 3600,
    refreshTokenExpiresIn: 604800,
    allowPlainCodeChallengeMethod: true,
    ...options.oidcConfig,
    loginPage: options.loginPage,
    scopes: [
      "openid",
      "profile",
      "email",
      "offline_access",
      ...options.oidcConfig?.scopes || []
    ]
  };
  const modelName = {
    oauthClient: "oauthApplication",
    oauthAccessToken: "oauthAccessToken"};
  plugins_oidcProvider_index.oidcProvider(opts);
  return {
    id: "mcp",
    hooks: {
      after: [
        {
          matcher() {
            return true;
          },
          handler: account.createAuthMiddleware(async (ctx) => {
            const cookie = await ctx.getSignedCookie(
              "oidc_login_prompt",
              ctx.context.secret
            );
            const cookieName = ctx.context.authCookies.sessionToken.name;
            const parsedSetCookieHeader = cookies_index.parseSetCookieHeader(
              ctx.context.responseHeaders?.get("set-cookie") || ""
            );
            const hasSessionToken = parsedSetCookieHeader.has(cookieName);
            if (!cookie || !hasSessionToken) {
              return;
            }
            ctx.setCookie("oidc_login_prompt", "", {
              maxAge: 0
            });
            const sessionCookie = parsedSetCookieHeader.get(cookieName)?.value;
            const sessionToken = sessionCookie?.split(".")[0];
            if (!sessionToken) {
              return;
            }
            const session = await ctx.context.internalAdapter.findSession(sessionToken);
            if (!session) {
              return;
            }
            ctx.query = JSON.parse(cookie);
            ctx.query.prompt = "consent";
            ctx.context.session = session;
            const response = await authorizeMCPOAuth(ctx, opts).catch((e) => {
              if (e instanceof betterCall.APIError) {
                if (e.statusCode === 302) {
                  return ctx.json({
                    redirect: true,
                    //@ts-expect-error
                    url: e.headers.get("location")
                  });
                }
              }
              throw e;
            });
            return response;
          })
        }
      ]
    },
    endpoints: {
      getMcpOAuthConfig: account.createAuthEndpoint(
        "/.well-known/oauth-authorization-server",
        {
          method: "GET",
          metadata: {
            client: false
          }
        },
        async (c) => {
          try {
            const metadata = getMCPProviderMetadata(c, options);
            return c.json(metadata);
          } catch (e) {
            console.log(e);
            return c.json(null);
          }
        }
      ),
      mcpOAuthAuthroize: account.createAuthEndpoint(
        "/mcp/authorize",
        {
          method: "GET",
          query: zod.z.record(zod.z.string(), zod.z.any()),
          metadata: {
            openapi: {
              description: "Authorize an OAuth2 request using MCP",
              responses: {
                "200": {
                  description: "Authorization response generated successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        additionalProperties: true,
                        description: "Authorization response, contents depend on the authorize function implementation"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          return authorizeMCPOAuth(ctx, opts);
        }
      ),
      mcpOAuthToken: account.createAuthEndpoint(
        "/mcp/token",
        {
          method: "POST",
          body: zod.z.record(zod.z.any()),
          metadata: {
            isAction: false
          }
        },
        async (ctx) => {
          ctx.setHeader("Access-Control-Allow-Origin", "*");
          ctx.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          ctx.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
          );
          ctx.setHeader("Access-Control-Max-Age", "86400");
          let { body } = ctx;
          if (!body) {
            throw ctx.error("BAD_REQUEST", {
              error_description: "request body not found",
              error: "invalid_request"
            });
          }
          if (body instanceof FormData) {
            body = Object.fromEntries(body.entries());
          }
          if (!(body instanceof Object)) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "request body is not an object",
              error: "invalid_request"
            });
          }
          let { client_id, client_secret } = body;
          const authorization = ctx.request?.headers.get("authorization") || null;
          if (authorization && !client_id && !client_secret && authorization.startsWith("Basic ")) {
            try {
              const encoded = authorization.replace("Basic ", "");
              const decoded = new TextDecoder().decode(base64.base64.decode(encoded));
              if (!decoded.includes(":")) {
                throw new betterCall.APIError("UNAUTHORIZED", {
                  error_description: "invalid authorization header format",
                  error: "invalid_client"
                });
              }
              const [id, secret] = decoded.split(":");
              if (!id || !secret) {
                throw new betterCall.APIError("UNAUTHORIZED", {
                  error_description: "invalid authorization header format",
                  error: "invalid_client"
                });
              }
              client_id = id;
              client_secret = secret;
            } catch (error) {
              throw new betterCall.APIError("UNAUTHORIZED", {
                error_description: "invalid authorization header format",
                error: "invalid_client"
              });
            }
          }
          const {
            grant_type,
            code,
            redirect_uri,
            refresh_token,
            code_verifier
          } = body;
          if (grant_type === "refresh_token") {
            if (!refresh_token) {
              throw new betterCall.APIError("BAD_REQUEST", {
                error_description: "refresh_token is required",
                error: "invalid_request"
              });
            }
            const token = await ctx.context.adapter.findOne({
              model: "oauthAccessToken",
              where: [
                {
                  field: "refreshToken",
                  value: refresh_token.toString()
                }
              ]
            });
            if (!token) {
              throw new betterCall.APIError("UNAUTHORIZED", {
                error_description: "invalid refresh token",
                error: "invalid_grant"
              });
            }
            if (token.clientId !== client_id?.toString()) {
              throw new betterCall.APIError("UNAUTHORIZED", {
                error_description: "invalid client_id",
                error: "invalid_client"
              });
            }
            if (token.refreshTokenExpiresAt < /* @__PURE__ */ new Date()) {
              throw new betterCall.APIError("UNAUTHORIZED", {
                error_description: "refresh token expired",
                error: "invalid_grant"
              });
            }
            const accessToken2 = random.generateRandomString(32, "a-z", "A-Z");
            const newRefreshToken = random.generateRandomString(32, "a-z", "A-Z");
            const accessTokenExpiresAt2 = new Date(
              Date.now() + opts.accessTokenExpiresIn * 1e3
            );
            const refreshTokenExpiresAt2 = new Date(
              Date.now() + opts.refreshTokenExpiresIn * 1e3
            );
            await ctx.context.adapter.create({
              model: modelName.oauthAccessToken,
              data: {
                accessToken: accessToken2,
                refreshToken: newRefreshToken,
                accessTokenExpiresAt: accessTokenExpiresAt2,
                refreshTokenExpiresAt: refreshTokenExpiresAt2,
                clientId: client_id.toString(),
                userId: token.userId,
                scopes: token.scopes,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              }
            });
            return ctx.json({
              access_token: accessToken2,
              token_type: "bearer",
              expires_in: opts.accessTokenExpiresIn,
              refresh_token: newRefreshToken,
              scope: token.scopes
            });
          }
          if (!code) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "code is required",
              error: "invalid_request"
            });
          }
          if (opts.requirePKCE && !code_verifier) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "code verifier is missing",
              error: "invalid_request"
            });
          }
          const verificationValue = await ctx.context.internalAdapter.findVerificationValue(
            code.toString()
          );
          if (!verificationValue) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "invalid code",
              error: "invalid_grant"
            });
          }
          if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "code expired",
              error: "invalid_grant"
            });
          }
          await ctx.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          if (!client_id || !client_secret) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "client_id and client_secret are required",
              error: "invalid_client"
            });
          }
          if (!grant_type) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "grant_type is required",
              error: "invalid_request"
            });
          }
          if (grant_type !== "authorization_code") {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "grant_type must be 'authorization_code'",
              error: "unsupported_grant_type"
            });
          }
          if (!redirect_uri) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "redirect_uri is required",
              error: "invalid_request"
            });
          }
          const client = await ctx.context.adapter.findOne({
            model: modelName.oauthClient,
            where: [{ field: "clientId", value: client_id.toString() }]
          }).then((res) => {
            if (!res) {
              return null;
            }
            return {
              ...res,
              redirectURLs: res.redirectURLs.split(","),
              metadata: res.metadata ? JSON.parse(res.metadata) : {}
            };
          });
          if (!client) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "invalid client_id",
              error: "invalid_client"
            });
          }
          if (client.disabled) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "client is disabled",
              error: "invalid_client"
            });
          }
          const isValidSecret = client.clientSecret === client_secret.toString();
          if (!isValidSecret) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "invalid client_secret",
              error: "invalid_client"
            });
          }
          const value = JSON.parse(
            verificationValue.value
          );
          if (value.clientId !== client_id.toString()) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "invalid client_id",
              error: "invalid_client"
            });
          }
          if (value.redirectURI !== redirect_uri.toString()) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "invalid redirect_uri",
              error: "invalid_client"
            });
          }
          if (value.codeChallenge && !code_verifier) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error_description: "code verifier is missing",
              error: "invalid_request"
            });
          }
          const challenge = value.codeChallengeMethod === "plain" ? code_verifier : await hash.createHash("SHA-256", "base64urlnopad").digest(
            code_verifier
          );
          if (challenge !== value.codeChallenge) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "code verification failed",
              error: "invalid_request"
            });
          }
          const requestedScopes = value.scope;
          await ctx.context.internalAdapter.deleteVerificationValue(
            verificationValue.id
          );
          const accessToken = random.generateRandomString(32, "a-z", "A-Z");
          const refreshToken = random.generateRandomString(32, "A-Z", "a-z");
          const accessTokenExpiresAt = new Date(
            Date.now() + opts.accessTokenExpiresIn * 1e3
          );
          const refreshTokenExpiresAt = new Date(
            Date.now() + opts.refreshTokenExpiresIn * 1e3
          );
          await ctx.context.adapter.create({
            model: modelName.oauthAccessToken,
            data: {
              accessToken,
              refreshToken,
              accessTokenExpiresAt,
              refreshTokenExpiresAt,
              clientId: client_id.toString(),
              userId: value.userId,
              scopes: requestedScopes.join(" "),
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          const user = await ctx.context.internalAdapter.findUserById(
            value.userId
          );
          if (!user) {
            throw new betterCall.APIError("UNAUTHORIZED", {
              error_description: "user not found",
              error: "invalid_grant"
            });
          }
          let secretKey = {
            alg: "HS256",
            key: await utils.subtle.generateKey(
              {
                name: "HMAC",
                hash: "SHA-256"
              },
              true,
              ["sign", "verify"]
            )
          };
          const profile = {
            given_name: user.name.split(" ")[0],
            family_name: user.name.split(" ")[1],
            name: user.name,
            profile: user.image,
            updated_at: user.updatedAt.toISOString()
          };
          const email = {
            email: user.email,
            email_verified: user.emailVerified
          };
          const userClaims = {
            ...requestedScopes.includes("profile") ? profile : {},
            ...requestedScopes.includes("email") ? email : {}
          };
          const additionalUserClaims = opts.getAdditionalUserInfoClaim ? opts.getAdditionalUserInfoClaim(user, requestedScopes) : {};
          const idToken = await new jose.SignJWT({
            sub: user.id,
            aud: client_id.toString(),
            iat: Date.now(),
            auth_time: ctx.context.session?.session.createdAt.getTime(),
            nonce: value.nonce,
            acr: "urn:mace:incommon:iap:silver",
            // default to silver - ⚠︎ this should be configurable and should be validated against the client's metadata
            ...userClaims,
            ...additionalUserClaims
          }).setProtectedHeader({ alg: secretKey.alg }).setIssuedAt().setExpirationTime(
            Math.floor(Date.now() / 1e3) + opts.accessTokenExpiresIn
          ).sign(secretKey.key);
          return ctx.json(
            {
              access_token: accessToken,
              token_type: "Bearer",
              expires_in: opts.accessTokenExpiresIn,
              refresh_token: requestedScopes.includes("offline_access") ? refreshToken : void 0,
              scope: requestedScopes.join(" "),
              id_token: requestedScopes.includes("openid") ? idToken : void 0
            },
            {
              headers: {
                "Cache-Control": "no-store",
                Pragma: "no-cache"
              }
            }
          );
        }
      ),
      registerMcpClient: account.createAuthEndpoint(
        "/mcp/register",
        {
          method: "POST",
          body: zod.z.object({
            redirect_uris: zod.z.array(zod.z.string()),
            token_endpoint_auth_method: zod.z.enum(["none", "client_secret_basic", "client_secret_post"]).default("client_secret_basic").optional(),
            grant_types: zod.z.array(
              zod.z.enum([
                "authorization_code",
                "implicit",
                "password",
                "client_credentials",
                "refresh_token",
                "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "urn:ietf:params:oauth:grant-type:saml2-bearer"
              ])
            ).default(["authorization_code"]).optional(),
            response_types: zod.z.array(zod.z.enum(["code", "token"])).default(["code"]).optional(),
            client_name: zod.z.string().optional(),
            client_uri: zod.z.string().optional(),
            logo_uri: zod.z.string().optional(),
            scope: zod.z.string().optional(),
            contacts: zod.z.array(zod.z.string()).optional(),
            tos_uri: zod.z.string().optional(),
            policy_uri: zod.z.string().optional(),
            jwks_uri: zod.z.string().optional(),
            jwks: zod.z.record(zod.z.any()).optional(),
            metadata: zod.z.record(zod.z.any()).optional(),
            software_id: zod.z.string().optional(),
            software_version: zod.z.string().optional(),
            software_statement: zod.z.string().optional()
          }),
          metadata: {
            openapi: {
              description: "Register an OAuth2 application",
              responses: {
                "200": {
                  description: "OAuth2 application registered successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "Name of the OAuth2 application"
                          },
                          icon: {
                            type: "string",
                            nullable: true,
                            description: "Icon URL for the application"
                          },
                          metadata: {
                            type: "object",
                            additionalProperties: true,
                            nullable: true,
                            description: "Additional metadata for the application"
                          },
                          clientId: {
                            type: "string",
                            description: "Unique identifier for the client"
                          },
                          clientSecret: {
                            type: "string",
                            description: "Secret key for the client"
                          },
                          redirectURLs: {
                            type: "array",
                            items: { type: "string", format: "uri" },
                            description: "List of allowed redirect URLs"
                          },
                          type: {
                            type: "string",
                            description: "Type of the client",
                            enum: ["web"]
                          },
                          authenticationScheme: {
                            type: "string",
                            description: "Authentication scheme used by the client",
                            enum: ["client_secret"]
                          },
                          disabled: {
                            type: "boolean",
                            description: "Whether the client is disabled",
                            enum: [false]
                          },
                          userId: {
                            type: "string",
                            nullable: true,
                            description: "ID of the user who registered the client, null if registered anonymously"
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
                          }
                        },
                        required: [
                          "name",
                          "clientId",
                          "clientSecret",
                          "redirectURLs",
                          "type",
                          "authenticationScheme",
                          "disabled",
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
          const body = ctx.body;
          const session = await account.getSessionFromCtx(ctx);
          ctx.setHeader("Access-Control-Allow-Origin", "*");
          ctx.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          ctx.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
          );
          ctx.setHeader("Access-Control-Max-Age", "86400");
          ctx.headers?.set("Access-Control-Max-Age", "86400");
          if ((!body.grant_types || body.grant_types.includes("authorization_code") || body.grant_types.includes("implicit")) && (!body.redirect_uris || body.redirect_uris.length === 0)) {
            throw new betterCall.APIError("BAD_REQUEST", {
              error: "invalid_redirect_uri",
              error_description: "Redirect URIs are required for authorization_code and implicit grant types"
            });
          }
          if (body.grant_types && body.response_types) {
            if (body.grant_types.includes("authorization_code") && !body.response_types.includes("code")) {
              throw new betterCall.APIError("BAD_REQUEST", {
                error: "invalid_client_metadata",
                error_description: "When 'authorization_code' grant type is used, 'code' response type must be included"
              });
            }
            if (body.grant_types.includes("implicit") && !body.response_types.includes("token")) {
              throw new betterCall.APIError("BAD_REQUEST", {
                error: "invalid_client_metadata",
                error_description: "When 'implicit' grant type is used, 'token' response type must be included"
              });
            }
          }
          const clientId = opts.generateClientId?.() || random.generateRandomString(32, "a-z", "A-Z");
          const clientSecret = opts.generateClientSecret?.() || random.generateRandomString(32, "a-z", "A-Z");
          await ctx.context.adapter.create({
            model: modelName.oauthClient,
            data: {
              name: body.client_name,
              icon: body.logo_uri,
              metadata: body.metadata ? JSON.stringify(body.metadata) : null,
              clientId,
              clientSecret,
              redirectURLs: body.redirect_uris.join(","),
              type: "web",
              authenticationScheme: body.token_endpoint_auth_method || "client_secret_basic",
              disabled: false,
              userId: session?.session.userId,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          return ctx.json(
            {
              client_id: clientId,
              client_secret: clientSecret,
              client_id_issued_at: Math.floor(Date.now() / 1e3),
              client_secret_expires_at: 0,
              // 0 means it doesn't expire
              redirect_uris: body.redirect_uris,
              token_endpoint_auth_method: body.token_endpoint_auth_method || "client_secret_basic",
              grant_types: body.grant_types || ["authorization_code"],
              response_types: body.response_types || ["code"],
              client_name: body.client_name,
              client_uri: body.client_uri,
              logo_uri: body.logo_uri,
              scope: body.scope,
              contacts: body.contacts,
              tos_uri: body.tos_uri,
              policy_uri: body.policy_uri,
              jwks_uri: body.jwks_uri,
              jwks: body.jwks,
              software_id: body.software_id,
              software_version: body.software_version,
              software_statement: body.software_statement,
              metadata: body.metadata
            },
            {
              status: 201,
              headers: {
                "Cache-Control": "no-store",
                Pragma: "no-cache"
              }
            }
          );
        }
      ),
      getMcpSession: account.createAuthEndpoint(
        "/mcp/get-session",
        {
          method: "GET",
          requireHeaders: true
        },
        async (c) => {
          const accessToken = c.headers?.get("Authorization")?.replace("Bearer ", "");
          if (!accessToken) {
            c.headers?.set("WWW-Authenticate", "Bearer");
            return c.json(null);
          }
          const accessTokenData = await c.context.adapter.findOne({
            model: modelName.oauthAccessToken,
            where: [
              {
                field: "accessToken",
                value: accessToken
              }
            ]
          });
          if (!accessTokenData) {
            return c.json(null);
          }
          return c.json(accessTokenData);
        }
      )
    },
    schema: plugins_oidcProvider_index.schema
  };
};
const withMcpAuth = (auth, handler) => {
  return async (req) => {
    const session = await auth.api.getMcpSession({
      headers: req.headers
    });
    const wwwAuthenticateValue = "Bearer resource_metadata=http://localhost:3000/api/auth/.well-known/oauth-authorization-server";
    if (!session) {
      return Response.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32e3,
            message: "Unauthorized: Authentication required",
            "www-authenticate": wwwAuthenticateValue
          },
          id: null
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": wwwAuthenticateValue
          }
        }
      );
    }
    return handler(req, session);
  };
};
const oAuthDiscoveryMetadata = (auth) => {
  return async (request) => {
    const res = await auth.api.getMcpOAuthConfig();
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
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
exports.getMetadata = plugins_oidcProvider_index.getMetadata;
exports.oidcProvider = plugins_oidcProvider_index.oidcProvider;
exports.captcha = plugins_captcha_index.captcha;
exports.haveIBeenPwned = plugins_haveibeenpwned_index.haveIBeenPwned;
exports.oneTimeToken = plugins_oneTimeToken_index.oneTimeToken;
exports.twoFactorClient = client.twoFactorClient;
exports.API_KEY_TABLE_NAME = API_KEY_TABLE_NAME;
exports.ERROR_CODES = ERROR_CODES;
exports.apiKey = apiKey;
exports.defaultKeyHasher = defaultKeyHasher;
exports.getMCPProviderMetadata = getMCPProviderMetadata;
exports.mcp = mcp;
exports.oAuthDiscoveryMetadata = oAuthDiscoveryMetadata;
exports.withMcpAuth = withMcpAuth;
