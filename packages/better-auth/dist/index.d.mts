export { x as Account, g as Adapter, z as AdapterInstance, i as AdapterSchemaCreation, u as AdditionalSessionFieldsInput, v as AdditionalSessionFieldsOutput, s as AdditionalUserFieldsInput, t as AdditionalUserFieldsOutput, k as Auth, l as AuthContext, A as AuthPluginSchema, f as BetterAuthOptions, B as BetterAuthPlugin, E as FilterActions, D as FilteredAPI, G as GenericEndpointContext, H as HookEndpointContext, L as InferAPI, I as InferOptionSchema, a as InferPluginErrorCodes, w as InferPluginTypes, n as InferSession, J as InferSessionAPI, m as InferUser, T as LogHandlerParams, N as LogLevel, Q as Logger, M as Models, R as RateLimit, C as SecondaryStorage, S as Session, U as User, V as Verification, W as Where, q as WithJsDoc, r as betterAuth, X as createLogger, y as init, O as levels, Y as logger, P as shouldPublishLog } from './shared/better-auth.p1j7naQW.mjs';
export { AtomListener, BetterAuthClientPlugin, ClientOptions, InferActions, InferAdditionalFromClient, InferClientAPI, InferErrorCodes, InferPluginsFromClient, InferSessionFromClient, InferUserFromClient, IsSignal, Store } from './types/index.mjs';
export { H as HIDE_METADATA } from './shared/better-auth.DEHJp1rk.mjs';
export { g as generateState, p as parseState } from './shared/better-auth.wvqzvzRN.mjs';
export * from 'better-call';
export * from 'zod';
export { D as DeepPartial, E as Expand, H as HasRequiredKeys, b as LiteralNumber, L as LiteralString, d as LiteralUnion, O as OmitId, c as PreserveJSDoc, P as Prettify, a as PrettifyDeep, R as RequiredKeysOf, S as StripEmptyObjects, U as UnionToIntersection, W as WithoutEmpty } from './shared/better-auth.CYegVoq1.mjs';
export { O as OAuth2Tokens, a as OAuthProvider, P as ProviderOptions } from './shared/better-auth.BTXFetzv.mjs';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';
import '@better-fetch/fetch';
import 'nanostores';
import 'jose';

declare function capitalizeFirstLetter(str: string): string;

declare const generateId: (size?: number) => string;

declare class BetterAuthError extends Error {
    constructor(message: string, cause?: string);
}
declare class MissingDependencyError extends BetterAuthError {
    constructor(pkgName: string);
}

export { BetterAuthError, MissingDependencyError, capitalizeFirstLetter, generateId };
