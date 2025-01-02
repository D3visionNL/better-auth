export { v as Account, x as Adapter, y as AdapterInstance, s as AdditionalSessionFieldsInput, t as AdditionalSessionFieldsOutput, q as AdditionalUserFieldsInput, r as AdditionalUserFieldsOutput, j as Auth, k as AuthContext, A as AuthPluginSchema, N as BetterAuthCookies, B as BetterAuthOptions, d as BetterAuthPlugin, X as EligibleCookies, C as FilterActions, F as FilteredAPI, G as GenericEndpointContext, c as HookAfterHandler, b as HookBeforeHandler, H as HookEndpointContext, E as InferAPI, I as InferOptionSchema, e as InferPluginErrorCodes, u as InferPluginTypes, m as InferSession, D as InferSessionAPI, l as InferUser, a1 as LogHandlerParams, Z as LogLevel, a0 as Logger, M as Models, R as RateLimit, z as SecondaryStorage, S as Session, U as User, V as Verification, W as Where, n as WithJsDoc, p as betterAuth, J as createCookieGetter, a2 as createLogger, Q as deleteSessionCookie, L as getCookies, w as init, _ as levels, a3 as logger, T as parseCookies, Y as parseSetCookieHeader, O as setCookieCache, P as setSessionCookie, $ as shouldPublishLog } from './auth-BbYUexL8.js';
export { D as DeepPartial, E as Expand, H as HasRequiredKeys, a as LiteralNumber, L as LiteralString, d as LiteralUnion, O as OmitId, c as PreserveJSDoc, b as Prettify, P as PrettifyDeep, R as RequiredKeysOf, S as StripEmptyObjects, U as UnionToIntersection, W as WithoutEmpty } from './helper-Bi8FQwDD.js';
export { AtomListener, BetterAuthClientPlugin, ClientOptions, InferActions, InferAdditionalFromClient, InferClientAPI, InferErrorCodes, InferPluginsFromClient, InferSessionFromClient, InferUserFromClient, IsSignal, Store } from './types.js';
export { H as HIDE_METADATA } from './hide-metadata-DEHJp1rk.js';
export { g as generateState, p as parseState } from './state-CnpYjPz8.js';
export * from 'better-call';
export * from 'zod';
import 'kysely';
import './index-B0PXeJp8.js';
import 'jose';
import 'better-sqlite3';
import '@better-fetch/fetch';
import 'nanostores';

declare function capitalizeFirstLetter(str: string): string;

declare const generateId: (size?: number) => string;

declare class BetterAuthError extends Error {
    constructor(message: string, cause?: string);
}
declare class MissingDependencyError extends BetterAuthError {
    constructor(pkgName: string);
}

export { BetterAuthError, MissingDependencyError, capitalizeFirstLetter, generateId };
