import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../shared/better-auth.Cl6aee2s.js';
import '../shared/better-auth.CYegVoq1.js';
import 'zod';
import '../shared/better-auth.Bzjh9zg_.js';
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
