import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../shared/better-auth.p1j7naQW.mjs';
import '../shared/better-auth.CYegVoq1.mjs';
import 'zod';
import '../shared/better-auth.BTXFetzv.mjs';
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
