import * as nanostores from 'nanostores';
import { Store, StoreValue } from 'nanostores';
export * from 'nanostores';
import * as _better_fetch_fetch from '@better-fetch/fetch';
import { BetterFetchError } from '@better-fetch/fetch';
export * from '@better-fetch/fetch';
import { ClientOptions, BetterAuthClientPlugin, IsSignal, InferClientAPI, InferActions, InferErrorCodes } from '../../types/index.mjs';
import { U as UnionToIntersection, P as PrettifyDeep } from '../../shared/better-auth.Bi8FQwDD.mjs';
import { DependencyList } from 'react';
import { f as BASE_ERROR_CODES } from '../../shared/better-auth.kHOzQ3TU.mjs';
import 'better-call';
import 'zod';
import '../../shared/better-auth.CggyDr6H.mjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

type StoreKeys<T> = T extends {
    setKey: (k: infer K, v: any) => unknown;
} ? K : never;
interface UseStoreOptions<SomeStore> {
    /**
     * @default
     * ```ts
     * [store, options.keys]
     * ```
     */
    deps?: DependencyList;
    /**
     * Will re-render components only on specific key changes.
     */
    keys?: StoreKeys<SomeStore>[];
}
/**
 * Subscribe to store changes and get store's value.
 *
 * Can be user with store builder too.
 *
 * ```js
 * import { useStore } from 'nanostores/react'
 *
 * import { router } from '../store/router'
 *
 * export const Layout = () => {
 *   let page = useStore(router)
 *   if (page.route === 'home') {
 *     return <HomePage />
 *   } else {
 *     return <Error404 />
 *   }
 * }
 * ```
 *
 * @param store Store instance.
 * @returns Store value.
 */
declare function useStore<SomeStore extends Store>(store: SomeStore, options?: UseStoreOptions<SomeStore>): StoreValue<SomeStore>;

declare function capitalizeFirstLetter(str: string): string;
type InferResolvedHooks<O extends ClientOptions> = O["plugins"] extends Array<infer Plugin> ? Plugin extends BetterAuthClientPlugin ? Plugin["getAtoms"] extends (fetch: any) => infer Atoms ? Atoms extends Record<string, any> ? {
    [key in keyof Atoms as IsSignal<key> extends true ? never : key extends string ? `use${Capitalize<key>}` : never]: () => ReturnType<Atoms[key]["get"]>;
} : {} : {} : {} : {};
declare function createAuthClient<Option extends ClientOptions>(options?: Option): UnionToIntersection<InferResolvedHooks<Option>> & InferClientAPI<Option> & InferActions<Option> & {
    useSession: () => {
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
        } ? S : Res : never;
        isPending: boolean;
        error: BetterFetchError | null;
        refetch: () => void;
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
        } ? S : Res : never>;
    };
    $fetch: _better_fetch_fetch.BetterFetch<{
        plugins: (_better_fetch_fetch.BetterFetchPlugin | {
            id: string;
            name: string;
            hooks: {
                onSuccess(context: _better_fetch_fetch.SuccessContext<any>): void;
            };
        })[];
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache;
        credentials?: RequestCredentials;
        integrity?: string;
        keepalive?: boolean;
        method: string;
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
    $ERROR_CODES: PrettifyDeep<InferErrorCodes<Option> & typeof BASE_ERROR_CODES>;
};

export { capitalizeFirstLetter, createAuthClient, useStore };
