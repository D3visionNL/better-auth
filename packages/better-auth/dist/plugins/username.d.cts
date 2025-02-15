import { I as InferOptionSchema, H as HookEndpointContext } from '../auth-LoXag6ZL.cjs';
import { z } from 'zod';
import * as better_call from 'better-call';
import 'kysely';
import '../helper-Bi8FQwDD.cjs';
import '../index-D0tmmb_V.cjs';
import 'jose';
import 'better-sqlite3';

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
        };
    };
};

type UsernameOptions = {
    schema?: InferOptionSchema<typeof schema>;
};
declare const username: (options?: UsernameOptions) => {
    id: "username";
    endpoints: {
        signInUsername: {
            <C extends [better_call.Context<"/sign-in/username", {
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
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                token: string;
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image: string | null | undefined;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | null>;
            path: "/sign-in/username";
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
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
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
            };
        };
    };
    hooks: {
        before: {
            matcher(context: HookEndpointContext): boolean;
            handler(ctx: HookEndpointContext): Promise<void>;
        }[];
    };
    $ERROR_CODES: {
        readonly OTP_NOT_ENABLED: "OTP not enabled";
        readonly OTP_HAS_EXPIRED: "OTP has expired";
        readonly TOTP_NOT_ENABLED: "TOTP not enabled";
        readonly TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled";
        readonly BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled";
        readonly INVALID_BACKUP_CODE: "Invalid backup code";
    };
};

export { type UsernameOptions, username };
