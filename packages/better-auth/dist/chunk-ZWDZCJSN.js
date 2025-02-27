import { safeJSONParse, parseSessionOutput, getIp, parseUserOutput } from './chunk-MEZ6VLJL.js';
import { generateId, logger, createLogger } from './chunk-KLDFBLYL.js';
import { getDate } from './chunk-FURNA6HY.js';
import { BetterAuthError } from './chunk-UNWCXKMP.js';
import { Kysely, SqliteDialect, MysqlDialect, PostgresDialect, MssqlDialect } from 'kysely';
import { z } from 'zod';

function getDatabaseType(db) {
  if (!db) {
    return null;
  }
  if ("dialect" in db) {
    return getDatabaseType(db.dialect);
  }
  if ("createDriver" in db) {
    if (db instanceof SqliteDialect) {
      return "sqlite";
    }
    if (db instanceof MysqlDialect) {
      return "mysql";
    }
    if (db instanceof PostgresDialect) {
      return "postgres";
    }
    if (db instanceof MssqlDialect) {
      return "mssql";
    }
  }
  if ("aggregate" in db) {
    return "sqlite";
  }
  if ("getConnection" in db) {
    return "mysql";
  }
  if ("connect" in db) {
    return "postgres";
  }
  return null;
}
var createKyselyAdapter = async (config) => {
  const db = config.database;
  if (!db) {
    return {
      kysely: null,
      databaseType: null
    };
  }
  if ("db" in db) {
    return {
      kysely: db.db,
      databaseType: db.type
    };
  }
  if ("dialect" in db) {
    return {
      kysely: new Kysely({ dialect: db.dialect }),
      databaseType: db.type
    };
  }
  let dialect = void 0;
  const databaseType = getDatabaseType(db);
  if ("createDriver" in db) {
    dialect = db;
  }
  if ("aggregate" in db) {
    dialect = new SqliteDialect({
      database: db
    });
  }
  if ("getConnection" in db) {
    dialect = new MysqlDialect(db);
  }
  if ("connect" in db) {
    dialect = new PostgresDialect({
      pool: db
    });
  }
  return {
    kysely: dialect ? new Kysely({ dialect }) : null,
    databaseType
  };
};

// src/db/with-hooks.ts
function getWithHooks(adapter, ctx) {
  const hooks = ctx.hooks;
  async function createWithHooks(data, model, customCreateFn) {
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.create?.before;
      if (toRun) {
        const result = await toRun(data);
        if (result === false) {
          return null;
        }
        const isObject = typeof result === "object" && "data" in result;
        if (isObject) {
          actualData = result.data;
        }
      }
    }
    const customCreated = customCreateFn ? await customCreateFn.fn(actualData) : null;
    const created = !customCreateFn || customCreateFn.executeMainFn ? await adapter.create({
      model,
      data: actualData
    }) : customCreated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.create?.after;
      if (toRun) {
        await toRun(created);
      }
    }
    return created;
  }
  async function updateWithHooks(data, where, model, customUpdateFn) {
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.before;
      if (toRun) {
        const result = await toRun(data);
        if (result === false) {
          return null;
        }
        const isObject = typeof result === "object";
        actualData = isObject ? result.data : result;
      }
    }
    const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
    const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await adapter.update({
      model,
      update: actualData,
      where
    }) : customUpdated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.after;
      if (toRun) {
        await toRun(updated);
      }
    }
    return updated;
  }
  async function updateManyWithHooks(data, where, model, customUpdateFn) {
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.before;
      if (toRun) {
        const result = await toRun(data);
        if (result === false) {
          return null;
        }
        const isObject = typeof result === "object";
        actualData = isObject ? result.data : result;
      }
    }
    const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
    const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await adapter.updateMany({
      model,
      update: actualData,
      where
    }) : customUpdated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.after;
      if (toRun) {
        await toRun(updated);
      }
    }
    return updated;
  }
  return {
    createWithHooks,
    updateWithHooks,
    updateManyWithHooks
  };
}

// src/db/internal-adapter.ts
var createInternalAdapter = (adapter, ctx) => {
  const options = ctx.options;
  const secondaryStorage = options.secondaryStorage;
  const sessionExpiration = options.session?.expiresIn || 60 * 60 * 24 * 7;
  const { createWithHooks, updateWithHooks, updateManyWithHooks } = getWithHooks(adapter, ctx);
  return {
    createOAuthUser: async (user, account) => {
      const createdUser = await createWithHooks(
        {
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          ...user
        },
        "user"
      );
      const createdAccount = await createWithHooks(
        {
          ...account,
          userId: createdUser.id || user.id,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        },
        "account"
      );
      return {
        user: createdUser,
        account: createdAccount
      };
    },
    createUser: async (user) => {
      const createdUser = await createWithHooks(
        {
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          emailVerified: false,
          ...user,
          email: user.email.toLowerCase()
        },
        "user"
      );
      return createdUser;
    },
    createAccount: async (account) => {
      const createdAccount = await createWithHooks(
        {
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          ...account
        },
        "account"
      );
      return createdAccount;
    },
    listSessions: async (userId) => {
      if (secondaryStorage) {
        const currentList = await secondaryStorage.get(
          `active-sessions-${userId}`
        );
        if (!currentList) return [];
        const list = safeJSONParse(currentList) || [];
        const now = Date.now();
        const validSessions = list.filter((s) => s.expiresAt > now);
        const sessions2 = [];
        for (const session of validSessions) {
          const sessionStringified = await secondaryStorage.get(session.token);
          if (sessionStringified) {
            const s = JSON.parse(sessionStringified);
            const parsedSession = parseSessionOutput(ctx.options, {
              ...s.session,
              expiresAt: new Date(s.session.expiresAt)
            });
            sessions2.push(parsedSession);
          }
        }
        return sessions2;
      }
      const sessions = await adapter.findMany({
        model: "session",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
      return sessions;
    },
    listUsers: async (limit, offset, sortBy, where) => {
      const users = await adapter.findMany({
        model: "user",
        limit,
        offset,
        sortBy,
        where
      });
      return users;
    },
    listTotalUsers: async () => {
      const total = await adapter.count({
        model: "user"
      });
      return total;
    },
    deleteUser: async (userId) => {
      await adapter.deleteMany({
        model: "session",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
      await adapter.deleteMany({
        model: "account",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
      await adapter.delete({
        model: "user",
        where: [
          {
            field: "id",
            value: userId
          }
        ]
      });
    },
    createSession: async (userId, request, dontRememberMe, override) => {
      const headers = request instanceof Request ? request.headers : request;
      const { id: _, ...rest } = override || {};
      const data = {
        ipAddress: request ? getIp(request, ctx.options) || "" : "",
        userAgent: headers?.get("user-agent") || "",
        ...rest,
        /**
         * If the user doesn't want to be remembered
         * set the session to expire in 1 day.
         * The cookie will be set to expire at the end of the session
         */
        expiresAt: dontRememberMe ? getDate(60 * 60 * 24, "sec") : getDate(sessionExpiration, "sec"),
        userId,
        token: generateId(32),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      const res = await createWithHooks(
        data,
        "session",
        secondaryStorage ? {
          fn: async (sessionData) => {
            const currentList = await secondaryStorage.get(
              `active-sessions-${userId}`
            );
            let list = [];
            const now = Date.now();
            if (currentList) {
              list = safeJSONParse(currentList) || [];
              list = list.filter((session) => session.expiresAt > now);
            }
            list.push({
              token: data.token,
              expiresAt: now + sessionExpiration * 1e3
            });
            await secondaryStorage.set(
              `active-sessions-${userId}`,
              JSON.stringify(list),
              sessionExpiration
            );
            return sessionData;
          },
          executeMainFn: options.session?.storeSessionInDatabase
        } : void 0
      );
      return res;
    },
    findSession: async (token) => {
      if (secondaryStorage) {
        const sessionStringified = await secondaryStorage.get(token);
        if (!sessionStringified) {
          return null;
        }
        const s = JSON.parse(sessionStringified);
        const parsedSession2 = parseSessionOutput(ctx.options, {
          ...s.session,
          expiresAt: new Date(s.session.expiresAt),
          createdAt: new Date(s.session.createdAt),
          updatedAt: new Date(s.session.updatedAt)
        });
        const parsedUser2 = parseUserOutput(ctx.options, {
          ...s.user,
          createdAt: new Date(s.user.createdAt),
          updatedAt: new Date(s.user.updatedAt)
        });
        return {
          session: parsedSession2,
          user: parsedUser2
        };
      }
      const session = await adapter.findOne({
        model: "session",
        where: [
          {
            value: token,
            field: "token"
          }
        ]
      });
      if (!session) {
        return null;
      }
      const user = await adapter.findOne({
        model: "user",
        where: [
          {
            value: session.userId,
            field: "id"
          }
        ]
      });
      if (!user) {
        return null;
      }
      const parsedSession = parseSessionOutput(ctx.options, session);
      const parsedUser = parseUserOutput(ctx.options, user);
      return {
        session: parsedSession,
        user: parsedUser
      };
    },
    findSessions: async (sessionTokens) => {
      if (secondaryStorage) {
        const sessions2 = [];
        for (const sessionToken of sessionTokens) {
          const sessionStringified = await secondaryStorage.get(sessionToken);
          if (sessionStringified) {
            const s = JSON.parse(sessionStringified);
            const session = {
              session: {
                ...s.session,
                expiresAt: new Date(s.session.expiresAt)
              },
              user: {
                ...s.user,
                createdAt: new Date(s.user.createdAt),
                updatedAt: new Date(s.user.updatedAt)
              }
            };
            sessions2.push(session);
          }
        }
        return sessions2;
      }
      const sessions = await adapter.findMany({
        model: "session",
        where: [
          {
            field: "token",
            value: sessionTokens,
            operator: "in"
          }
        ]
      });
      const userIds = sessions.map((session) => {
        return session.userId;
      });
      if (!userIds.length) return [];
      const users = await adapter.findMany({
        model: "user",
        where: [
          {
            field: "id",
            value: userIds,
            operator: "in"
          }
        ]
      });
      return sessions.map((session) => {
        const user = users.find((u) => u.id === session.userId);
        if (!user) return null;
        return {
          session,
          user
        };
      });
    },
    updateSession: async (sessionToken, session) => {
      const updatedSession = await updateWithHooks(
        session,
        [{ field: "token", value: sessionToken }],
        "session",
        secondaryStorage ? {
          async fn(data) {
            const currentSession = await secondaryStorage.get(sessionToken);
            let updatedSession2 = null;
            if (currentSession) {
              const parsedSession = JSON.parse(currentSession);
              updatedSession2 = {
                ...parsedSession.session,
                ...data
              };
              return updatedSession2;
            } else {
              return null;
            }
          },
          executeMainFn: options.session?.storeSessionInDatabase
        } : void 0
      );
      return updatedSession;
    },
    deleteSession: async (token) => {
      if (secondaryStorage) {
        await secondaryStorage.delete(token);
        if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) {
          return;
        }
      }
      await adapter.delete({
        model: "session",
        where: [
          {
            field: "token",
            value: token
          }
        ]
      });
    },
    deleteAccounts: async (userId) => {
      await adapter.deleteMany({
        model: "account",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
    },
    deleteAccount: async (providerId, userId) => {
      await adapter.delete({
        model: "account",
        where: [
          {
            field: "providerId",
            value: providerId
          },
          {
            field: "userId",
            value: userId
          }
        ]
      });
    },
    deleteSessions: async (userIdOrSessionTokens) => {
      if (secondaryStorage) {
        if (typeof userIdOrSessionTokens === "string") {
          const activeSession = await secondaryStorage.get(
            `active-sessions-${userIdOrSessionTokens}`
          );
          const sessions = activeSession ? safeJSONParse(activeSession) : [];
          if (!sessions) return;
          for (const session of sessions) {
            await secondaryStorage.delete(session.token);
          }
        } else {
          for (const sessionToken of userIdOrSessionTokens) {
            const session = await secondaryStorage.get(sessionToken);
            if (session) {
              await secondaryStorage.delete(sessionToken);
            }
          }
        }
        if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) {
          return;
        }
      }
      await adapter.deleteMany({
        model: "session",
        where: [
          {
            field: Array.isArray(userIdOrSessionTokens) ? "token" : "userId",
            value: userIdOrSessionTokens,
            operator: Array.isArray(userIdOrSessionTokens) ? "in" : void 0
          }
        ]
      });
    },
    findOAuthUser: async (email, accountId, providerId) => {
      const account = await adapter.findOne({
        model: "account",
        where: [
          {
            value: accountId,
            field: "accountId"
          },
          {
            value: providerId,
            field: "providerId"
          }
        ]
      });
      if (account) {
        const user = await adapter.findOne({
          model: "user",
          where: [
            {
              value: account.userId,
              field: "id"
            }
          ]
        });
        if (user) {
          return {
            user,
            accounts: [account]
          };
        } else {
          return null;
        }
      } else {
        const user = await adapter.findOne({
          model: "user",
          where: [
            {
              value: email.toLowerCase(),
              field: "email"
            }
          ]
        });
        if (user) {
          const accounts = await adapter.findMany({
            model: "account",
            where: [
              {
                value: user.id,
                field: "userId"
              }
            ]
          });
          return {
            user,
            accounts: accounts || []
          };
        } else {
          return null;
        }
      }
    },
    findUserByEmail: async (email, options2) => {
      const user = await adapter.findOne({
        model: "user",
        where: [
          {
            value: email.toLowerCase(),
            field: "email"
          }
        ]
      });
      if (!user) return null;
      if (options2?.includeAccounts) {
        const accounts = await adapter.findMany({
          model: "account",
          where: [
            {
              value: user.id,
              field: "userId"
            }
          ]
        });
        return {
          user,
          accounts
        };
      }
      return {
        user,
        accounts: []
      };
    },
    findUserById: async (userId) => {
      const user = await adapter.findOne({
        model: "user",
        where: [
          {
            field: "id",
            value: userId
          }
        ]
      });
      return user;
    },
    linkAccount: async (account) => {
      const _account = await createWithHooks(
        {
          ...account,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        },
        "account"
      );
      return _account;
    },
    updateUser: async (userId, data) => {
      const user = await updateWithHooks(
        data,
        [
          {
            field: "id",
            value: userId
          }
        ],
        "user"
      );
      return user;
    },
    updateUserByEmail: async (email, data) => {
      const user = await updateWithHooks(
        data,
        [
          {
            field: "email",
            value: email
          }
        ],
        "user"
      );
      return user;
    },
    updatePassword: async (userId, password) => {
      await updateManyWithHooks(
        {
          password
        },
        [
          {
            field: "userId",
            value: userId
          },
          {
            field: "providerId",
            value: "credential"
          }
        ],
        "account"
      );
    },
    findAccounts: async (userId) => {
      const accounts = await adapter.findMany({
        model: "account",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
      return accounts;
    },
    findAccount: async (accountId) => {
      const account = await adapter.findOne({
        model: "account",
        where: [
          {
            field: "accountId",
            value: accountId
          }
        ]
      });
      return account;
    },
    findAccountByUserId: async (userId) => {
      const account = await adapter.findMany({
        model: "account",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
      return account;
    },
    updateAccount: async (accountId, data) => {
      const account = await updateWithHooks(
        data,
        [{ field: "id", value: accountId }],
        "account"
      );
      return account;
    },
    createVerificationValue: async (data) => {
      const verification = await createWithHooks(
        {
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          ...data
        },
        "verification"
      );
      return verification;
    },
    findVerificationValue: async (identifier) => {
      const verification = await adapter.findMany({
        model: "verification",
        where: [
          {
            field: "identifier",
            value: identifier
          }
        ],
        sortBy: {
          field: "createdAt",
          direction: "desc"
        },
        limit: 1
      });
      const lastVerification = verification[0];
      return lastVerification;
    },
    deleteVerificationValue: async (id) => {
      await adapter.delete({
        model: "verification",
        where: [
          {
            field: "id",
            value: id
          }
        ]
      });
    },
    deleteVerificationByIdentifier: async (identifier) => {
      await adapter.delete({
        model: "verification",
        where: [
          {
            field: "identifier",
            value: identifier
          }
        ]
      });
    },
    updateVerificationValue: async (id, data) => {
      const verification = await updateWithHooks(
        data,
        [{ field: "id", value: id }],
        "verification"
      );
      return verification;
    }
  };
};

// src/db/field.ts
var createFieldAttribute = (type, config) => {
  return {
    type,
    ...config
  };
};

// src/db/get-tables.ts
var getAuthTables = (options) => {
  const pluginSchema = options.plugins?.reduce(
    (acc, plugin) => {
      const schema = plugin.schema;
      if (!schema) return acc;
      for (const [key, value] of Object.entries(schema)) {
        acc[key] = {
          fields: {
            ...acc[key]?.fields,
            ...value.fields
          },
          modelName: value.modelName || key
        };
      }
      return acc;
    },
    {}
  );
  const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
  const rateLimitTable = {
    rateLimit: {
      modelName: options.rateLimit?.modelName || "rateLimit",
      fields: {
        key: {
          type: "string",
          fieldName: options.rateLimit?.fields?.key || "key"
        },
        count: {
          type: "number",
          fieldName: options.rateLimit?.fields?.count || "count"
        },
        lastRequest: {
          type: "number",
          bigint: true,
          fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest"
        }
      }
    }
  };
  const { user, session, account, ...pluginTables } = pluginSchema || {};
  return {
    user: {
      modelName: options.user?.modelName || "user",
      fields: {
        name: {
          type: "string",
          required: true,
          fieldName: options.user?.fields?.name || "name",
          sortable: true
        },
        email: {
          type: "string",
          unique: true,
          required: true,
          fieldName: options.user?.fields?.email || "email",
          sortable: true
        },
        emailVerified: {
          type: "boolean",
          defaultValue: () => false,
          required: true,
          fieldName: options.user?.fields?.emailVerified || "emailVerified"
        },
        image: {
          type: "string",
          required: false,
          fieldName: options.user?.fields?.image || "image"
        },
        createdAt: {
          type: "date",
          defaultValue: () => /* @__PURE__ */ new Date(),
          required: true,
          fieldName: options.user?.fields?.createdAt || "createdAt"
        },
        updatedAt: {
          type: "date",
          defaultValue: () => /* @__PURE__ */ new Date(),
          required: true,
          fieldName: options.user?.fields?.updatedAt || "updatedAt"
        },
        ...user?.fields,
        ...options.user?.additionalFields
      },
      order: 1
    },
    session: {
      modelName: options.session?.modelName || "session",
      fields: {
        expiresAt: {
          type: "date",
          required: true,
          fieldName: options.session?.fields?.expiresAt || "expiresAt"
        },
        token: {
          type: "string",
          required: true,
          fieldName: options.session?.fields?.token || "token",
          unique: true
        },
        createdAt: {
          type: "date",
          required: true,
          fieldName: options.session?.fields?.createdAt || "createdAt"
        },
        updatedAt: {
          type: "date",
          required: true,
          fieldName: options.session?.fields?.updatedAt || "updatedAt"
        },
        ipAddress: {
          type: "string",
          required: false,
          fieldName: options.session?.fields?.ipAddress || "ipAddress"
        },
        userAgent: {
          type: "string",
          required: false,
          fieldName: options.session?.fields?.userAgent || "userAgent"
        },
        userId: {
          type: "string",
          fieldName: options.session?.fields?.userId || "userId",
          references: {
            model: options.user?.modelName || "user",
            field: "id",
            onDelete: "cascade"
          },
          required: true
        },
        ...session?.fields,
        ...options.session?.additionalFields
      },
      order: 2
    },
    account: {
      modelName: options.account?.modelName || "account",
      fields: {
        accountId: {
          type: "string",
          required: true,
          fieldName: options.account?.fields?.accountId || "accountId"
        },
        providerId: {
          type: "string",
          required: true,
          fieldName: options.account?.fields?.providerId || "providerId"
        },
        userId: {
          type: "string",
          references: {
            model: options.user?.modelName || "user",
            field: "id",
            onDelete: "cascade"
          },
          required: true,
          fieldName: options.account?.fields?.userId || "userId"
        },
        accessToken: {
          type: "string",
          required: false,
          fieldName: options.account?.fields?.accessToken || "accessToken"
        },
        refreshToken: {
          type: "string",
          required: false,
          fieldName: options.account?.fields?.refreshToken || "refreshToken"
        },
        idToken: {
          type: "string",
          required: false,
          fieldName: options.account?.fields?.idToken || "idToken"
        },
        accessTokenExpiresAt: {
          type: "date",
          required: false,
          fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
        },
        refreshTokenExpiresAt: {
          type: "date",
          required: false,
          fieldName: options.account?.fields?.accessTokenExpiresAt || "refreshTokenExpiresAt"
        },
        scope: {
          type: "string",
          required: false,
          fieldName: options.account?.fields?.scope || "scope"
        },
        password: {
          type: "string",
          required: false,
          fieldName: options.account?.fields?.password || "password"
        },
        createdAt: {
          type: "date",
          required: true,
          fieldName: options.account?.fields?.createdAt || "createdAt"
        },
        updatedAt: {
          type: "date",
          required: true,
          fieldName: options.account?.fields?.updatedAt || "updatedAt"
        },
        ...account?.fields
      },
      order: 3
    },
    verification: {
      modelName: options.verification?.modelName || "verification",
      fields: {
        identifier: {
          type: "string",
          required: true,
          fieldName: options.verification?.fields?.identifier || "identifier"
        },
        value: {
          type: "string",
          required: true,
          fieldName: options.verification?.fields?.value || "value"
        },
        expiresAt: {
          type: "date",
          required: true,
          fieldName: options.verification?.fields?.expiresAt || "expiresAt"
        },
        createdAt: {
          type: "date",
          required: false,
          defaultValue: () => /* @__PURE__ */ new Date(),
          fieldName: options.verification?.fields?.createdAt || "createdAt"
        },
        updatedAt: {
          type: "date",
          required: false,
          defaultValue: () => /* @__PURE__ */ new Date(),
          fieldName: options.verification?.fields?.updatedAt || "updatedAt"
        }
      },
      order: 4
    },
    ...pluginTables,
    ...shouldAddRateLimitTable ? rateLimitTable : {}
  };
};
function toZodSchema(fields) {
  const schema = z.object({
    ...Object.keys(fields).reduce((acc, key) => {
      const field = fields[key];
      if (!field) {
        return acc;
      }
      if (field.type === "string[]" || field.type === "number[]") {
        return {
          ...acc,
          [key]: z.array(field.type === "string[]" ? z.string() : z.number())
        };
      }
      if (Array.isArray(field.type)) {
        return {
          ...acc,
          [key]: z.any()
        };
      }
      let schema2 = z[field.type]();
      if (field?.required === false) {
        schema2 = schema2.optional();
      }
      if (field?.returned === false) {
        return acc;
      }
      return {
        ...acc,
        [key]: schema2
      };
    }, {})
  });
  return schema;
}

// src/adapters/utils.ts
function withApplyDefault(value, field, action) {
  if (action === "update") {
    return value;
  }
  if (value === void 0 || value === null) {
    if (field.defaultValue) {
      if (typeof field.defaultValue === "function") {
        return field.defaultValue();
      }
      return field.defaultValue;
    }
  }
  return value;
}

// src/adapters/memory-adapter/memory-adapter.ts
var createTransform = (options) => {
  const schema = getAuthTables(options);
  function getField(model, field) {
    if (field === "id") {
      return field;
    }
    const f = schema[model].fields[field];
    return f.fieldName || field;
  }
  return {
    transformInput(data, model, action) {
      const transformedData = action === "update" ? {} : {
        id: options.advanced?.generateId ? options.advanced.generateId({
          model
        }) : data.id || generateId()
      };
      const fields = schema[model].fields;
      for (const field in fields) {
        const value = data[field];
        if (value === void 0 && !fields[field].defaultValue) {
          continue;
        }
        transformedData[fields[field].fieldName || field] = withApplyDefault(
          value,
          fields[field],
          action
        );
      }
      return transformedData;
    },
    transformOutput(data, model, select = []) {
      if (!data) return null;
      const transformedData = data.id || data._id ? select.length === 0 || select.includes("id") ? {
        id: data.id
      } : {} : {};
      const tableSchema = schema[model].fields;
      for (const key in tableSchema) {
        if (select.length && !select.includes(key)) {
          continue;
        }
        const field = tableSchema[key];
        if (field) {
          transformedData[key] = data[field.fieldName || key];
        }
      }
      return transformedData;
    },
    convertWhereClause(where, table, model) {
      return table.filter((record) => {
        return where.every((clause) => {
          const { field: _field, value, operator } = clause;
          const field = getField(model, _field);
          if (operator === "in") {
            if (!Array.isArray(value)) {
              throw new Error("Value must be an array");
            }
            return value.includes(record[field]);
          } else if (operator === "contains") {
            return record[field].includes(value);
          } else if (operator === "starts_with") {
            return record[field].startsWith(value);
          } else if (operator === "ends_with") {
            return record[field].endsWith(value);
          } else {
            return record[field] === value;
          }
        });
      });
    },
    getField
  };
};
var memoryAdapter = (db) => (options) => {
  const { transformInput, transformOutput, convertWhereClause, getField } = createTransform(options);
  return {
    id: "memory",
    create: async ({ model, data }) => {
      const transformed = transformInput(data, model, "create");
      db[model].push(transformed);
      return transformOutput(transformed, model);
    },
    findOne: async ({ model, where, select }) => {
      const table = db[model];
      const res = convertWhereClause(where, table, model);
      const record = res[0] || null;
      return transformOutput(record, model, select);
    },
    findMany: async ({ model, where, sortBy, limit, offset }) => {
      let table = db[model];
      if (where) {
        table = convertWhereClause(where, table, model);
      }
      if (sortBy) {
        table = table.sort((a, b) => {
          const field = getField(model, sortBy.field);
          if (sortBy.direction === "asc") {
            return a[field] > b[field] ? 1 : -1;
          } else {
            return a[field] < b[field] ? 1 : -1;
          }
        });
      }
      if (offset !== void 0) {
        table = table.slice(offset);
      }
      if (limit !== void 0) {
        table = table.slice(0, limit);
      }
      return table.map((record) => transformOutput(record, model));
    },
    update: async ({ model, where, update }) => {
      const table = db[model];
      const res = convertWhereClause(where, table, model);
      res.forEach((record) => {
        Object.assign(record, transformInput(update, model, "update"));
      });
      return transformOutput(res[0], model);
    },
    count: async ({ model }) => {
      return db[model].length;
    },
    delete: async ({ model, where }) => {
      const table = db[model];
      const res = convertWhereClause(where, table, model);
      db[model] = table.filter((record) => !res.includes(record));
    },
    deleteMany: async ({ model, where }) => {
      const table = db[model];
      const res = convertWhereClause(where, table, model);
      let count = 0;
      db[model] = table.filter((record) => {
        if (res.includes(record)) {
          count++;
          return false;
        }
        return !res.includes(record);
      });
      return count;
    },
    updateMany(data) {
      const { model, where, update } = data;
      const table = db[model];
      const res = convertWhereClause(where, table, model);
      res.forEach((record) => {
        Object.assign(record, update);
      });
      return res[0] || null;
    }
  };
};

// src/db/utils.ts
async function getAdapter(options) {
  if (!options.database) {
    const tables = getAuthTables(options);
    const memoryDB = Object.keys(tables).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    logger.warn(
      "No database configuration provided. Using memory adapter in development"
    );
    return memoryAdapter(memoryDB)(options);
  }
  if (typeof options.database === "function") {
    return options.database(options);
  }
  const { kysely, databaseType } = await createKyselyAdapter(options);
  if (!kysely) {
    throw new BetterAuthError("Failed to initialize database adapter");
  }
  return kyselyAdapter(kysely, {
    type: databaseType || "sqlite"
  })(options);
}
function convertToDB(fields, values) {
  let result = values.id ? {
    id: values.id
  } : {};
  for (const key in fields) {
    const field = fields[key];
    const value = values[key];
    if (value === void 0) {
      continue;
    }
    result[field.fieldName || key] = value;
  }
  return result;
}
function convertFromDB(fields, values) {
  if (!values) {
    return null;
  }
  let result = {
    id: values.id
  };
  for (const [key, value] of Object.entries(fields)) {
    result[key] = values[value.fieldName || key];
  }
  return result;
}

// src/db/get-schema.ts
function getSchema(config) {
  const tables = getAuthTables(config);
  let schema = {};
  for (const key in tables) {
    const table = tables[key];
    const fields = table.fields;
    let actualFields = {};
    Object.entries(fields).forEach(([key2, field]) => {
      actualFields[field.fieldName || key2] = field;
      if (field.references) {
        const refTable = tables[field.references.model];
        if (refTable) {
          actualFields[field.fieldName || key2].references = {
            model: refTable.modelName,
            field: field.references.field
          };
        }
      }
    });
    if (schema[table.modelName]) {
      schema[table.modelName].fields = {
        ...schema[table.modelName].fields,
        ...actualFields
      };
      continue;
    }
    schema[table.modelName] = {
      fields: actualFields,
      order: table.order || Infinity
    };
  }
  return schema;
}

// src/db/get-migration.ts
var postgresMap = {
  string: ["character varying", "text"],
  number: [
    "int4",
    "integer",
    "bigint",
    "smallint",
    "numeric",
    "real",
    "double precision"
  ],
  boolean: ["bool", "boolean"],
  date: ["timestamp", "date"]
};
var mysqlMap = {
  string: ["varchar", "text"],
  number: [
    "integer",
    "int",
    "bigint",
    "smallint",
    "decimal",
    "float",
    "double"
  ],
  boolean: ["boolean", "tinyint"],
  date: ["timestamp", "datetime", "date"]
};
var sqliteMap = {
  string: ["TEXT"],
  number: ["INTEGER", "REAL"],
  boolean: ["INTEGER", "BOOLEAN"],
  // 0 or 1
  date: ["DATE", "INTEGER"]
};
var mssqlMap = {
  string: ["text", "varchar"],
  number: ["int", "bigint", "smallint", "decimal", "float", "double"],
  boolean: ["bit", "smallint"],
  date: ["datetime", "date"]
};
var map = {
  postgres: postgresMap,
  mysql: mysqlMap,
  sqlite: sqliteMap,
  mssql: mssqlMap
};
function matchType(columnDataType, fieldType, dbType) {
  if (fieldType === "string[]" || fieldType === "number[]") {
    return columnDataType.toLowerCase().includes("json");
  }
  const types = map[dbType];
  const type = Array.isArray(fieldType) ? types["string"].map((t) => t.toLowerCase()) : types[fieldType].map((t) => t.toLowerCase());
  const matches = type.includes(columnDataType.toLowerCase());
  return matches;
}
async function getMigrations(config) {
  const betterAuthSchema = getSchema(config);
  const logger2 = createLogger(config.logger);
  let { kysely: db, databaseType: dbType } = await createKyselyAdapter(config);
  if (!dbType) {
    logger2.warn(
      "Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this."
    );
    dbType = "sqlite";
  }
  if (!db) {
    logger2.error(
      "Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter."
    );
    process.exit(1);
  }
  const tableMetadata = await db.introspection.getTables();
  const toBeCreated = [];
  const toBeAdded = [];
  for (const [key, value] of Object.entries(betterAuthSchema)) {
    const table = tableMetadata.find((t) => t.name === key);
    if (!table) {
      const tIndex = toBeCreated.findIndex((t) => t.table === key);
      const tableData = {
        table: key,
        fields: value.fields,
        order: value.order || Infinity
      };
      const insertIndex = toBeCreated.findIndex(
        (t) => (t.order || Infinity) > tableData.order
      );
      if (insertIndex === -1) {
        if (tIndex === -1) {
          toBeCreated.push(tableData);
        } else {
          toBeCreated[tIndex].fields = {
            ...toBeCreated[tIndex].fields,
            ...value.fields
          };
        }
      } else {
        toBeCreated.splice(insertIndex, 0, tableData);
      }
      continue;
    }
    let toBeAddedFields = {};
    for (const [fieldName, field] of Object.entries(value.fields)) {
      const column = table.columns.find((c) => c.name === fieldName);
      if (!column) {
        toBeAddedFields[fieldName] = field;
        continue;
      }
      if (matchType(column.dataType, field.type, dbType)) {
        continue;
      } else {
        logger2.warn(
          `Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`
        );
      }
    }
    if (Object.keys(toBeAddedFields).length > 0) {
      toBeAdded.push({
        table: key,
        fields: toBeAddedFields,
        order: value.order || Infinity
      });
    }
  }
  const migrations = [];
  function getType(field) {
    const type = field.type;
    const typeMap = {
      string: {
        sqlite: "text",
        postgres: "text",
        mysql: field.unique ? "varchar(255)" : field.references ? "varchar(36)" : "text",
        mssql: field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : "text"
      },
      boolean: {
        sqlite: "integer",
        postgres: "boolean",
        mysql: "boolean",
        mssql: "smallint"
      },
      number: {
        sqlite: field.bigint ? "bigint" : "integer",
        postgres: field.bigint ? "bigint" : "integer",
        mysql: field.bigint ? "bigint" : "integer",
        mssql: field.bigint ? "bigint" : "integer"
      },
      date: {
        sqlite: "date",
        postgres: "timestamp",
        mysql: "datetime",
        mssql: "datetime"
      }
    };
    if (dbType === "sqlite" && (type === "string[]" || type === "number[]")) {
      return "text";
    }
    if (type === "string[]" || type === "number[]") {
      return "jsonb";
    }
    if (Array.isArray(type)) {
      return "text";
    }
    return typeMap[type][dbType || "sqlite"];
  }
  if (toBeAdded.length) {
    for (const table of toBeAdded) {
      for (const [fieldName, field] of Object.entries(table.fields)) {
        const type = getType(field);
        const exec = db.schema.alterTable(table.table).addColumn(fieldName, type, (col) => {
          col = field.required !== false ? col.notNull() : col;
          if (field.references) {
            col = col.references(
              `${field.references.model}.${field.references.field}`
            );
          }
          if (field.unique) {
            col = col.unique();
          }
          return col;
        });
        migrations.push(exec);
      }
    }
  }
  if (toBeCreated.length) {
    for (const table of toBeCreated) {
      let dbT = db.schema.createTable(table.table).addColumn(
        "id",
        dbType === "mysql" || dbType === "mssql" ? "varchar(36)" : "text",
        (col) => col.primaryKey().notNull()
      );
      for (const [fieldName, field] of Object.entries(table.fields)) {
        const type = getType(field);
        dbT = dbT.addColumn(fieldName, type, (col) => {
          col = field.required !== false ? col.notNull() : col;
          if (field.references) {
            col = col.references(
              `${field.references.model}.${field.references.field}`
            );
          }
          if (field.unique) {
            col = col.unique();
          }
          return col;
        });
      }
      migrations.push(dbT);
    }
  }
  async function runMigrations() {
    for (const migration of migrations) {
      await migration.execute();
    }
  }
  async function compileMigrations() {
    const compiled = migrations.map((m) => m.compile().sql);
    return compiled.join(";\n\n");
  }
  return { toBeCreated, toBeAdded, runMigrations, compileMigrations };
}

// src/adapters/kysely-adapter/kysely-adapter.ts
var createTransform2 = (db, options, config) => {
  const schema = getAuthTables(options);
  function getField(model, field) {
    if (field === "id") {
      return field;
    }
    const f = schema[model].fields[field];
    if (!f) {
      console.log("Field not found", model, field);
    }
    return f.fieldName || field;
  }
  function transformValueToDB(value, model, field) {
    const { type = "sqlite" } = config || {};
    const f = schema[model].fields[field];
    if (f.type === "boolean" && (type === "sqlite" || type === "mssql") && value !== null && value !== void 0) {
      return value ? 1 : 0;
    }
    if (f.type === "date" && value && value instanceof Date) {
      return type === "sqlite" ? value.toISOString() : value;
    }
    return value;
  }
  function transformValueFromDB(value, model, field) {
    const { type = "sqlite" } = config || {};
    const f = schema[model].fields[field];
    if (f.type === "boolean" && (type === "sqlite" || type === "mssql") && value !== null) {
      return value === 1;
    }
    if (f.type === "date" && value) {
      return new Date(value);
    }
    return value;
  }
  function getModelName(model) {
    return schema[model].modelName;
  }
  const useDatabaseGeneratedId = options?.advanced?.generateId === false;
  return {
    transformInput(data, model, action) {
      const transformedData = useDatabaseGeneratedId || action === "update" ? {} : {
        id: options.advanced?.generateId ? options.advanced.generateId({
          model
        }) : data.id || generateId()
      };
      const fields = schema[model].fields;
      for (const field in fields) {
        const value = data[field];
        transformedData[fields[field].fieldName || field] = withApplyDefault(
          transformValueToDB(value, model, field),
          fields[field],
          action
        );
      }
      return transformedData;
    },
    transformOutput(data, model, select = []) {
      if (!data) return null;
      const transformedData = data.id ? select.length === 0 || select.includes("id") ? {
        id: data.id
      } : {} : {};
      const tableSchema = schema[model].fields;
      for (const key in tableSchema) {
        if (select.length && !select.includes(key)) {
          continue;
        }
        const field = tableSchema[key];
        if (field) {
          transformedData[key] = transformValueFromDB(
            data[field.fieldName || key],
            model,
            key
          );
        }
      }
      return transformedData;
    },
    convertWhereClause(model, w) {
      if (!w)
        return {
          and: null,
          or: null
        };
      const conditions = {
        and: [],
        or: []
      };
      w.forEach((condition) => {
        const {
          field: _field,
          value,
          operator = "=",
          connector = "AND"
        } = condition;
        const field = getField(model, _field);
        const expr = (eb) => {
          if (operator.toLowerCase() === "in") {
            return eb(field, "in", Array.isArray(value) ? value : [value]);
          }
          if (operator === "contains") {
            return eb(field, "like", `%${value}%`);
          }
          if (operator === "starts_with") {
            return eb(field, "like", `${value}%`);
          }
          if (operator === "ends_with") {
            return eb(field, "like", `%${value}`);
          }
          if (operator === "eq") {
            return eb(field, "=", value);
          }
          if (operator === "ne") {
            return eb(field, "<>", value);
          }
          if (operator === "gt") {
            return eb(field, ">", value);
          }
          if (operator === "gte") {
            return eb(field, ">=", value);
          }
          if (operator === "lt") {
            return eb(field, "<", value);
          }
          if (operator === "lte") {
            return eb(field, "<=", value);
          }
          return eb(field, operator, value);
        };
        if (connector === "OR") {
          conditions.or.push(expr);
        } else {
          conditions.and.push(expr);
        }
      });
      return {
        and: conditions.and.length ? conditions.and : null,
        or: conditions.or.length ? conditions.or : null
      };
    },
    async withReturning(values, builder, model, where) {
      let res;
      if (config?.type === "mysql") {
        await builder.execute();
        const field = values.id ? "id" : where[0].field ? where[0].field : "id";
        const value = values[field] || where[0].value;
        res = await db.selectFrom(getModelName(model)).selectAll().where(getField(model, field), "=", value).executeTakeFirst();
        return res;
      }
      if (config?.type === "mssql") {
        res = await builder.outputAll("inserted").executeTakeFirst();
        return res;
      }
      res = await builder.returningAll().executeTakeFirst();
      return res;
    },
    getModelName,
    getField
  };
};
var kyselyAdapter = (db, config) => (opts) => {
  const {
    transformInput,
    withReturning,
    transformOutput,
    convertWhereClause,
    getModelName,
    getField
  } = createTransform2(db, opts, config);
  return {
    id: "kysely",
    async create(data) {
      const { model, data: values, select } = data;
      const transformed = transformInput(values, model, "create");
      const builder = db.insertInto(getModelName(model)).values(transformed);
      return transformOutput(
        await withReturning(transformed, builder, model, []),
        model,
        select
      );
    },
    async findOne(data) {
      const { model, where, select } = data;
      const { and, or } = convertWhereClause(model, where);
      let query = db.selectFrom(getModelName(model)).selectAll();
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      const res = await query.executeTakeFirst();
      if (!res) return null;
      return transformOutput(res, model, select);
    },
    async findMany(data) {
      const { model, where, limit, offset, sortBy } = data;
      const { and, or } = convertWhereClause(model, where);
      let query = db.selectFrom(getModelName(model));
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      if (config?.type === "mssql") {
        if (!offset) {
          query = query.top(limit || 100);
        }
      } else {
        query = query.limit(limit || 100);
      }
      if (sortBy) {
        query = query.orderBy(
          getField(model, sortBy.field),
          sortBy.direction
        );
      }
      if (offset) {
        if (config?.type === "mssql") {
          if (!sortBy) {
            query = query.orderBy(getField(model, "id"));
          }
          query = query.offset(offset).fetch(limit || 100);
        } else {
          query = query.offset(offset);
        }
      }
      const res = await query.selectAll().execute();
      if (!res) return [];
      return res.map((r) => transformOutput(r, model));
    },
    async update(data) {
      const { model, where, update: values } = data;
      const { and, or } = convertWhereClause(model, where);
      const transformedData = transformInput(values, model, "update");
      let query = db.updateTable(getModelName(model)).set(transformedData);
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      const res = await transformOutput(
        await withReturning(transformedData, query, model, where),
        model
      );
      return res;
    },
    async updateMany(data) {
      const { model, where, update: values } = data;
      const { and, or } = convertWhereClause(model, where);
      const transformedData = transformInput(values, model, "update");
      let query = db.updateTable(getModelName(model)).set(transformedData);
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      const res = await query.execute();
      return res.length;
    },
    async count(data) {
      const { model, where } = data;
      const { and, or } = convertWhereClause(model, where);
      let query = db.selectFrom(getModelName(model)).selectAll();
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      const res = await query.execute();
      return res.length;
    },
    async delete(data) {
      const { model, where } = data;
      const { and, or } = convertWhereClause(model, where);
      let query = db.deleteFrom(getModelName(model));
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      await query.execute();
    },
    async deleteMany(data) {
      const { model, where } = data;
      const { and, or } = convertWhereClause(model, where);
      let query = db.deleteFrom(getModelName(model));
      if (and) {
        query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
      }
      if (or) {
        query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
      }
      return (await query.execute()).length;
    },
    options: config
  };
};

export { convertFromDB, convertToDB, createFieldAttribute, createInternalAdapter, createKyselyAdapter, getAdapter, getAuthTables, getMigrations, getSchema, getWithHooks, kyselyAdapter, matchType, memoryAdapter, toZodSchema, withApplyDefault };
