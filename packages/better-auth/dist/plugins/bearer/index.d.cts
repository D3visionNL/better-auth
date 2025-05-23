import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../../shared/better-auth.CpmhGkrr.cjs';
import '../../shared/better-auth.CYegVoq1.cjs';
import 'zod';
import '../../shared/better-auth._rXvQlMG.cjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface BearerOptions {
    /**
     * If true, only signed tokens
     * will be converted to session
     * cookies
     *
     * @default false
     */
    requireSignature?: boolean;
}
/**
 * Converts bearer token to session cookie
 */
declare const bearer: (options?: BearerOptions) => {
    id: "bearer";
    hooks: {
        before: {
            matcher(context: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                context: {
                    headers: Headers;
                };
            } | undefined>;
        }[];
        after: {
            matcher(context: HookEndpointContext): true;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
};

export { bearer };
