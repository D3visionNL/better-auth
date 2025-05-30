import { z } from 'zod';
import * as better_call from 'better-call';
import { U as User, I as InferOptionSchema, l as AuthEndpoint, H as HookEndpointContext } from '../../shared/better-auth.C67OuOdK.cjs';
import { L as LiteralString } from '../../shared/better-auth.Bi8FQwDD.cjs';
import * as _better_fetch_fetch from '@better-fetch/fetch';
import '../../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface BackupCodeOptions {
    /**
     * The amount of backup codes to generate
     *
     * @default 10
     */
    amount?: number;
    /**
     * The length of the backup codes
     *
     * @default 10
     */
    length?: number;
    customBackupCodesGenerate?: () => string[];
}

interface OTPOptions {
    /**
     * How long the opt will be valid for in
     * minutes
     *
     * @default "3 mins"
     */
    period?: number;
    /**
     * Number of digits for the OTP code
     *
     * @default 6
     */
    digits?: number;
    /**
     * Send the otp to the user
     *
     * @param user - The user to send the otp to
     * @param otp - The otp to send
     * @param request - The request object
     * @returns void | Promise<void>
     */
    sendOTP?: (
    /**
     * The user to send the otp to
     * @type UserWithTwoFactor
     * @default UserWithTwoFactors
     */
    data: {
        user: UserWithTwoFactor;
        otp: string;
    }, 
    /**
     * The request object
     */
    request?: Request) => Promise<void> | void;
    /**
     * The number of allowed attempts for the OTP
     *
     * @default 5
     */
    allowedAttempts?: number;
}

type TOTPOptions = {
    /**
     * Issuer
     */
    issuer?: string;
    /**
     * How many digits the otp to be
     *
     * @default 6
     */
    digits?: 6 | 8;
    /**
     * Period for otp in seconds.
     * @default 30
     */
    period?: number;
    /**
     * Backup codes configuration
     */
    backupCodes?: BackupCodeOptions;
    /**
     * Disable totp
     */
    disable?: boolean;
};

declare const schema: {
    user: {
        fields: {
            twoFactorEnabled: {
                type: "boolean";
                required: false;
                defaultValue: false;
                input: false;
            };
        };
    };
    twoFactor: {
        fields: {
            secret: {
                type: "string";
                required: true;
                returned: false;
            };
            backupCodes: {
                type: "string";
                required: true;
                returned: false;
            };
            userId: {
                type: "string";
                required: true;
                returned: false;
                references: {
                    model: string;
                    field: string;
                };
            };
        };
    };
};

interface TwoFactorOptions {
    /**
     * Application Name
     */
    issuer?: string;
    /**
     * TOTP OPtions
     */
    totpOptions?: Omit<TOTPOptions, "issuer">;
    /**
     * OTP Options
     */
    otpOptions?: OTPOptions;
    /**
     * Backup code options
     */
    backupCodeOptions?: BackupCodeOptions;
    /**
     * Skip verification on enabling two factor authentication.
     * @default false
     */
    skipVerificationOnEnable?: boolean;
    /**
     * Custom schema for the two factor plugin
     */
    schema?: InferOptionSchema<typeof schema>;
}
interface UserWithTwoFactor extends User {
    /**
     * If the user has enabled two factor authentication.
     */
    twoFactorEnabled: boolean;
}
interface TwoFactorProvider {
    id: LiteralString;
    endpoints?: Record<string, AuthEndpoint>;
}
interface TwoFactorTable {
    userId: string;
    secret: string;
    backupCodes: string;
    enabled: boolean;
}

declare const TWO_FACTOR_ERROR_CODES: {
    readonly OTP_NOT_ENABLED: "OTP not enabled";
    readonly OTP_HAS_EXPIRED: "OTP has expired";
    readonly TOTP_NOT_ENABLED: "TOTP not enabled";
    readonly TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled";
    readonly BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled";
    readonly INVALID_BACKUP_CODE: "Invalid backup code";
    readonly INVALID_CODE: "Invalid code";
    readonly TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Too many attempts. Please request a new code.";
    readonly INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie";
};

declare const twoFactorClient: (options?: {
    /**
     * a redirect function to call if a user needs to verify
     * their two factor
     */
    onTwoFactorRedirect?: () => void | Promise<void>;
}) => {
    id: "two-factor";
    $InferServerPlugin: ReturnType<typeof twoFactor>;
    atomListeners: {
        matcher: (path: string) => boolean;
        signal: "$sessionSignal";
    }[];
    pathMethods: {
        "/two-factor/disable": "POST";
        "/two-factor/enable": "POST";
        "/two-factor/send-otp": "POST";
        "/two-factor/generate-backup-codes": "POST";
    };
    fetchPlugins: {
        id: string;
        name: string;
        hooks: {
            onSuccess(context: _better_fetch_fetch.SuccessContext<any>): Promise<void>;
        };
    }[];
};

declare const twoFactor: (options?: TwoFactorOptions) => {
    id: "two-factor";
    endpoints: {
        enableTwoFactor: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
                    issuer?: string | undefined;
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
                    totpURI: string;
                    backupCodes: string[];
                };
            } : {
                totpURI: string;
                backupCodes: string[];
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                    issuer: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    issuer?: string | undefined;
                }, {
                    password: string;
                    issuer?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
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
                                                totpURI: {
                                                    type: string;
                                                    description: string;
                                                };
                                                backupCodes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
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
            path: "/two-factor/enable";
        };
        disableTwoFactor: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
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
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
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
                                                status: {
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
            path: "/two-factor/disable";
        };
        verifyBackupCode: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    code: string;
                    trustDevice?: boolean | undefined;
                    disableSession?: boolean | undefined;
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
                    token: string | undefined;
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
                token: string | undefined;
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
                    code: z.ZodString;
                    disableSession: z.ZodOptional<z.ZodBoolean>;
                    trustDevice: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                    trustDevice?: boolean | undefined;
                    disableSession?: boolean | undefined;
                }, {
                    code: string;
                    trustDevice?: boolean | undefined;
                    disableSession?: boolean | undefined;
                }>;
                metadata: {
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
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        twoFactorEnabled: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
                                                    description: string;
                                                };
                                                session: {
                                                    type: string;
                                                    properties: {
                                                        token: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        expiresAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
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
            path: "/two-factor/verify-backup-code";
        };
        generateBackupCodes: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
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
                    backupCodes: string[];
                };
            } : {
                status: boolean;
                backupCodes: string[];
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
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
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
                                                };
                                                backupCodes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
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
            path: "/two-factor/generate-backup-codes";
        };
        viewBackupCodes: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                };
            } & {
                method?: "GET" | undefined;
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
                    backupCodes: string[];
                };
            } : {
                status: boolean;
                backupCodes: string[];
            }>;
            options: {
                method: "GET";
                body: z.ZodObject<{
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
            } & {
                use: any[];
            };
            path: "/two-factor/view-backup-codes";
        };
        sendTwoFactorOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: {
                    trustDevice?: boolean | undefined;
                } | undefined;
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
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodOptional<z.ZodObject<{
                    trustDevice: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    trustDevice?: boolean | undefined;
                }, {
                    trustDevice?: boolean | undefined;
                }>>;
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
                                                status: {
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
            path: "/two-factor/send-otp";
        };
        verifyTwoFactorOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    code: string;
                    trustDevice?: boolean | undefined;
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
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    code: z.ZodString;
                    trustDevice: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                    trustDevice?: boolean | undefined;
                }, {
                    code: string;
                    trustDevice?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            "200": {
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
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
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
            path: "/two-factor/verify-otp";
        };
        generateTOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    secret: string;
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
                    code: string;
                };
            } : {
                code: string;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    secret: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    secret: string;
                }, {
                    secret: string;
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
                                                code: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    SERVER_ONLY: true;
                };
            } & {
                use: any[];
            };
            path: "/totp/generate";
        };
        getTOTPURI: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
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
                    totpURI: string;
                };
            } : {
                totpURI: string;
            }>;
            options: {
                method: "POST";
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                body: z.ZodObject<{
                    password: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
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
                                                totpURI: {
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
            path: "/two-factor/get-totp-uri";
        };
        verifyTOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    code: string;
                    trustDevice?: boolean | undefined;
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
                    code: z.ZodString;
                    trustDevice: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                    trustDevice?: boolean | undefined;
                }, {
                    code: string;
                    trustDevice?: boolean | undefined;
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
                                                status: {
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
            path: "/two-factor/verify-totp";
        };
    };
    options: TwoFactorOptions | undefined;
    hooks: {
        after: {
            matcher(context: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                twoFactorRedirect: boolean;
            } | undefined>;
        }[];
    };
    schema: {
        user: {
            fields: {
                twoFactorEnabled: {
                    type: "boolean";
                    required: false;
                    defaultValue: false;
                    input: false;
                };
            };
        };
        twoFactor: {
            fields: {
                secret: {
                    type: "string";
                    required: true;
                    returned: false;
                };
                backupCodes: {
                    type: "string";
                    required: true;
                    returned: false;
                };
                userId: {
                    type: "string";
                    required: true;
                    returned: false;
                    references: {
                        model: string;
                        field: string;
                    };
                };
            };
        };
    };
    rateLimit: {
        pathMatcher(path: string): boolean;
        window: number;
        max: number;
    }[];
    $ERROR_CODES: {
        readonly OTP_NOT_ENABLED: "OTP not enabled";
        readonly OTP_HAS_EXPIRED: "OTP has expired";
        readonly TOTP_NOT_ENABLED: "TOTP not enabled";
        readonly TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled";
        readonly BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled";
        readonly INVALID_BACKUP_CODE: "Invalid backup code";
        readonly INVALID_CODE: "Invalid code";
        readonly TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Too many attempts. Please request a new code.";
        readonly INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie";
    };
};

export { TWO_FACTOR_ERROR_CODES, type TwoFactorOptions, type TwoFactorProvider, type TwoFactorTable, type UserWithTwoFactor, twoFactor, twoFactorClient };
