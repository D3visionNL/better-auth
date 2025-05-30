import { getEndpoints, router } from './api/index.mjs';
import { defu } from 'defu';
import { v as verifyPassword, h as hashPassword } from './shared/better-auth.OT3XFeFk.mjs';
import { a as getAdapter, c as createInternalAdapter, e as getMigrations } from './shared/better-auth.DCB35LVD.mjs';
import { g as getAuthTables } from './shared/better-auth.DORkW_Ge.mjs';
import 'zod';
import './shared/better-auth.Cc72UxUH.mjs';
import { getCookies, createCookieGetter } from './cookies/index.mjs';
import { c as createLogger } from './shared/better-auth.Cqykj82J.mjs';
export { a as levels, l as logger, s as shouldPublishLog } from './shared/better-auth.Cqykj82J.mjs';
import { socialProviders } from './social-providers/index.mjs';
import { g as generateId } from './shared/better-auth.BUPPRXfK.mjs';
import 'better-call';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha';
import '@noble/ciphers/utils';
import '@noble/ciphers/webcrypto';
import '@better-auth/utils/base64';
import 'jose';
import './shared/better-auth.B4Qoxdgc.mjs';
import { e as env, a as isProduction } from './shared/better-auth.8zoxzg-F.mjs';
import { c as checkPassword } from './shared/better-auth.YwDQhoPc.mjs';
import { a as getBaseURL, g as getOrigin } from './shared/better-auth.VTXNLFMT.mjs';
import { B as BetterAuthError } from './shared/better-auth.DdzSJf-n.mjs';
export { M as MissingDependencyError } from './shared/better-auth.DdzSJf-n.mjs';
import { B as BASE_ERROR_CODES } from './shared/better-auth.c4QO78Xh.mjs';
export { H as HIDE_METADATA } from './shared/better-auth.c4QO78Xh.mjs';
export { c as capitalizeFirstLetter } from './shared/better-auth.D-2CmEwz.mjs';
export { g as generateState, p as parseState } from './shared/better-auth.dn8_oqOu.mjs';
import './shared/better-auth.iKoUsdFE.mjs';
import '@noble/hashes/scrypt';
import '@better-auth/utils';
import '@better-auth/utils/hex';
import '@noble/hashes/utils';
import './shared/better-auth.CW6D9eSx.mjs';
import './shared/better-auth.tB5eU6EY.mjs';
import '@better-auth/utils/random';
import './shared/better-auth.B-orlLFy.mjs';
import 'kysely';
import './shared/better-auth.Dpv9J4ny.mjs';
import './shared/better-auth.0TC26uRi.mjs';
import './shared/better-auth.Bdaq9Lqn.mjs';
import '@better-auth/utils/hmac';
import '@better-fetch/fetch';
import './shared/better-auth.DufyW0qf.mjs';
import './shared/better-auth.DDEbWX-S.mjs';
import 'jose/errors';
import '@better-auth/utils/binary';

const DEFAULT_SECRET = "better-auth-secret-123456789";

const init = async (options) => {
  const adapter = await getAdapter(options);
  const plugins = options.plugins || [];
  const internalPlugins = getInternalPlugins(options);
  const logger = createLogger(options.logger);
  const baseURL = getBaseURL(options.baseURL, options.basePath);
  const secret = options.secret || env.BETTER_AUTH_SECRET || env.AUTH_SECRET || DEFAULT_SECRET;
  if (secret === DEFAULT_SECRET) {
    if (isProduction) {
      logger.error(
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
  const cookies = getCookies(options);
  const tables = getAuthTables(options);
  const providers = Object.keys(options.socialProviders || {}).map((key) => {
    const value = options.socialProviders?.[key];
    if (!value || value.enabled === false) {
      return null;
    }
    if (!value.clientId) {
      logger.warn(
        `Social provider ${key} is missing clientId or clientSecret`
      );
    }
    const provider = socialProviders[key](
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
    return generateId(size);
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
      enabled: options.rateLimit?.enabled ?? isProduction,
      window: options.rateLimit?.window || 10,
      max: options.rateLimit?.max || 100,
      storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
    },
    authCookies: cookies,
    logger,
    generateId: generateIdFunc,
    session: null,
    secondaryStorage: options.secondaryStorage,
    password: {
      hash: options.emailAndPassword?.password?.hash || hashPassword,
      verify: options.emailAndPassword?.password?.verify || verifyPassword,
      config: {
        minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
        maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
      },
      checkPassword
    },
    setNewSession(session) {
      this.newSession = session;
    },
    newSession: null,
    adapter,
    internalAdapter: createInternalAdapter(adapter, {
      options,
      hooks: options.databaseHooks ? [options.databaseHooks] : []}),
    createAuthCookie: createCookieGetter(options),
    async runMigrations() {
      if (!options.database || "updateMany" in options.database) {
        throw new BetterAuthError(
          "Database is not provided or it's an adapter. Migrations are only supported with a database instance."
        );
      }
      const { runMigrations } = await getMigrations(options);
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
          options = defu(options, restOpts);
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
  context.internalAdapter = createInternalAdapter(ctx.adapter, {
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
  const baseURL = getBaseURL(options.baseURL, options.basePath);
  if (!baseURL) {
    return [];
  }
  const trustedOrigins = [new URL(baseURL).origin];
  if (options.trustedOrigins && Array.isArray(options.trustedOrigins)) {
    trustedOrigins.push(...options.trustedOrigins);
  }
  const envTrustedOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (envTrustedOrigins) {
    trustedOrigins.push(...envTrustedOrigins.split(","));
  }
  if (trustedOrigins.filter((x) => !x).length) {
    throw new BetterAuthError(
      "A provided trusted origin is invalid, make sure your trusted origins list is properly defined."
    );
  }
  return trustedOrigins;
}

const betterAuth = (options) => {
  const authContext = init(options);
  const { api } = getEndpoints(authContext, options);
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
        const baseURL = getBaseURL(void 0, basePath, request);
        if (baseURL) {
          ctx.baseURL = baseURL;
          ctx.options.baseURL = getOrigin(ctx.baseURL) || void 0;
        } else {
          throw new BetterAuthError(
            "Could not get base URL from request. Please provide a valid base URL."
          );
        }
      }
      ctx.trustedOrigins = [
        ...options.trustedOrigins ? Array.isArray(options.trustedOrigins) ? options.trustedOrigins : await options.trustedOrigins(request) : [],
        ctx.options.baseURL
      ];
      const { handler } = router(ctx, options);
      return handler(request);
    },
    api,
    options,
    $context: authContext,
    $Infer: {},
    $ERROR_CODES: {
      ...errorCodes,
      ...BASE_ERROR_CODES
    }
  };
};

export { BetterAuthError, betterAuth, createLogger, generateId };
