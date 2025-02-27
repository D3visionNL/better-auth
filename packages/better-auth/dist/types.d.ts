import { e as BetterAuthPlugin, k as Auth, S as Session, U as User, ae as InferFieldsInputClient, ac as InferFieldsOutput } from './auth-CVBoNX4Z.js';
export { w as Account, A as Adapter, z as AdapterInstance, y as AdapterSchemaCreation, t as AdditionalSessionFieldsInput, u as AdditionalSessionFieldsOutput, r as AdditionalUserFieldsInput, s as AdditionalUserFieldsOutput, l as AuthContext, b as AuthPluginSchema, B as BetterAuthOptions, D as FilterActions, F as FilteredAPI, G as GenericEndpointContext, d as HookAfterHandler, c as HookBeforeHandler, H as HookEndpointContext, J as InferAPI, I as InferOptionSchema, f as InferPluginErrorCodes, v as InferPluginTypes, n as InferSession, E as InferSessionAPI, m as InferUser, M as Models, R as RateLimit, C as SecondaryStorage, V as Verification, W as Where, x as init } from './auth-CVBoNX4Z.js';
import { U as UnionToIntersection, H as HasRequiredKeys, b as Prettify, L as LiteralString, S as StripEmptyObjects } from './helper-Bi8FQwDD.js';
export { D as DeepPartial, E as Expand, a as LiteralNumber, d as LiteralUnion, O as OmitId, c as PreserveJSDoc, P as PrettifyDeep, R as RequiredKeysOf, W as WithoutEmpty } from './helper-Bi8FQwDD.js';
import { BetterFetchOption, BetterFetchResponse, BetterFetch, BetterFetchPlugin } from '@better-fetch/fetch';
import { WritableAtom, Atom } from 'nanostores';
import { Endpoint, Context } from 'better-call';
import 'kysely';
import 'zod';
import './index-l5SennZN.js';
import 'jose';
import 'better-sqlite3';

type CamelCase<S extends string> = S extends `${infer P1}-${infer P2}${infer P3}` ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}` : Lowercase<S>;
type PathToObject<T extends string, Fn extends (...args: any[]) => any> = T extends `/${infer Segment}/${infer Rest}` ? {
    [K in CamelCase<Segment>]: PathToObject<`/${Rest}`, Fn>;
} : T extends `/${infer Segment}` ? {
    [K in CamelCase<Segment>]: Fn;
} : never;
type InferSignUpEmailCtx<ClientOpts extends ClientOptions, FetchOptions extends BetterFetchOption> = {
    email: string;
    name: string;
    password: string;
    image?: string;
    callbackURL?: string;
    fetchOptions?: FetchOptions;
} & UnionToIntersection<InferAdditionalFromClient<ClientOpts, "user", "input">>;
type InferUserUpdateCtx<ClientOpts extends ClientOptions, FetchOptions extends BetterFetchOption> = {
    image?: string | null;
    name?: string;
    fetchOptions?: FetchOptions;
} & Partial<UnionToIntersection<InferAdditionalFromClient<ClientOpts, "user", "input">>>;
type InferCtx<C extends Context<any, any>, FetchOptions extends BetterFetchOption> = C["body"] extends Record<string, any> ? C["body"] & {
    fetchOptions?: BetterFetchOption<undefined, C["query"], C["params"]>;
} : C["query"] extends Record<string, any> ? {
    query: C["query"];
    fetchOptions?: FetchOptions;
} : C["query"] extends Record<string, any> | undefined ? {
    query?: C["query"];
    fetchOptions?: FetchOptions;
} : {
    fetchOptions?: FetchOptions;
};
type MergeRoutes<T> = UnionToIntersection<T>;
type InferRoute<API, COpts extends ClientOptions> = API extends Record<string, infer T> ? T extends Endpoint ? T["options"]["metadata"] extends {
    isAction: false;
} | {
    SERVER_ONLY: true;
} ? {} : PathToObject<T["path"], T extends (ctx: infer C) => infer R ? C extends Context<any, any> ? <FetchOptions extends BetterFetchOption<C["body"] & Record<string, any>, C["query"] & Record<string, any>, C["params"]>>(...data: HasRequiredKeys<InferCtx<C, FetchOptions>> extends true ? [
    Prettify<T["path"] extends `/sign-up/email` ? InferSignUpEmailCtx<COpts, FetchOptions> : InferCtx<C, FetchOptions>>,
    FetchOptions?
] : [
    Prettify<T["path"] extends `/update-user` ? InferUserUpdateCtx<COpts, FetchOptions> : InferCtx<C, FetchOptions>>?,
    FetchOptions?
]) => Promise<BetterFetchResponse<T["options"]["metadata"] extends {
    CUSTOM_SESSION: boolean;
} ? NonNullable<Awaited<R>> : T["path"] extends "/get-session" ? {
    user: InferUserFromClient<COpts>;
    session: InferSessionFromClient<COpts>;
} : NonNullable<Awaited<R>>, {
    code?: string;
    message?: string;
}, FetchOptions["throw"] extends true ? true : COpts["fetchOptions"] extends {
    throw: true;
} ? true : false>> : never : never> : {} : never;
type InferRoutes<API extends Record<string, Endpoint>, ClientOpts extends ClientOptions> = MergeRoutes<InferRoute<API, ClientOpts>>;

type AtomListener = {
    matcher: (path: string) => boolean;
    signal: "$sessionSignal" | Omit<string, "$sessionSignal">;
};
interface Store {
    notify: (signal: string) => void;
    listen: (signal: string, listener: () => void) => void;
    atoms: Record<string, WritableAtom<any>>;
}
interface BetterAuthClientPlugin {
    id: LiteralString;
    /**
     * only used for type inference. don't pass the
     * actual plugin
     */
    $InferServerPlugin?: BetterAuthPlugin;
    /**
     * Custom actions
     */
    getActions?: ($fetch: BetterFetch, $store: Store) => Record<string, any>;
    /**
     * State atoms that'll be resolved by each framework
     * auth store.
     */
    getAtoms?: ($fetch: BetterFetch) => Record<string, Atom<any>>;
    /**
     * specify path methods for server plugin inferred
     * endpoints to force a specific method.
     */
    pathMethods?: Record<string, "POST" | "GET">;
    /**
     * Better fetch plugins
     */
    fetchPlugins?: BetterFetchPlugin[];
    /**
     * a list of recaller based on a matcher function.
     * The signal name needs to match a signal in this
     * plugin or any plugin the user might have added.
     */
    atomListeners?: AtomListener[];
}
interface ClientOptions {
    fetchOptions?: BetterFetchOption;
    plugins?: BetterAuthClientPlugin[];
    baseURL?: string;
    disableDefaultFetchPlugins?: boolean;
}
type InferClientAPI<O extends ClientOptions> = InferRoutes<O["plugins"] extends Array<any> ? Auth["api"] & (O["plugins"] extends Array<infer Pl> ? UnionToIntersection<Pl extends {
    $InferServerPlugin: infer Plug;
} ? Plug extends {
    endpoints: infer Endpoints;
} ? Endpoints : {} : {}> : {}) : Auth["api"], O>;
type InferActions<O extends ClientOptions> = O["plugins"] extends Array<infer Plugin> ? UnionToIntersection<Plugin extends BetterAuthClientPlugin ? Plugin["getActions"] extends (...args: any) => infer Actions ? Actions : {} : {}> : {};
type InferErrorCodes<O extends ClientOptions> = O["plugins"] extends Array<infer Plugin> ? UnionToIntersection<Plugin extends BetterAuthClientPlugin ? Plugin["$InferServerPlugin"] extends BetterAuthPlugin ? Plugin["$InferServerPlugin"]["$ERROR_CODES"] : {} : {}> : {};
/**
 * signals are just used to recall a computed value.
 * as a convention they start with "$"
 */
type IsSignal<T> = T extends `$${infer _}` ? true : false;
type InferPluginsFromClient<O extends ClientOptions> = O["plugins"] extends Array<BetterAuthClientPlugin> ? Array<O["plugins"][number]["$InferServerPlugin"]> : undefined;
type InferSessionFromClient<O extends ClientOptions> = StripEmptyObjects<Session & UnionToIntersection<InferAdditionalFromClient<O, "session", "output">>>;
type InferUserFromClient<O extends ClientOptions> = StripEmptyObjects<User & UnionToIntersection<InferAdditionalFromClient<O, "user", "output">>>;
type InferAdditionalFromClient<Options extends ClientOptions, Key extends string, Format extends "input" | "output" = "output"> = Options["plugins"] extends Array<infer T> ? T extends BetterAuthClientPlugin ? T["$InferServerPlugin"] extends {
    schema: {
        [key in Key]: {
            fields: infer Field;
        };
    };
} ? Format extends "input" ? InferFieldsInputClient<Field> : InferFieldsOutput<Field> : {} : {} : {};

export { type AtomListener, type BetterAuthClientPlugin, BetterAuthPlugin, type ClientOptions, HasRequiredKeys, type InferActions, type InferAdditionalFromClient, type InferClientAPI, type InferErrorCodes, type InferPluginsFromClient, type InferSessionFromClient, type InferUserFromClient, type IsSignal, LiteralString, Prettify, Session, type Store, StripEmptyObjects, UnionToIntersection, User };
