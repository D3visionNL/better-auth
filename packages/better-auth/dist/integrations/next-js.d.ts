import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../shared/better-auth.Cl6aee2s.js';
import '../shared/better-auth.CYegVoq1.js';
import 'zod';
import '../shared/better-auth.Bzjh9zg_.js';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

declare function toNextJsHandler(auth: {
    handler: (request: Request) => Promise<Response>;
} | ((request: Request) => Promise<Response>)): {
    GET: (request: Request) => Promise<Response>;
    POST: (request: Request) => Promise<Response>;
};
declare const nextCookies: () => {
    id: "next-cookies";
    hooks: {
        after: {
            matcher(ctx: HookEndpointContext): true;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
};

export { nextCookies, toNextJsHandler };
