export { v as Account, x as Adapter, z as AdapterInstance, y as AdapterSchemaCreation, s as AdditionalSessionFieldsInput, t as AdditionalSessionFieldsOutput, q as AdditionalUserFieldsInput, r as AdditionalUserFieldsOutput, j as Auth, k as AuthContext, A as AuthPluginSchema, O as BetterAuthCookies, B as BetterAuthOptions, d as BetterAuthPlugin, Y as EligibleCookies, D as FilterActions, F as FilteredAPI, G as GenericEndpointContext, c as HookAfterHandler, b as HookBeforeHandler, H as HookEndpointContext, J as InferAPI, I as InferOptionSchema, e as InferPluginErrorCodes, u as InferPluginTypes, m as InferSession, E as InferSessionAPI, l as InferUser, a2 as LogHandlerParams, _ as LogLevel, a1 as Logger, M as Models, R as RateLimit, C as SecondaryStorage, S as Session, U as User, V as Verification, W as Where, n as WithJsDoc, p as betterAuth, L as createCookieGetter, a3 as createLogger, T as deleteSessionCookie, N as getCookies, w as init, $ as levels, a4 as logger, X as parseCookies, Z as parseSetCookieHeader, P as setCookieCache, Q as setSessionCookie, a0 as shouldPublishLog } from './auth-Wqh-EswE.cjs';
export { D as DeepPartial, E as Expand, H as HasRequiredKeys, a as LiteralNumber, L as LiteralString, d as LiteralUnion, O as OmitId, c as PreserveJSDoc, b as Prettify, P as PrettifyDeep, R as RequiredKeysOf, S as StripEmptyObjects, U as UnionToIntersection, W as WithoutEmpty } from './helper-Bi8FQwDD.cjs';
export { AtomListener, BetterAuthClientPlugin, ClientOptions, InferActions, InferAdditionalFromClient, InferClientAPI, InferErrorCodes, InferPluginsFromClient, InferSessionFromClient, InferUserFromClient, IsSignal, Store } from './types.cjs';
export { H as HIDE_METADATA } from './hide-metadata-DEHJp1rk.cjs';
export { g as generateState, p as parseState } from './state-Bp5VMGUi.cjs';
export * from 'better-call';
export * from 'zod';
import 'kysely';
import './index-q7pIlaCQ.cjs';
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
