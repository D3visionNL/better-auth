import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../auth-CVBoNX4Z.js';
import 'kysely';
import 'zod';
import '../helper-Bi8FQwDD.js';
import '../index-l5SennZN.js';
import 'jose';
import 'better-sqlite3';

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
            handler: (c: HookEndpointContext) => Promise<{
                context: HookEndpointContext;
            } | undefined>;
        }[];
        after: {
            matcher(context: HookEndpointContext<{
                returned: better_call.APIError | Response | Record<string, any>;
                endpoint: better_call.Endpoint;
            }>): boolean;
            handler: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                responseHeader: Headers;
            } | undefined>, better_call.EndpointOptions>;
        }[];
    };
};

export { bearer };
