import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../shared/better-auth.CGB93vl8.cjs';
import '../shared/better-auth.Bi8FQwDD.cjs';
import 'zod';
import '../shared/better-auth.BgtukYVC.cjs';
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
