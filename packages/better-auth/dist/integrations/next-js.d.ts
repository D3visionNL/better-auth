import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../shared/better-auth.BNRr97iY.js';
import '../shared/better-auth.Bi8FQwDD.js';
import 'zod';
import '../shared/better-auth.ByC0y0O-.js';
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
