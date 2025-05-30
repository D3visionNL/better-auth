import * as better_call from 'better-call';
import { EndpointContext } from 'better-call';
import { U as User, S as Session, p as AuthContext, I as InferOptionSchema, H as HookEndpointContext } from '../../shared/better-auth.kHOzQ3TU.mjs';
import '../../shared/better-auth.Bi8FQwDD.mjs';
import 'zod';
import '../../shared/better-auth.CggyDr6H.mjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface UserWithAnonymous extends User {
    isAnonymous: boolean;
}
interface AnonymousOptions {
    /**
     * Configure the domain name of the temporary email
     * address for anonymous users in the database.
     * @default "baseURL"
     */
    emailDomainName?: string;
    /**
     * A useful hook to run after an anonymous user
     * is about to link their account.
     */
    onLinkAccount?: (data: {
        anonymousUser: {
            user: UserWithAnonymous & Record<string, any>;
            session: Session & Record<string, any>;
        };
        newUser: {
            user: User & Record<string, any>;
            session: Session & Record<string, any>;
        };
    }) => Promise<void> | void;
    /**
     * Disable deleting the anonymous user after linking
     */
    disableDeleteAnonymousUser?: boolean;
    /**
     * A hook to generate a name for the anonymous user.
     * Useful if you want to have random names for anonymous users, or if `name` is unique in your database.
     * @returns The name for the anonymous user.
     */
    generateName?: (ctx: EndpointContext<"/sign-in/anonymous", {
        method: "POST";
    }, AuthContext>) => string;
    /**
     * Custom schema for the anonymous plugin
     */
    schema?: InferOptionSchema<typeof schema>;
}
declare const schema: {
    user: {
        fields: {
            isAnonymous: {
                type: "boolean";
                required: false;
            };
        };
    };
};
declare const anonymous: (options?: AnonymousOptions) => {
    id: "anonymous";
    endpoints: {
        signInAnonymous: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: better_call.Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    token: string;
                    user: {
                        id: string;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } | null;
            } : {
                token: string;
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | null>;
            options: {
                method: "POST";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                                session: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-in/anonymous";
        };
    };
    hooks: {
        after: {
            matcher(ctx: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
    schema: {
        user: {
            fields: {
                isAnonymous: {
                    type: "boolean";
                    required: false;
                };
            };
        };
    };
    $ERROR_CODES: {
        readonly FAILED_TO_CREATE_USER: "Failed to create user";
        readonly COULD_NOT_CREATE_SESSION: "Could not create session";
        readonly ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: "Anonymous users cannot sign in again anonymously";
    };
};

export { type AnonymousOptions, type UserWithAnonymous, anonymous };
