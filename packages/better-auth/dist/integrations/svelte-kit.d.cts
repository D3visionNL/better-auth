import { f as BetterAuthOptions } from '../shared/better-auth.CpmhGkrr.cjs';
import '../shared/better-auth.CYegVoq1.cjs';
import 'zod';
import '../shared/better-auth._rXvQlMG.cjs';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

declare const toSvelteKitHandler: (auth: {
    handler: (request: Request) => any;
    options: BetterAuthOptions;
}) => (event: {
    request: Request;
}) => any;
declare const svelteKitHandler: ({ auth, event, resolve, }: {
    auth: {
        handler: (request: Request) => any;
        options: BetterAuthOptions;
    };
    event: {
        request: Request;
        url: URL;
    };
    resolve: (event: any) => any;
}) => Promise<any>;
declare function isAuthPath(url: string, options: BetterAuthOptions): boolean;

export { isAuthPath, svelteKitHandler, toSvelteKitHandler };
