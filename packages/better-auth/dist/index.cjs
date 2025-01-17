'use strict';

var chunkEHFDU6IF_cjs = require('./chunk-EHFDU6IF.cjs');
var chunkVADINYB6_cjs = require('./chunk-VADINYB6.cjs');
var chunk2OGHGURS_cjs = require('./chunk-2OGHGURS.cjs');
require('./chunk-H2JFIDVT.cjs');
var chunkS5UORXJH_cjs = require('./chunk-S5UORXJH.cjs');
var chunkOJX3P352_cjs = require('./chunk-OJX3P352.cjs');
var chunkP65Q6LR5_cjs = require('./chunk-P65Q6LR5.cjs');
require('./chunk-WRPAFI4I.cjs');
var chunkH74YRRNV_cjs = require('./chunk-H74YRRNV.cjs');
var chunkLB4ZM24Q_cjs = require('./chunk-LB4ZM24Q.cjs');
require('./chunk-NIMYOIVU.cjs');
var chunkCCKQSGIR_cjs = require('./chunk-CCKQSGIR.cjs');
var chunkXJGHQ3F6_cjs = require('./chunk-XJGHQ3F6.cjs');
require('./chunk-2HPSCSV7.cjs');
var chunkVXYIYABQ_cjs = require('./chunk-VXYIYABQ.cjs');
var chunkPEZRSDZS_cjs = require('./chunk-PEZRSDZS.cjs');
var defu = require('defu');

// src/utils/constants.ts
var DEFAULT_SECRET = "better-auth-secret-123456789";

// src/init.ts
var init = async (options) => {
  const adapter = await chunkP65Q6LR5_cjs.getAdapter(options);
  const plugins = options.plugins || [];
  const internalPlugins = getInternalPlugins(options);
  const logger2 = chunkH74YRRNV_cjs.createLogger(options.logger);
  const baseURL = chunkS5UORXJH_cjs.getBaseURL(options.baseURL, options.basePath);
  const secret = options.secret || chunkVXYIYABQ_cjs.env.BETTER_AUTH_SECRET || chunkVXYIYABQ_cjs.env.AUTH_SECRET || DEFAULT_SECRET;
  if (secret === DEFAULT_SECRET) {
    if (chunkVXYIYABQ_cjs.isProduction) {
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
    plugins: plugins.concat(internalPlugins),
    emailAndPassword: {
      ...options.emailAndPassword,
      enabled: options.emailAndPassword?.enabled ?? false,
      autoSignIn: options.emailAndPassword?.autoSignIn ?? true
    }
  };
  const cookies = chunkOJX3P352_cjs.getCookies(options);
  const tables = chunkP65Q6LR5_cjs.getAuthTables(options);
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
    return chunk2OGHGURS_cjs.socialProviders[key](
      value
      // TODO: fix this
    );
  }).filter((x) => x !== null);
  const generateIdFunc = ({ model, size }) => {
    if (typeof options?.advanced?.generateId === "function") {
      return options.advanced.generateId({ model, size });
    }
    return chunkH74YRRNV_cjs.generateId(size);
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
      enabled: options.rateLimit?.enabled ?? chunkVXYIYABQ_cjs.isProduction,
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
      hash: options.emailAndPassword?.password?.hash || chunkXJGHQ3F6_cjs.hashPassword,
      verify: options.emailAndPassword?.password?.verify || chunkXJGHQ3F6_cjs.verifyPassword,
      config: {
        minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
        maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
      },
      checkPassword: chunkEHFDU6IF_cjs.checkPassword
    },
    setNewSession(session) {
      this.newSession = session;
    },
    newSession: null,
    adapter,
    internalAdapter: chunkP65Q6LR5_cjs.createInternalAdapter(adapter, {
      options,
      hooks: options.databaseHooks ? [options.databaseHooks] : [],
      generateId: generateIdFunc
    }),
    createAuthCookie: chunkOJX3P352_cjs.createCookieGetter(options)
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
          if (result.options.databaseHooks) {
            dbHooks.push(result.options.databaseHooks);
          }
          options = defu.defu(options, result.options);
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
  context.internalAdapter = chunkP65Q6LR5_cjs.createInternalAdapter(ctx.adapter, {
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
  const baseURL = chunkS5UORXJH_cjs.getBaseURL(options.baseURL, options.basePath);
  if (!baseURL) {
    return [];
  }
  const trustedOrigins = [new URL(baseURL).origin];
  if (options.trustedOrigins) {
    trustedOrigins.push(...options.trustedOrigins);
  }
  const envTrustedOrigins = chunkVXYIYABQ_cjs.env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (envTrustedOrigins) {
    trustedOrigins.push(...envTrustedOrigins.split(","));
  }
  return trustedOrigins;
}

// src/auth.ts
var betterAuth = (options) => {
  const authContext = init(options);
  const { api } = chunkVADINYB6_cjs.getEndpoints(authContext, options);
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
        const baseURL = chunkS5UORXJH_cjs.getBaseURL(void 0, basePath) || `${url.origin}${basePath}`;
        ctx.options.baseURL = baseURL;
        ctx.baseURL = baseURL;
      }
      ctx.trustedOrigins = [
        ...options.trustedOrigins || [],
        ctx.baseURL,
        url.origin
      ];
      const { handler } = chunkVADINYB6_cjs.router(ctx, options);
      return handler(request);
    },
    api,
    options,
    $context: authContext,
    $Infer: {},
    $ERROR_CODES: {
      ...errorCodes,
      ...chunkVADINYB6_cjs.BASE_ERROR_CODES
    }
  };
};

Object.defineProperty(exports, "createCookieGetter", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.createCookieGetter; }
});
Object.defineProperty(exports, "deleteSessionCookie", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.deleteSessionCookie; }
});
Object.defineProperty(exports, "getCookies", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.getCookies; }
});
Object.defineProperty(exports, "parseCookies", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.parseCookies; }
});
Object.defineProperty(exports, "parseSetCookieHeader", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.parseSetCookieHeader; }
});
Object.defineProperty(exports, "setCookieCache", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.setCookieCache; }
});
Object.defineProperty(exports, "setSessionCookie", {
  enumerable: true,
  get: function () { return chunkOJX3P352_cjs.setSessionCookie; }
});
Object.defineProperty(exports, "HIDE_METADATA", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.HIDE_METADATA; }
});
Object.defineProperty(exports, "createLogger", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.createLogger; }
});
Object.defineProperty(exports, "generateId", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.generateId; }
});
Object.defineProperty(exports, "levels", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.levels; }
});
Object.defineProperty(exports, "logger", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.logger; }
});
Object.defineProperty(exports, "shouldPublishLog", {
  enumerable: true,
  get: function () { return chunkH74YRRNV_cjs.shouldPublishLog; }
});
Object.defineProperty(exports, "generateState", {
  enumerable: true,
  get: function () { return chunkLB4ZM24Q_cjs.generateState; }
});
Object.defineProperty(exports, "parseState", {
  enumerable: true,
  get: function () { return chunkLB4ZM24Q_cjs.parseState; }
});
Object.defineProperty(exports, "capitalizeFirstLetter", {
  enumerable: true,
  get: function () { return chunkCCKQSGIR_cjs.capitalizeFirstLetter; }
});
Object.defineProperty(exports, "BetterAuthError", {
  enumerable: true,
  get: function () { return chunkPEZRSDZS_cjs.BetterAuthError; }
});
Object.defineProperty(exports, "MissingDependencyError", {
  enumerable: true,
  get: function () { return chunkPEZRSDZS_cjs.MissingDependencyError; }
});
exports.betterAuth = betterAuth;
