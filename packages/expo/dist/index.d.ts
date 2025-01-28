import * as better_auth from 'better-auth';

interface ExpoOptions {
    /**
     * Override origin header for expo api routes
     */
    overrideOrigin?: boolean;
}
declare const expo: (options?: ExpoOptions) => {
    id: "expo";
    init: (ctx: better_auth.AuthContext) => {
        options: {
            trustedOrigins: string[] | undefined;
        };
    };
    onRequest(request: Request, ctx: better_auth.AuthContext): Promise<{
        request: Request;
    } | undefined>;
    hooks: {
        after: {
            matcher(context: better_auth.HookEndpointContext<{
                returned: better_auth.APIError | Response | Record<string, any>;
                endpoint: better_auth.Endpoint;
            }>): boolean;
            handler: (ctx: better_auth.HookEndpointContext<{}>) => Promise<void>;
        }[];
    };
};

export { type ExpoOptions, expo };
