import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../shared/better-auth.BNRr97iY.js';
import '../shared/better-auth.Bi8FQwDD.js';
import 'zod';
import '../shared/better-auth.ByC0y0O-.js';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

declare const reactStartCookies: () => {
    id: "react-start-cookies";
    hooks: {
        after: {
            matcher(ctx: HookEndpointContext): true;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
};

export { reactStartCookies };
