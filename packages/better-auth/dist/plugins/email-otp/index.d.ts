import { z } from 'zod';
import * as better_call from 'better-call';
import { H as HookEndpointContext } from '../../shared/better-auth.BNRr97iY.js';
import '../../shared/better-auth.Bi8FQwDD.js';
import '../../shared/better-auth.ByC0y0O-.js';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface EmailOTPOptions {
    /**
     * Function to send email verification
     */
    sendVerificationOTP: (data: {
        email: string;
        otp: string;
        type: "sign-in" | "email-verification" | "forget-password";
    }, request?: Request) => Promise<void>;
    /**
     * Length of the OTP
     *
     * @default 6
     */
    otpLength?: number;
    /**
     * Expiry time of the OTP in seconds
     *
     * @default 300 (5 minutes)
     */
    expiresIn?: number;
    /**
     * Custom function to generate otp
     */
    generateOTP?: (data: {
        email: string;
        type: "sign-in" | "email-verification" | "forget-password";
    }, request?: Request) => string;
    /**
     * Send email verification on sign-up
     *
     * @Default false
     */
    sendVerificationOnSignUp?: boolean;
    /**
     * A boolean value that determines whether to prevent
     * automatic sign-up when the user is not registered.
     *
     * @Default false
     */
    disableSignUp?: boolean;
    /**
     * Allowed attempts for the OTP code
     * @default 3
     */
    allowedAttempts?: number;
}
declare const emailOTP: (options: EmailOTPOptions) => {
    id: "email-otp";
    endpoints: {
        sendVerificationOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
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
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                    type: z.ZodEnum<["email-verification", "sign-in", "forget-password"]>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                }, {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                }>;
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
                                                success: {
                                                    type: string;
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
            path: "/email-otp/send-verification-otp";
        };
        createVerificationOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
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
                response: string;
            } : string>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                    type: z.ZodEnum<["email-verification", "sign-in", "forget-password"]>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                }, {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                }>;
                metadata: {
                    SERVER_ONLY: true;
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "string";
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
            path: "/email-otp/create-verification-otp";
        };
        getVerificationOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                };
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
                    otp: null;
                } | {
                    otp: string;
                };
            } : {
                otp: null;
            } | {
                otp: string;
            }>;
            options: {
                method: "GET";
                query: z.ZodObject<{
                    email: z.ZodString;
                    type: z.ZodEnum<["email-verification", "sign-in", "forget-password"]>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                }, {
                    email: string;
                    type: "sign-in" | "forget-password" | "email-verification";
                }>;
                metadata: {
                    SERVER_ONLY: true;
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                otp: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
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
            path: "/email-otp/get-verification-otp";
        };
        verifyEmailOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    otp: string;
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
                    status: boolean;
                    token: string;
                    user: {
                        id: any;
                        email: any;
                        emailVerified: any;
                        name: any;
                        image: any;
                        createdAt: any;
                        updatedAt: any;
                    };
                } | {
                    status: boolean;
                    token: null;
                    user: {
                        id: any;
                        email: any;
                        emailVerified: any;
                        name: any;
                        image: any;
                        createdAt: any;
                        updatedAt: any;
                    };
                };
            } : {
                status: boolean;
                token: string;
                user: {
                    id: any;
                    email: any;
                    emailVerified: any;
                    name: any;
                    image: any;
                    createdAt: any;
                    updatedAt: any;
                };
            } | {
                status: boolean;
                token: null;
                user: {
                    id: any;
                    email: any;
                    emailVerified: any;
                    name: any;
                    image: any;
                    createdAt: any;
                    updatedAt: any;
                };
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                    otp: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    otp: string;
                }, {
                    email: string;
                    otp: string;
                }>;
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
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
                                                };
                                                token: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                                required: string[];
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
            path: "/email-otp/verify-email";
        };
        signInEmailOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    otp: string;
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
                        name: string;
                        image: string | null | undefined;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                    otp: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    otp: string;
                }, {
                    email: string;
                    otp: string;
                }>;
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
            path: "/sign-in/email-otp";
        };
        forgetPasswordEmailOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
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
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                }, {
                    email: string;
                }>;
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
                                                success: {
                                                    type: string;
                                                    description: string;
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
            path: "/forget-password/email-otp";
        };
        resetPasswordEmailOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
                    email: string;
                    otp: string;
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
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                    otp: z.ZodString;
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    email: string;
                    otp: string;
                }, {
                    password: string;
                    email: string;
                    otp: string;
                }>;
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
                                                success: {
                                                    type: string;
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
            path: "/email-otp/reset-password";
        };
    };
    hooks: {
        after: {
            matcher(context: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void>;
        }[];
    };
    $ERROR_CODES: {
        readonly OTP_EXPIRED: "otp expired";
        readonly INVALID_OTP: "Invalid OTP";
        readonly INVALID_EMAIL: "Invalid email";
        readonly USER_NOT_FOUND: "User not found";
        readonly TOO_MANY_ATTEMPTS: "Too many attempts";
    };
    rateLimit: ({
        pathMatcher(path: string): path is "/email-otp/send-verification-otp";
        window: number;
        max: number;
    } | {
        pathMatcher(path: string): path is "/email-otp/verify-email";
        window: number;
        max: number;
    } | {
        pathMatcher(path: string): path is "/sign-in/email-otp";
        window: number;
        max: number;
    })[];
};

export { type EmailOTPOptions, emailOTP };
