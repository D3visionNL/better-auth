'use strict';

const api_index = require('./api/index.cjs');
const defu = require('defu');
const password = require('./shared/better-auth.YUF6P-PB.cjs');
const getMigration = require('./shared/better-auth.BnnLmpgJ.cjs');
const getTables = require('./shared/better-auth.BEphVDyL.cjs');
require('zod');
require('./shared/better-auth.DcWKCjjf.cjs');
const cookies_index = require('./cookies/index.cjs');
const logger = require('./shared/better-auth.GpOOav9x.cjs');
const socialProviders_index = require('./social-providers/index.cjs');
const id = require('./shared/better-auth.Bg6iw3ig.cjs');
require('better-call');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha');
require('@noble/ciphers/utils');
require('@noble/ciphers/webcrypto');
require('@better-auth/utils/base64');
require('jose');
require('./shared/better-auth.CYeOI8C-.cjs');
const env = require('./shared/better-auth.DiSjtgs9.cjs');
const password$1 = require('./shared/better-auth.CDXNofOe.cjs');
const url = require('./shared/better-auth.C-R0J0n1.cjs');
const index = require('./shared/better-auth.ANpbi45u.cjs');
const account = require('./shared/better-auth.iyK63nvn.cjs');
const misc = require('./shared/better-auth.BLDOwz3i.cjs');
const state = require('./shared/better-auth.CWJ7qc0w.cjs');
require('./shared/better-auth.B7cZ2juS.cjs');
require('@noble/hashes/scrypt');
require('@better-auth/utils');
require('@better-auth/utils/hex');
require('@noble/hashes/utils');
require('./shared/better-auth.C1hdVENX.cjs');
require('./shared/better-auth.D3mtHEZg.cjs');
require('@better-auth/utils/random');
require('./shared/better-auth.xK-w0Rah.cjs');
require('kysely');
require('./shared/better-auth.Be27qhjB.cjs');
require('./shared/better-auth.CUdxApHl.cjs');
require('./shared/better-auth.CPnVs39B.cjs');
require('@better-auth/utils/hmac');
require('@better-fetch/fetch');
require('./shared/better-auth.6XyKj7DG.cjs');
require('./shared/better-auth.BMYo0QR-.cjs');
require('jose/errors');
require('@better-auth/utils/binary');

const DEFAULT_SECRET = "better-auth-secret-123456789";

const init = async (options) => {
  const adapter = await getMigration.getAdapter(options);
  const plugins = options.plugins || [];
  const internalPlugins = getInternalPlugins(options);
  const logger$1 = logger.createLogger(options.logger);
  const baseURL = url.getBaseURL(options.baseURL, options.basePath);
  const secret = options.secret || env.env.BETTER_AUTH_SECRET || env.env.AUTH_SECRET || DEFAULT_SECRET;
  if (secret === DEFAULT_SECRET) {
    if (env.isProduction) {
      logger$1.error(
        "You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config."
      );
    }
  }
  options = {
    ...options,
    secret,
    baseURL: baseURL ? new URL(baseURL).origin : "",
    basePath: options.basePath || "/api/auth",
    plugins: plugins.concat(internalPlugins)
  };
  const cookies = cookies_index.getCookies(options);
  const tables = getTables.getAuthTables(options);
  const providers = Object.keys(options.socialProviders || {}).map((key) => {
    const value = options.socialProviders?.[key];
    if (!value || value.enabled === false) {
      return null;
    }
    if (!value.clientId) {
      logger$1.warn(
        `Social provider ${key} is missing clientId or clientSecret`
      );
    }
    const provider = socialProviders_index.socialProviders[key](
      value
      // TODO: fix this
    );
    provider.disableImplicitSignUp = value.disableImplicitSignUp;
    return provider;
  }).filter((x) => x !== null);
  const generateIdFunc = ({ model, size }) => {
    if (typeof options.advanced?.generateId === "function") {
      return options.advanced.generateId({ model, size });
    }
    if (typeof options?.advanced?.database?.generateId === "function") {
      return options.advanced.database.generateId({ model, size });
    }
    return id.generateId(size);
  };
  const ctx = {
    appName: options.appName || "Better Auth",
    socialProviders: providers,
    options,
    tables,
    trustedOrigins: getTrustedOrigins(options),
    baseURL: baseURL || "",
    sessionConfig: {
      updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 24 * 60 * 60,
      // 24 hours
      expiresIn: options.session?.expiresIn || 60 * 60 * 24 * 7,
      // 7 days
      freshAge: options.session?.freshAge === void 0 ? 60 * 60 * 24 : options.session.freshAge
    },
    secret,
    rateLimit: {
      ...options.rateLimit,
      enabled: options.rateLimit?.enabled ?? env.isProduction,
      window: options.rateLimit?.window || 10,
      max: options.rateLimit?.max || 100,
      storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
    },
    authCookies: cookies,
    logger: logger$1,
    generateId: generateIdFunc,
    session: null,
    secondaryStorage: options.secondaryStorage,
    password: {
      hash: options.emailAndPassword?.password?.hash || password.hashPassword,
      verify: options.emailAndPassword?.password?.verify || password.verifyPassword,
      config: {
        minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
        maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
      },
      checkPassword: password$1.checkPassword
    },
    setNewSession(session) {
      this.newSession = session;
    },
    newSession: null,
    adapter,
    internalAdapter: getMigration.createInternalAdapter(adapter, {
      options,
      hooks: options.databaseHooks ? [options.databaseHooks] : []}),
    createAuthCookie: cookies_index.createCookieGetter(options),
    async runMigrations() {
      if (!options.database || "updateMany" in options.database) {
        throw new index.BetterAuthError(
          "Database is not provided or it's an adapter. Migrations are only supported with a database instance."
        );
      }
      const { runMigrations } = await getMigration.getMigrations(options);
      await runMigrations();
    }
  };
  let { context } = runPluginInit(ctx);
  return context;
};
function runPluginInit(ctx) {
  let options = ctx.options;
  const plugins = options.plugins || [];
  let context = ctx;
  const dbHooks = [];
  for (const plugin of plugins) {
    if (plugin.init) {
      const result = plugin.init(context);
      if (typeof result === "object") {
        if (result.options) {
          const { databaseHooks, ...restOpts } = result.options;
          if (databaseHooks) {
            dbHooks.push(databaseHooks);
          }
          options = defu.defu(options, restOpts);
        }
        if (result.context) {
          context = {
            ...context,
            ...result.context
          };
        }
      }
    }
  }
  dbHooks.push(options.databaseHooks);
  context.internalAdapter = getMigration.createInternalAdapter(ctx.adapter, {
    options,
    hooks: dbHooks.filter((u) => u !== void 0),
    generateId: ctx.generateId
  });
  context.options = options;
  return { context };
}
function getInternalPlugins(options) {
  const plugins = [];
  if (options.advanced?.crossSubDomainCookies?.enabled) ;
  return plugins;
}
function getTrustedOrigins(options) {
  const baseURL = url.getBaseURL(options.baseURL, options.basePath);
  if (!baseURL) {
    return [];
  }
  const trustedOrigins = [new URL(baseURL).origin];
  if (options.trustedOrigins && Array.isArray(options.trustedOrigins)) {
    trustedOrigins.push(...options.trustedOrigins);
  }
  const envTrustedOrigins = env.env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (envTrustedOrigins) {
    trustedOrigins.push(...envTrustedOrigins.split(","));
  }
  if (trustedOrigins.filter((x) => !x).length) {
    throw new index.BetterAuthError(
      "A provided trusted origin is invalid, make sure your trusted origins list is properly defined."
    );
  }
  return trustedOrigins;
}

const betterAuth = (options) => {
  const authContext = init(options);
  const { api } = api_index.getEndpoints(authContext, options);
  const errorCodes = options.plugins?.reduce((acc, plugin) => {
    if (plugin.$ERROR_CODES) {
      return {
        ...acc,
        ...plugin.$ERROR_CODES
      };
    }
    return acc;
  }, {});
  return {
    handler: async (request) => {
      const ctx = await authContext;
      const basePath = ctx.options.basePath || "/api/auth";
      if (!ctx.options.baseURL) {
        const baseURL = url.getBaseURL(void 0, basePath, request);
        if (baseURL) {
          ctx.baseURL = baseURL;
          ctx.options.baseURL = url.getOrigin(ctx.baseURL) || void 0;
        } else {
          throw new index.BetterAuthError(
            "Could not get base URL from request. Please provide a valid base URL."
          );
        }
      }
      ctx.trustedOrigins = [
        ...options.trustedOrigins ? Array.isArray(options.trustedOrigins) ? options.trustedOrigins : await options.trustedOrigins(request) : [],
        ctx.options.baseURL
      ];
      const { handler } = api_index.router(ctx, options);
      return handler(request);
    },
    api,
    options,
    $context: authContext,
    $Infer: {},
    $ERROR_CODES: {
      ...errorCodes,
      ...account.BASE_ERROR_CODES
    }
  };
};

exports.createLogger = logger.createLogger;
exports.levels = logger.levels;
exports.logger = logger.logger;
exports.shouldPublishLog = logger.shouldPublishLog;
exports.generateId = id.generateId;
exports.BetterAuthError = index.BetterAuthError;
exports.MissingDependencyError = index.MissingDependencyError;
exports.HIDE_METADATA = account.HIDE_METADATA;
exports.capitalizeFirstLetter = misc.capitalizeFirstLetter;
exports.generateState = state.generateState;
exports.parseState = state.parseState;
exports.betterAuth = betterAuth;
