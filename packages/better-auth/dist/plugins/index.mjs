export { o as organization, p as parseRoles } from '../shared/better-auth.B5gC5Szw.mjs';
export { TWO_FACTOR_ERROR_CODES, twoFactor } from './two-factor/index.mjs';
export { USERNAME_ERROR_CODES, username } from './username/index.mjs';
export { bearer } from './bearer/index.mjs';
import { a as createAuthEndpoint, g as getSessionFromCtx, s as sessionMiddleware, c as createAuthMiddleware } from '../shared/better-auth.Dvh-YFwT.mjs';
export { H as HIDE_METADATA, P as optionsMiddleware } from '../shared/better-auth.Dvh-YFwT.mjs';
export { magicLink } from './magic-link/index.mjs';
export { phoneNumber } from './phone-number/index.mjs';
export { anonymous } from './anonymous/index.mjs';
export { a as admin } from '../shared/better-auth.DAqwo2a1.mjs';
export { genericOAuth } from './generic-oauth/index.mjs';
export { getJwtToken, jwt } from './jwt/index.mjs';
export { multiSession } from './multi-session/index.mjs';
export { emailOTP } from './email-otp/index.mjs';
export { oneTap } from './one-tap/index.mjs';
export { oAuthProxy } from './oauth-proxy/index.mjs';
export { customSession } from './custom-session/index.mjs';
export { openAPI } from './open-api/index.mjs';
export { oidcProvider } from './oidc-provider/index.mjs';
export { captcha } from './captcha/index.mjs';
import { APIError } from 'better-call';
import { z } from 'zod';
import { g as getDate } from '../shared/better-auth.CW6D9eSx.mjs';
import '../shared/better-auth.8zoxzg-F.mjs';
import { base64Url } from '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import { m as mergeSchema } from '../shared/better-auth.Cc72UxUH.mjs';
import '../shared/better-auth.Cqykj82J.mjs';
import { g as getIp } from '../shared/better-auth.iKoUsdFE.mjs';
import 'defu';
import '@better-auth/utils/random';
import { createHash } from '@better-auth/utils/hash';
import '@noble/ciphers/chacha';
import '@noble/ciphers/utils';
import '@noble/ciphers/webcrypto';
import 'jose';
import '@noble/hashes/scrypt';
import '@better-auth/utils';
import '@better-auth/utils/hex';
import '@noble/hashes/utils';
import '../shared/better-auth.B4Qoxdgc.mjs';
import 'kysely';
import { p as parseJSON } from '../shared/better-auth.ffWeg50w.mjs';
import { s as safeJSONParse } from '../shared/better-auth.tB5eU6EY.mjs';
import { role } from './access/index.mjs';
export { haveIBeenPwned } from './haveibeenpwned/index.mjs';
export { oneTimeToken } from './one-time-token/index.mjs';
export { t as twoFactorClient } from '../shared/better-auth.Ddw8bVyV.mjs';
import '../shared/better-auth.DdzSJf-n.mjs';
import '../shared/better-auth.OuYYTHC7.mjs';
import './organization/access/index.mjs';
import '../cookies/index.mjs';
import '../shared/better-auth.VTXNLFMT.mjs';
import '../shared/better-auth.BUPPRXfK.mjs';
import '../crypto/index.mjs';
import '../shared/better-auth.OT3XFeFk.mjs';
import '../shared/better-auth.DDEbWX-S.mjs';
import '@better-auth/utils/otp';
import '../shared/better-auth.YwDQhoPc.mjs';
import '../social-providers/index.mjs';
import '@better-fetch/fetch';
import '../shared/better-auth.DufyW0qf.mjs';
import '../shared/better-auth.dn8_oqOu.mjs';
import 'jose/errors';
import '@better-auth/utils/binary';
import '../shared/better-auth.DQI8AD7d.mjs';
import '../shared/better-auth.bkwPl2G4.mjs';
import './admin/access/index.mjs';
import '../shared/better-auth.fsvwNeUx.mjs';
import '../api/index.mjs';
import '../shared/better-auth.DORkW_Ge.mjs';

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
            return parseJSON(value);
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
  return createAuthEndpoint(
    "/api-key/create",
    {
      method: "POST",
      body: z.object({
        name: z.string({ description: "Name of the Api Key" }).optional(),
        expiresIn: z.number({
          description: "Expiration time of the Api Key in seconds"
        }).min(1).optional().nullable().default(null),
        userId: z.coerce.string({
          description: "User Id of the user that the Api Key belongs to. Useful for server-side only."
        }).optional(),
        prefix: z.string({ description: "Prefix of the Api Key" }).regex(/^[a-zA-Z0-9_-]+$/, {
          message: "Invalid prefix format, must be alphanumeric and contain only underscores and hyphens."
        }).optional(),
        remaining: z.number({
          description: "Remaining number of requests. Server side only"
        }).min(0).optional().nullable().default(null),
        metadata: z.any({ description: "Metadata of the Api Key" }).optional(),
        refillAmount: z.number({
          description: "Amount to refill the remaining count of the Api Key. Server Only Property"
        }).min(1).optional(),
        refillInterval: z.number({
          description: "Interval to refill the Api Key in milliseconds. Server Only Property."
        }).optional(),
        rateLimitTimeWindow: z.number({
          description: "The duration in milliseconds where each request is counted. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. Server Only Property."
        }).optional(),
        rateLimitMax: z.number({
          description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. Server Only Property."
        }).optional(),
        rateLimitEnabled: z.boolean({
          description: "Whether the key has rate limiting enabled. Server Only Property."
        }).optional(),
        permissions: z.record(z.string(), z.array(z.string())).optional()
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
      const session = await getSessionFromCtx(ctx);
      const authRequired = (ctx.request || ctx.headers) && !ctx.body.userId;
      const user = session?.user ?? (authRequired ? null : { id: ctx.body.userId });
      if (!user?.id) {
        throw new APIError("UNAUTHORIZED", {
          message: ERROR_CODES.UNAUTHORIZED_SESSION
        });
      }
      if (authRequired) {
        if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || permissions !== void 0 || remaining !== null) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.SERVER_ONLY_PROPERTY
          });
        }
      }
      if (metadata) {
        if (opts.enableMetadata === false) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.METADATA_DISABLED
          });
        }
        if (typeof metadata !== "object") {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_METADATA_TYPE
          });
        }
      }
      if (refillAmount && !refillInterval) {
        throw new APIError("BAD_REQUEST", {
          message: ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED
        });
      }
      if (refillInterval && !refillAmount) {
        throw new APIError("BAD_REQUEST", {
          message: ERROR_CODES.REFILL_INTERVAL_AND_AMOUNT_REQUIRED
        });
      }
      if (expiresIn) {
        if (opts.keyExpiration.disableCustomExpiresTime === true) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.KEY_DISABLED_EXPIRATION
          });
        }
        const expiresIn_in_days = expiresIn / (60 * 60 * 24);
        if (opts.keyExpiration.minExpiresIn > expiresIn_in_days) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL
          });
        } else if (opts.keyExpiration.maxExpiresIn < expiresIn_in_days) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE
          });
        }
      }
      if (prefix) {
        if (prefix.length < opts.minimumPrefixLength) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_PREFIX_LENGTH
          });
        }
        if (prefix.length > opts.maximumPrefixLength) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_PREFIX_LENGTH
          });
        }
      }
      if (name) {
        if (name.length < opts.minimumNameLength) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_NAME_LENGTH
          });
        }
        if (name.length > opts.maximumNameLength) {
          throw new APIError("BAD_REQUEST", {
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
        expiresAt: expiresIn ? getDate(expiresIn, "sec") : opts.keyExpiration.defaultExpiresIn ? getDate(opts.keyExpiration.defaultExpiresIn, "sec") : null,
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
        permissions: apiKey.permissions ? safeJSONParse(
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
  return createAuthEndpoint(
    "/api-key/delete",
    {
      method: "POST",
      body: z.object({
        keyId: z.string({
          description: "The id of the Api Key"
        })
      }),
      use: [sessionMiddleware],
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
        throw new APIError("UNAUTHORIZED", {
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
        throw new APIError("NOT_FOUND", {
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
        throw new APIError("INTERNAL_SERVER_ERROR", {
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
  return createAuthEndpoint(
    "/api-key/get",
    {
      method: "GET",
      query: z.object({
        id: z.string({
          description: "The id of the Api Key"
        })
      }),
      use: [sessionMiddleware],
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
        throw new APIError("NOT_FOUND", {
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
        permissions: returningApiKey.permissions ? safeJSONParse(
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
  return createAuthEndpoint(
    "/api-key/update",
    {
      method: "POST",
      body: z.object({
        keyId: z.string({
          description: "The id of the Api Key"
        }),
        userId: z.coerce.string().optional(),
        name: z.string({
          description: "The name of the key"
        }).optional(),
        enabled: z.boolean({
          description: "Whether the Api Key is enabled or not"
        }).optional(),
        remaining: z.number({
          description: "The number of remaining requests"
        }).min(1).optional(),
        refillAmount: z.number({
          description: "The refill amount"
        }).optional(),
        refillInterval: z.number({
          description: "The refill interval"
        }).optional(),
        metadata: z.any({
          description: "The metadata of the Api Key"
        }).optional(),
        expiresIn: z.number({
          description: "Expiration time of the Api Key in seconds"
        }).min(1).optional().nullable(),
        rateLimitEnabled: z.boolean({
          description: "Whether the key has rate limiting enabled."
        }).optional(),
        rateLimitTimeWindow: z.number({
          description: "The duration in milliseconds where each request is counted."
        }).optional(),
        rateLimitMax: z.number({
          description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset."
        }).optional(),
        permissions: z.record(z.string(), z.array(z.string())).optional().nullable()
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
      const session = await getSessionFromCtx(ctx);
      const authRequired = (ctx.request || ctx.headers) && !ctx.body.userId;
      const user = session?.user ?? (authRequired ? null : { id: ctx.body.userId });
      if (!user?.id) {
        throw new APIError("UNAUTHORIZED", {
          message: ERROR_CODES.UNAUTHORIZED_SESSION
        });
      }
      if (authRequired) {
        if (refillAmount !== void 0 || refillInterval !== void 0 || rateLimitMax !== void 0 || rateLimitTimeWindow !== void 0 || rateLimitEnabled !== void 0 || remaining !== void 0 || permissions !== void 0) {
          throw new APIError("BAD_REQUEST", {
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
        throw new APIError("NOT_FOUND", {
          message: ERROR_CODES.KEY_NOT_FOUND
        });
      }
      let newValues = {};
      if (name !== void 0) {
        if (name.length < opts.minimumNameLength) {
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.INVALID_NAME_LENGTH
          });
        } else if (name.length > opts.maximumNameLength) {
          throw new APIError("BAD_REQUEST", {
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
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.KEY_DISABLED_EXPIRATION
          });
        }
        if (expiresIn !== null) {
          const expiresIn_in_days = expiresIn / (60 * 60 * 24);
          if (expiresIn_in_days < opts.keyExpiration.minExpiresIn) {
            throw new APIError("BAD_REQUEST", {
              message: ERROR_CODES.EXPIRES_IN_IS_TOO_SMALL
            });
          } else if (expiresIn_in_days > opts.keyExpiration.maxExpiresIn) {
            throw new APIError("BAD_REQUEST", {
              message: ERROR_CODES.EXPIRES_IN_IS_TOO_LARGE
            });
          }
        }
        newValues.expiresAt = expiresIn ? getDate(expiresIn, "sec") : null;
      }
      if (metadata !== void 0) {
        if (typeof metadata !== "object") {
          throw new APIError("BAD_REQUEST", {
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
          throw new APIError("BAD_REQUEST", {
            message: ERROR_CODES.REFILL_AMOUNT_AND_INTERVAL_REQUIRED
          });
        } else if (refillInterval !== void 0 && refillAmount === void 0) {
          throw new APIError("BAD_REQUEST", {
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
        throw new APIError("BAD_REQUEST", {
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
        throw new APIError("INTERNAL_SERVER_ERROR", {
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
        permissions: returningApiKey.permissions ? safeJSONParse(
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
  return createAuthEndpoint(
    "/api-key/verify",
    {
      method: "POST",
      body: z.object({
        key: z.string({
          description: "The key to verify"
        }),
        permissions: z.record(z.string(), z.array(z.string())).optional()
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
      const apiKeyPermissions = apiKey.permissions ? safeJSONParse(
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
        const r = role(apiKeyPermissions);
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
      returningApiKey.permissions = returningApiKey.permissions ? safeJSONParse(
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
  return createAuthEndpoint(
    "/api-key/list",
    {
      method: "GET",
      use: [sessionMiddleware],
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
          permissions: returningApiKey2.permissions ? safeJSONParse(
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
  return createAuthEndpoint(
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
  const hash = await createHash("SHA-256").digest(
    new TextEncoder().encode(key)
  );
  const hashed = base64Url.encode(new Uint8Array(hash), {
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
  const schema = mergeSchema(
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
  const routes = createApiKeyRoutes({ keyGenerator, opts, schema });
  return {
    id: "api-key",
    $ERROR_CODES: ERROR_CODES,
    hooks: {
      before: [
        {
          matcher: (ctx) => !!getter(ctx) && opts.disableSessionForAPIKeys === false,
          handler: createAuthMiddleware(async (ctx) => {
            const key = getter(ctx);
            if (typeof key !== "string") {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.INVALID_API_KEY_GETTER_RETURN_TYPE
              });
            }
            if (key.length < opts.defaultKeyLength) {
              throw new APIError("FORBIDDEN", {
                message: ERROR_CODES.INVALID_API_KEY
              });
            }
            if (opts.customAPIKeyValidator && !opts.customAPIKeyValidator({ ctx, key })) {
              throw new APIError("FORBIDDEN", {
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
              throw new APIError("UNAUTHORIZED", {
                message: ERROR_CODES.INVALID_API_KEY
              });
            }
            let user;
            try {
              const userResult = await ctx.context.internalAdapter.findUserById(
                apiKey2.userId
              );
              if (!userResult) {
                throw new APIError("UNAUTHORIZED", {
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
                ipAddress: ctx.request ? getIp(ctx.request, ctx.context.options) : null,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                expiresAt: apiKey2.expiresAt || getDate(
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
    schema
  };
};

export { API_KEY_TABLE_NAME, ERROR_CODES, apiKey, createAuthEndpoint, createAuthMiddleware, defaultKeyHasher };
