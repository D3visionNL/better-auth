import { checkPassword } from './chunk-TOKZL3ZI.js';
import { getEndpoints, router, BASE_ERROR_CODES } from './chunk-P6JGS32U.js';
import { socialProviders } from './chunk-PQWBVZN5.js';
import './chunk-M2JCNZEP.js';
import { getBaseURL } from './chunk-XFCIANZX.js';
import { getCookies, createCookieGetter } from './chunk-IWEXZ2ES.js';
export { createCookieGetter, deleteSessionCookie, getCookies, parseCookies, parseSetCookieHeader, setCookieCache, setSessionCookie } from './chunk-IWEXZ2ES.js';
import { getAdapter, getAuthTables, createInternalAdapter } from './chunk-ZWDZCJSN.js';
import './chunk-MEZ6VLJL.js';
import { createLogger, generateId } from './chunk-KLDFBLYL.js';
export { HIDE_METADATA, createLogger, generateId, levels, logger, shouldPublishLog } from './chunk-KLDFBLYL.js';
export { generateState, parseState } from './chunk-NPO64SVN.js';
import './chunk-SK6Y2YH6.js';
export { capitalizeFirstLetter } from './chunk-3XTQSPPA.js';
import { hashPassword, verifyPassword } from './chunk-DBPOZRMS.js';
import './chunk-FURNA6HY.js';
import { env, isProduction } from './chunk-TQQSPPNA.js';
export { BetterAuthError, MissingDependencyError } from './chunk-UNWCXKMP.js';
import { defu } from 'defu';

// src/utils/constants.ts
var DEFAULT_SECRET = "better-auth-secret-123456789";

// src/init.ts
var init = async (options) => {
  const adapter = await getAdapter(options);
  const plugins = options.plugins || [];
  const internalPlugins = getInternalPlugins(options);
  const logger2 = createLogger(options.logger);
  const baseURL = getBaseURL(options.baseURL, options.basePath);
  const secret = options.secret || env.BETTER_AUTH_SECRET || env.AUTH_SECRET || DEFAULT_SECRET;
  if (secret === DEFAULT_SECRET) {
    if (isProduction) {
      logger2.error(
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
    if (value.enabled === false) {
      return null;
    }
    if (!value.clientId) {
      logger2.warn(
        `Social provider ${key} is missing clientId or clientSecret`
      );
    }
    return socialProviders[key](
      value
      // TODO: fix this
    );
  }).filter((x) => x !== null);
  const generateIdFunc = ({ model, size }) => {
    if (typeof options?.advanced?.generateId === "function") {
      return options.advanced.generateId({ model, size });
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
    logger: logger2,
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
      hooks: options.databaseHooks ? [options.databaseHooks] : [],
      generateId: generateIdFunc
    }),
    createAuthCookie: createCookieGetter(options)
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
      const result = plugin.init(ctx);
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
  if (options.trustedOrigins) {
    trustedOrigins.push(...options.trustedOrigins);
  }
  const envTrustedOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (envTrustedOrigins) {
    trustedOrigins.push(...envTrustedOrigins.split(","));
  }
  return trustedOrigins;
}

// src/auth.ts
var betterAuth = (options) => {
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
      const url = new URL(request.url);
      if (!ctx.options.baseURL) {
        const baseURL = getBaseURL(void 0, basePath) || `${url.origin}${basePath}`;
        ctx.options.baseURL = baseURL;
        ctx.baseURL = baseURL;
      }
      ctx.trustedOrigins = [
        ...options.trustedOrigins || [],
        ctx.baseURL,
        url.origin
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

export { betterAuth };
