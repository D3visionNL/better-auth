export { D as Account, a as Adapter, J as AdapterInstance, F as AdapterSchemaCreation, x as AdditionalSessionFieldsInput, y as AdditionalSessionFieldsOutput, v as AdditionalUserFieldsInput, w as AdditionalUserFieldsOutput, n as Auth, p as AuthContext, g as AuthPluginSchema, B as BetterAuthOptions, h as BetterAuthPlugin, O as FilterActions, N as FilteredAPI, G as GenericEndpointContext, H as HookEndpointContext, Q as InferAPI, I as InferOptionSchema, i as InferPluginErrorCodes, z as InferPluginTypes, r as InferSession, P as InferSessionAPI, q as InferUser, _ as LogHandlerParams, T as LogLevel, Z as Logger, M as Models, R as RateLimit, L as SecondaryStorage, S as Session, U as User, V as Verification, W as Where, t as WithJsDoc, u as betterAuth, $ as createLogger, E as init, X as levels, a0 as logger, Y as shouldPublishLog } from './shared/better-auth.BNRr97iY.js';
export { AtomListener, BetterAuthClientPlugin, ClientOptions, InferActions, InferAdditionalFromClient, InferClientAPI, InferErrorCodes, InferPluginsFromClient, InferSessionFromClient, InferUserFromClient, IsSignal, Store } from './types/index.js';
export { H as HIDE_METADATA } from './shared/better-auth.DEHJp1rk.js';
export { g as generateState, p as parseState } from './shared/better-auth.ClukZT1c.js';
export * from 'better-call';
export * from 'zod';
export { D as DeepPartial, E as Expand, H as HasRequiredKeys, a as LiteralNumber, L as LiteralString, d as LiteralUnion, O as OmitId, c as PreserveJSDoc, b as Prettify, P as PrettifyDeep, R as RequiredKeysOf, S as StripEmptyObjects, U as UnionToIntersection, W as WithoutEmpty } from './shared/better-auth.Bi8FQwDD.js';
export { O as OAuth2Tokens, a as OAuthProvider, P as ProviderOptions } from './shared/better-auth.ByC0y0O-.js';
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
