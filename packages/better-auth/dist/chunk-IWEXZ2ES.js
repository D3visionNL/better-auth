import { getDate } from './chunk-FURNA6HY.js';
import { isProduction } from './chunk-TQQSPPNA.js';
import { BetterAuthError } from './chunk-UNWCXKMP.js';
import { base64Url } from '@better-auth/utils/base64';
import { createHMAC } from '@better-auth/utils/hmac';

// src/utils/time.ts
var createTime = (value, format) => {
  const toMilliseconds = () => {
    switch (format) {
      case "ms":
        return value;
      case "s":
        return value * 1e3;
      case "m":
        return value * 1e3 * 60;
      case "h":
        return value * 1e3 * 60 * 60;
      case "d":
        return value * 1e3 * 60 * 60 * 24;
      case "w":
        return value * 1e3 * 60 * 60 * 24 * 7;
      case "y":
        return value * 1e3 * 60 * 60 * 24 * 365;
    }
  };
  const time = {
    t: `${value}${format}`,
    value,
    tFormat: format,
    toMilliseconds,
    toSeconds: () => time.toMilliseconds() / 1e3,
    toMinutes: () => time.toSeconds() / 60,
    toHours: () => time.toMinutes() / 60,
    toDays: () => time.toHours() / 24,
    toWeeks: () => time.toDays() / 7,
    toYears: () => time.toDays() / 365,
    getDate: () => new Date(Date.now() + time.toMilliseconds()),
    add: (other) => {
      const otherMs = typeof other === "string" ? parseTime(other).toMilliseconds() : other.toMilliseconds();
      return createTime(time.toMilliseconds() + otherMs, "ms");
    },
    subtract: (other) => {
      const otherMs = typeof other === "string" ? parseTime(other).toMilliseconds() : other.toMilliseconds();
      return createTime(time.toMilliseconds() - otherMs, "ms");
    },
    multiply: (factor) => createTime(time.toMilliseconds() * factor, "ms"),
    divide: (divisor) => createTime(time.toMilliseconds() / divisor, "ms"),
    equals: (other) => {
      const otherMs = typeof other === "string" ? parseTime(other).toMilliseconds() : other.toMilliseconds();
      return time.toMilliseconds() === otherMs;
    },
    lessThan: (other) => {
      const otherMs = typeof other === "string" ? parseTime(other).toMilliseconds() : other.toMilliseconds();
      return time.toMilliseconds() < otherMs;
    },
    greaterThan: (other) => {
      const otherMs = typeof other === "string" ? parseTime(other).toMilliseconds() : other.toMilliseconds();
      return time.toMilliseconds() > otherMs;
    },
    format: (pattern) => {
      const date = time.getDate();
      return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => {
        switch (match) {
          case "YYYY":
            return date.getFullYear().toString();
          case "MM":
            return (date.getMonth() + 1).toString().padStart(2, "0");
          case "DD":
            return date.getDate().toString().padStart(2, "0");
          case "HH":
            return date.getHours().toString().padStart(2, "0");
          case "mm":
            return date.getMinutes().toString().padStart(2, "0");
          case "ss":
            return date.getSeconds().toString().padStart(2, "0");
          default:
            return match;
        }
      });
    },
    fromNow: () => {
      const ms = time.toMilliseconds();
      if (ms < 0) return time.ago();
      if (ms < 1e3) return "in a few seconds";
      if (ms < 6e4) return `in ${Math.round(ms / 1e3)} seconds`;
      if (ms < 36e5) return `in ${Math.round(ms / 6e4)} minutes`;
      if (ms < 864e5) return `in ${Math.round(ms / 36e5)} hours`;
      if (ms < 6048e5) return `in ${Math.round(ms / 864e5)} days`;
      if (ms < 26298e5) return `in ${Math.round(ms / 6048e5)} weeks`;
      if (ms < 315576e5) return `in ${Math.round(ms / 26298e5)} months`;
      return `in ${Math.round(ms / 315576e5)} years`;
    },
    ago: () => {
      const ms = -time.toMilliseconds();
      if (ms < 0) return time.fromNow();
      if (ms < 1e3) return "a few seconds ago";
      if (ms < 6e4) return `${Math.round(ms / 1e3)} seconds ago`;
      if (ms < 36e5) return `${Math.round(ms / 6e4)} minutes ago`;
      if (ms < 864e5) return `${Math.round(ms / 36e5)} hours ago`;
      if (ms < 6048e5) return `${Math.round(ms / 864e5)} days ago`;
      if (ms < 26298e5) return `${Math.round(ms / 6048e5)} weeks ago`;
      if (ms < 315576e5) return `${Math.round(ms / 26298e5)} months ago`;
      return `${Math.round(ms / 315576e5)} years ago`;
    }
  };
  return time;
};
var parseTime = (time) => {
  const match = time.match(/^(\d+)(ms|s|m|h|d|w|y)$/);
  if (!match) throw new Error("Invalid time format");
  return createTime(parseInt(match[1]), match[2]);
};

// src/cookies/cookie-utils.ts
function parseSetCookieHeader(setCookie) {
  const cookies = /* @__PURE__ */ new Map();
  const cookieArray = setCookie.split(", ");
  cookieArray.forEach((cookieString) => {
    const parts = cookieString.split(";").map((part) => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, ...valueParts] = nameValue.split("=");
    const value = valueParts.join("=");
    if (!name || value === void 0) {
      return;
    }
    const attrObj = { value };
    attributes.forEach((attribute) => {
      const [attrName, ...attrValueParts] = attribute.split("=");
      const attrValue = attrValueParts.join("=");
      const normalizedAttrName = attrName.trim().toLowerCase();
      switch (normalizedAttrName) {
        case "max-age":
          attrObj["max-age"] = attrValue ? parseInt(attrValue.trim(), 10) : void 0;
          break;
        case "expires":
          attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
          break;
        case "domain":
          attrObj.domain = attrValue ? attrValue.trim() : void 0;
          break;
        case "path":
          attrObj.path = attrValue ? attrValue.trim() : void 0;
          break;
        case "secure":
          attrObj.secure = true;
          break;
        case "httponly":
          attrObj.httponly = true;
          break;
        case "samesite":
          attrObj.samesite = attrValue ? attrValue.trim().toLowerCase() : void 0;
          break;
        default:
          attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
          break;
      }
    });
    cookies.set(name, attrObj);
  });
  return cookies;
}

// src/cookies/index.ts
function createCookieGetter(options) {
  const secure = options.advanced?.useSecureCookies !== void 0 ? options.advanced?.useSecureCookies : options.baseURL !== void 0 ? options.baseURL.startsWith("https://") ? true : false : isProduction;
  const secureCookiePrefix = secure ? "__Secure-" : "";
  const crossSubdomainEnabled = !!options.advanced?.crossSubDomainCookies?.enabled;
  const domain = crossSubdomainEnabled ? options.advanced?.crossSubDomainCookies?.domain || (options.baseURL ? new URL(options.baseURL).hostname : void 0) : void 0;
  if (crossSubdomainEnabled && !domain) {
    throw new BetterAuthError(
      "baseURL is required when crossSubdomainCookies are enabled"
    );
  }
  function createCookie(cookieName, overrideAttributes = {}) {
    const prefix = options.advanced?.cookiePrefix || "better-auth";
    const name = options.advanced?.cookies?.[cookieName]?.name || `${prefix}.${cookieName}`;
    const attributes = options.advanced?.cookies?.[cookieName]?.attributes;
    return {
      name: `${secureCookiePrefix}${name}`,
      attributes: {
        secure: !!secureCookiePrefix,
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        ...crossSubdomainEnabled ? { domain } : {},
        ...options.advanced?.defaultCookieAttributes,
        ...overrideAttributes,
        ...attributes
      }
    };
  }
  return createCookie;
}
function getCookies(options) {
  const createCookie = createCookieGetter(options);
  const sessionMaxAge = options.session?.expiresIn || createTime(7, "d").toSeconds();
  const sessionToken = createCookie("session_token", {
    maxAge: sessionMaxAge
  });
  const sessionData = createCookie("session_data", {
    maxAge: options.session?.cookieCache?.maxAge || 60 * 5
  });
  const dontRememberToken = createCookie("dont_remember");
  return {
    sessionToken: {
      name: sessionToken.name,
      options: sessionToken.attributes
    },
    /**
     * This cookie is used to store the session data in the cookie
     * This is useful for when you want to cache the session in the cookie
     */
    sessionData: {
      name: sessionData.name,
      options: sessionData.attributes
    },
    dontRememberToken: {
      name: dontRememberToken.name,
      options: dontRememberToken.attributes
    }
  };
}
async function setCookieCache(ctx, session) {
  const shouldStoreSessionDataInCookie = ctx.context.options.session?.cookieCache?.enabled;
  if (shouldStoreSessionDataInCookie) {
    const data = base64Url.encode(
      JSON.stringify({
        session,
        expiresAt: getDate(
          ctx.context.authCookies.sessionData.options.maxAge || 60,
          "sec"
        ).getTime(),
        signature: await createHMAC("SHA-256", "base64urlnopad").sign(
          ctx.context.secret,
          JSON.stringify(session)
        )
      }),
      {
        padding: false
      }
    );
    if (data.length > 4093) {
      throw new BetterAuthError(
        "Session data is too large to store in the cookie. Please disable session cookie caching or reduce the size of the session data"
      );
    }
    ctx.setCookie(
      ctx.context.authCookies.sessionData.name,
      data,
      ctx.context.authCookies.sessionData.options
    );
  }
}
async function setSessionCookie(ctx, session, dontRememberMe, overrides) {
  const options = ctx.context.authCookies.sessionToken.options;
  const maxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
  await ctx.setSignedCookie(
    ctx.context.authCookies.sessionToken.name,
    session.session.token,
    ctx.context.secret,
    {
      ...options,
      maxAge,
      ...overrides
    }
  );
  if (dontRememberMe) {
    await ctx.setSignedCookie(
      ctx.context.authCookies.dontRememberToken.name,
      "true",
      ctx.context.secret,
      ctx.context.authCookies.dontRememberToken.options
    );
  }
  await setCookieCache(ctx, session);
  ctx.context.setNewSession(session);
  if (ctx.context.options.secondaryStorage) {
    await ctx.context.secondaryStorage?.set(
      session.session.token,
      JSON.stringify({
        user: session.user,
        session: session.session
      }),
      Math.floor(
        (new Date(session.session.expiresAt).getTime() - Date.now()) / 1e3
      )
    );
  }
}
function deleteSessionCookie(ctx) {
  ctx.setCookie(ctx.context.authCookies.sessionToken.name, "", {
    ...ctx.context.authCookies.sessionToken.options,
    maxAge: 0
  });
  ctx.setCookie(ctx.context.authCookies.sessionData.name, "", {
    ...ctx.context.authCookies.sessionData.options,
    maxAge: 0
  });
  ctx.setCookie(ctx.context.authCookies.dontRememberToken.name, "", {
    ...ctx.context.authCookies.dontRememberToken.options,
    maxAge: 0
  });
}
function parseCookies(cookieHeader) {
  const cookies = cookieHeader.split("; ");
  const cookieMap = /* @__PURE__ */ new Map();
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    cookieMap.set(name, value);
  });
  return cookieMap;
}

export { createCookieGetter, deleteSessionCookie, getCookies, parseCookies, parseSetCookieHeader, setCookieCache, setSessionCookie };
