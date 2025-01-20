export { w as Account, A as Adapter, z as AdapterInstance, y as AdapterSchemaCreation, t as AdditionalSessionFieldsInput, u as AdditionalSessionFieldsOutput, r as AdditionalUserFieldsInput, s as AdditionalUserFieldsOutput, k as Auth, l as AuthContext, b as AuthPluginSchema, O as BetterAuthCookies, B as BetterAuthOptions, e as BetterAuthPlugin, Y as EligibleCookies, D as FilterActions, F as FilteredAPI, G as GenericEndpointContext, d as HookAfterHandler, c as HookBeforeHandler, H as HookEndpointContext, J as InferAPI, I as InferOptionSchema, f as InferPluginErrorCodes, v as InferPluginTypes, n as InferSession, E as InferSessionAPI, m as InferUser, a2 as LogHandlerParams, _ as LogLevel, a1 as Logger, M as Models, R as RateLimit, C as SecondaryStorage, S as Session, U as User, V as Verification, W as Where, p as WithJsDoc, q as betterAuth, L as createCookieGetter, a3 as createLogger, T as deleteSessionCookie, N as getCookies, x as init, $ as levels, a4 as logger, X as parseCookies, Z as parseSetCookieHeader, P as setCookieCache, Q as setSessionCookie, a0 as shouldPublishLog } from './auth-8UPh7J8A.js';
export { D as DeepPartial, E as Expand, H as HasRequiredKeys, a as LiteralNumber, L as LiteralString, d as LiteralUnion, O as OmitId, c as PreserveJSDoc, b as Prettify, P as PrettifyDeep, R as RequiredKeysOf, S as StripEmptyObjects, U as UnionToIntersection, W as WithoutEmpty } from './helper-Bi8FQwDD.js';
export { AtomListener, BetterAuthClientPlugin, ClientOptions, InferActions, InferAdditionalFromClient, InferClientAPI, InferErrorCodes, InferPluginsFromClient, InferSessionFromClient, InferUserFromClient, IsSignal, Store } from './types.js';
export { H as HIDE_METADATA } from './hide-metadata-DEHJp1rk.js';
export { g as generateState, p as parseState } from './state-p3EaJGPv.js';
export * from 'better-call';
export * from 'zod';
import 'kysely';
import './index-l5SennZN.js';
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
