import { z } from 'zod';
import * as better_call from 'better-call';
import { I as InferOptionSchema, H as HookEndpointContext } from '../../shared/better-auth.C67OuOdK.cjs';
import '../../shared/better-auth.Bi8FQwDD.cjs';
import '../../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

declare const schema: {
    user: {
        fields: {
            username: {
                type: "string";
                required: false;
                sortable: true;
                unique: true;
                returned: true;
                transform: {
                    input(value: string | number | boolean | string[] | Date | number[] | null | undefined): string | undefined;
                };
            };
            displayUsername: {
                type: "string";
                required: false;
            };
        };
    };
};

declare const USERNAME_ERROR_CODES: {
    INVALID_USERNAME_OR_PASSWORD: string;
    EMAIL_NOT_VERIFIED: string;
    UNEXPECTED_ERROR: string;
    USERNAME_IS_ALREADY_TAKEN: string;
    USERNAME_TOO_SHORT: string;
    USERNAME_TOO_LONG: string;
    INVALID_USERNAME: string;
};

type UsernameOptions = {
    schema?: InferOptionSchema<typeof schema>;
    /**
     * The minimum length of the username
     *
     * @default 3
     */
    minUsernameLength?: number;
    /**
     * The maximum length of the username
     *
     * @default 30
     */
    maxUsernameLength?: number;
    /**
     * A function to validate the username
     *
     * By default, the username should only contain alphanumeric characters and underscores
     */
    usernameValidator?: (username: string) => boolean | Promise<boolean>;
};
declare const username: (options?: UsernameOptions) => {
    id: "username";
    endpoints: {
        signInUsername: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
                    username: string;
                    rememberMe?: boolean | undefined;
                };
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
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    token: string;
                    user: {
                        id: string;
                        email: string;
                        emailVerified: boolean;
                        username: string;
                        name: string;
                        image: string | null | undefined;
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
                    username: string;
                    name: string;
                    image: string | null | undefined;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    username: z.ZodString;
                    password: z.ZodString;
                    rememberMe: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    username: string;
                    rememberMe?: boolean | undefined;
                }, {
                    password: string;
                    username: string;
                    rememberMe?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                    description: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
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
            path: "/sign-in/username";
        };
    };
    schema: {
        user: {
            fields: {
                username: {
                    type: "string";
                    required: false;
                    sortable: true;
                    unique: true;
                    returned: true;
                    transform: {
                        input(value: string | number | boolean | string[] | Date | number[] | null | undefined): string | undefined;
                    };
                };
                displayUsername: {
                    type: "string";
                    required: false;
                };
            };
        };
    };
    hooks: {
        before: {
            matcher(context: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
    $ERROR_CODES: {
        INVALID_USERNAME_OR_PASSWORD: string;
        EMAIL_NOT_VERIFIED: string;
        UNEXPECTED_ERROR: string;
        USERNAME_IS_ALREADY_TAKEN: string;
        USERNAME_TOO_SHORT: string;
        USERNAME_TOO_LONG: string;
        INVALID_USERNAME: string;
    };
};

export { USERNAME_ERROR_CODES, type UsernameOptions, username };
