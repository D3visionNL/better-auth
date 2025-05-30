import { f as BASE_ERROR_CODES, h as BetterAuthPlugin } from '../shared/better-auth.C67OuOdK.cjs';
import * as _better_fetch_fetch from '@better-fetch/fetch';
import { BetterFetchError, BetterFetch, BetterFetchOption } from '@better-fetch/fetch';
export * from '@better-fetch/fetch';
import { ClientOptions, BetterAuthClientPlugin, IsSignal, InferClientAPI, InferActions, InferErrorCodes } from '../types/index.cjs';
export { AtomListener, InferAdditionalFromClient, InferPluginsFromClient, InferSessionFromClient, InferUserFromClient, Store } from '../types/index.cjs';
import * as nanostores from 'nanostores';
import { Atom, PreinitializedWritableAtom } from 'nanostores';
export * from 'nanostores';
import { U as UnionToIntersection, P as PrettifyDeep } from '../shared/better-auth.Bi8FQwDD.cjs';
import 'zod';
import '../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

type InferResolvedHooks<O extends ClientOptions> = O["plugins"] extends Array<infer Plugin> ? Plugin extends BetterAuthClientPlugin ? Plugin["getAtoms"] extends (fetch: any) => infer Atoms ? Atoms extends Record<string, any> ? {
    [key in keyof Atoms as IsSignal<key> extends true ? never : key extends string ? `use${Capitalize<key>}` : never]: Atoms[key];
} : {} : {} : {} : {};
declare function createAuthClient<Option extends ClientOptions>(options?: Option): UnionToIntersection<InferResolvedHooks<Option>> & InferClientAPI<Option> & InferActions<Option> & {
    useSession: Atom<{
        data: InferClientAPI<Option> extends {
            getSession: () => Promise<infer Res>;
        } ? Res extends {
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | {
            data: infer S;
            error: null;
        } ? S : Res extends Record<string, any> ? Res : never : never;
        error: BetterFetchError | null;
        isPending: boolean;
    }>;
    $fetch: _better_fetch_fetch.BetterFetch<{
        plugins: (_better_fetch_fetch.BetterFetchPlugin | {
            id: string;
            name: string;
            hooks: {
                onSuccess(context: _better_fetch_fetch.SuccessContext<any>): void;
            };
        })[];
        method: string;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache;
        credentials?: RequestCredentials;
        integrity?: string;
        keepalive?: boolean;
        mode?: RequestMode;
        priority?: RequestPriority;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        signal?: AbortSignal | null;
        window?: null;
        onRequest?: <T extends Record<string, any>>(context: _better_fetch_fetch.RequestContext<T>) => Promise<_better_fetch_fetch.RequestContext | void> | _better_fetch_fetch.RequestContext | void;
        onResponse?: (context: _better_fetch_fetch.ResponseContext) => Promise<Response | void | _better_fetch_fetch.ResponseContext> | Response | _better_fetch_fetch.ResponseContext | void;
        onSuccess?: ((context: _better_fetch_fetch.SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: (context: _better_fetch_fetch.ErrorContext) => Promise<void> | void;
        onRetry?: (response: _better_fetch_fetch.ResponseContext) => Promise<void> | void;
        hookOptions?: {
            cloneResponse?: boolean;
        };
        timeout?: number;
        customFetchImpl: _better_fetch_fetch.FetchEsque;
        baseURL: string;
        throw?: boolean;
        auth?: {
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        };
        body?: any;
        query?: any;
        params?: any;
        duplex?: "full" | "half";
        jsonParser: (text: string) => Promise<any> | any;
        retry?: _better_fetch_fetch.RetryOptions;
        retryAttempt?: number;
        output?: _better_fetch_fetch.StandardSchemaV1 | typeof Blob | typeof File;
        errorSchema?: _better_fetch_fetch.StandardSchemaV1;
        disableValidation?: boolean;
    }, unknown, unknown, {}>;
    $store: {
        notify: (signal?: Omit<string, "$sessionSignal"> | "$sessionSignal") => void;
        listen: (signal: Omit<string, "$sessionSignal"> | "$sessionSignal", listener: (value: boolean, oldValue?: boolean | undefined) => void) => void;
        atoms: Record<string, nanostores.WritableAtom<any>>;
    };
    $Infer: {
        Session: NonNullable<InferClientAPI<Option> extends {
            getSession: () => Promise<infer Res>;
        } ? Res extends {
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | {
            data: infer S;
            error: null;
        } ? S : Res extends Record<string, any> ? Res : never : never>;
    };
    $ERROR_CODES: PrettifyDeep<InferErrorCodes<Option> & typeof BASE_ERROR_CODES>;
};

declare const useAuthQuery: <T>(initializedAtom: PreinitializedWritableAtom<any> | PreinitializedWritableAtom<any>[], path: string, $fetch: BetterFetch, options?: ((value: {
    data: null | T;
    error: null | BetterFetchError;
    isPending: boolean;
}) => BetterFetchOption) | BetterFetchOption) => PreinitializedWritableAtom<{
    data: null | T;
    error: null | BetterFetchError;
    isPending: boolean;
    isRefetching: boolean;
    refetch: () => void;
}> & object;

declare const InferPlugin: <T extends BetterAuthPlugin>() => {
    id: "infer-server-plugin";
    $InferServerPlugin: T;
};

export { BetterAuthClientPlugin, ClientOptions, InferActions, InferClientAPI, InferErrorCodes, InferPlugin, IsSignal, createAuthClient, useAuthQuery };
