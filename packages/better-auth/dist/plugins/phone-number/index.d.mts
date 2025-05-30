import * as better_call from 'better-call';
import { z } from 'zod';
import { U as User, I as InferOptionSchema } from '../../shared/better-auth.kHOzQ3TU.mjs';
import '../../shared/better-auth.Bi8FQwDD.mjs';
import '../../shared/better-auth.CggyDr6H.mjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface UserWithPhoneNumber extends User {
    phoneNumber: string;
    phoneNumberVerified: boolean;
}
interface PhoneNumberOptions {
    /**
     * Length of the OTP code
     * @default 6
     */
    otpLength?: number;
    /**
     * Send OTP code to the user
     *
     * @param phoneNumber
     * @param code
     * @returns
     */
    sendOTP: (data: {
        phoneNumber: string;
        code: string;
    }, request?: Request) => Promise<void> | void;
    /**
     * a callback to send otp on user requesting to reset their password
     *
     * @param data - contains phone number and code
     * @param request - the request object
     * @returns
     */
    sendForgetPasswordOTP?: (data: {
        phoneNumber: string;
        code: string;
    }, request?: Request) => Promise<void> | void;
    /**
     * Expiry time of the OTP code in seconds
     * @default 300
     */
    expiresIn?: number;
    /**
     * Function to validate phone number
     *
     * by default any string is accepted
     */
    phoneNumberValidator?: (phoneNumber: string) => boolean | Promise<boolean>;
    /**
     * Require a phone number verification before signing in
     *
     * @default false
     */
    requireVerification?: boolean;
    /**
     * Callback when phone number is verified
     */
    callbackOnVerification?: (data: {
        phoneNumber: string;
        user: UserWithPhoneNumber;
    }, request?: Request) => void | Promise<void>;
    /**
     * Sign up user after phone number verification
     *
     * the user will be signed up with the temporary email
     * and the phone number will be updated after verification
     */
    signUpOnVerification?: {
        /**
         * When a user signs up, a temporary email will be need to be created
         * to sign up the user. This function should return a temporary email
         * for the user given the phone number
         *
         * @param phoneNumber
         * @returns string (temporary email)
         */
        getTempEmail: (phoneNumber: string) => string;
        /**
         * When a user signs up, a temporary name will be need to be created
         * to sign up the user. This function should return a temporary name
         * for the user given the phone number
         *
         * @param phoneNumber
         * @returns string (temporary name)
         *
         * @default phoneNumber - the phone number will be used as the name
         */
        getTempName?: (phoneNumber: string) => string;
    };
    /**
     * Custom schema for the admin plugin
     */
    schema?: InferOptionSchema<typeof schema>;
    /**
     * Allowed attempts for the OTP code
     * @default 3
     */
    allowedAttempts?: number;
}
declare const phoneNumber: (options?: PhoneNumberOptions) => {
    id: "phone-number";
    endpoints: {
        signInPhoneNumber: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    password: string;
                    phoneNumber: string;
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
                    user: UserWithPhoneNumber;
                };
            } : {
                token: string;
                user: UserWithPhoneNumber;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    phoneNumber: z.ZodString;
                    password: z.ZodString;
                    rememberMe: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    phoneNumber: string;
                    rememberMe?: boolean | undefined;
                }, {
                    password: string;
                    phoneNumber: string;
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
                            400: {
                                description: string;
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-in/phone-number";
        };
        sendPhoneNumberOTP: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    phoneNumber: string;
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
                    message: string;
                };
            } : {
                message: string;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    phoneNumber: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    phoneNumber: string;
                }, {
                    phoneNumber: string;
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
                                                message: {
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
            path: "/phone-number/send-otp";
        };
        verifyPhoneNumber: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    code: string;
                    phoneNumber: string;
                    disableSession?: boolean | undefined;
                    updatePhoneNumber?: boolean | undefined;
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
                    user: UserWithPhoneNumber;
                } | {
                    status: boolean;
                    token: null;
                    user: UserWithPhoneNumber;
                } | null;
            } : {
                status: boolean;
                token: string;
                user: UserWithPhoneNumber;
            } | {
                status: boolean;
                token: null;
                user: UserWithPhoneNumber;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    /**
                     * Phone number
                     */
                    phoneNumber: z.ZodString;
                    /**
                     * OTP code
                     */
                    code: z.ZodString;
                    /**
                     * Disable session creation after verification
                     * @default false
                     */
                    disableSession: z.ZodOptional<z.ZodBoolean>;
                    /**
                     * This checks if there is a session already
                     * and updates the phone number with the provided
                     * phone number
                     */
                    updatePhoneNumber: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    code: string;
                    phoneNumber: string;
                    disableSession?: boolean | undefined;
                    updatePhoneNumber?: boolean | undefined;
                }, {
                    code: string;
                    phoneNumber: string;
                    disableSession?: boolean | undefined;
                    updatePhoneNumber?: boolean | undefined;
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
                                                    type: string;
                                                    nullable: boolean;
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
                                                        phoneNumber: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        phoneNumberVerified: {
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
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                            400: {
                                description: string;
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/phone-number/verify";
        };
        forgetPasswordPhoneNumber: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    phoneNumber: string;
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
                    phoneNumber: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    phoneNumber: string;
                }, {
                    phoneNumber: string;
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
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
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
            path: "/phone-number/forget-password";
        };
        resetPasswordPhoneNumber: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    newPassword: string;
                    otp: string;
                    phoneNumber: string;
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
                    otp: z.ZodString;
                    phoneNumber: z.ZodString;
                    newPassword: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    newPassword: string;
                    otp: string;
                    phoneNumber: string;
                }, {
                    newPassword: string;
                    otp: string;
                    phoneNumber: string;
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
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
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
            path: "/phone-number/reset-password";
        };
    };
    schema: {
        user: {
            fields: {
                phoneNumber: {
                    type: "string";
                    required: false;
                    unique: true;
                    sortable: true;
                    returned: true;
                };
                phoneNumberVerified: {
                    type: "boolean";
                    required: false;
                    returned: true;
                    input: false;
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
        readonly INVALID_PHONE_NUMBER: "Invalid phone number";
        readonly PHONE_NUMBER_EXIST: "Phone number already exist";
        readonly INVALID_PHONE_NUMBER_OR_PASSWORD: "Invalid phone number or password";
        readonly UNEXPECTED_ERROR: "Unexpected error";
        readonly OTP_NOT_FOUND: "OTP not found";
        readonly OTP_EXPIRED: "OTP expired";
        readonly INVALID_OTP: "Invalid OTP";
        readonly PHONE_NUMBER_NOT_VERIFIED: "Phone number not verified";
    };
};
declare const schema: {
    user: {
        fields: {
            phoneNumber: {
                type: "string";
                required: false;
                unique: true;
                sortable: true;
                returned: true;
            };
            phoneNumberVerified: {
                type: "boolean";
                required: false;
                returned: true;
                input: false;
            };
        };
    };
};

export { type PhoneNumberOptions, type UserWithPhoneNumber, phoneNumber };
