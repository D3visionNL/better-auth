import { f as BetterAuthOptions } from '../shared/better-auth.Cl6aee2s.js';
import '../shared/better-auth.CYegVoq1.js';
import 'zod';
import '../shared/better-auth.Bzjh9zg_.js';
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
