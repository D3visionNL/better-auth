import * as _simplewebauthn_server from '@simplewebauthn/server';
import { CredentialDeviceType, PublicKeyCredentialCreationOptionsJSON, AuthenticationResponseJSON } from '@simplewebauthn/server';
import * as better_call from 'better-call';
import { z } from 'zod';
import { I as InferOptionSchema } from '../../shared/better-auth.C67OuOdK.cjs';
import '../../shared/better-auth.Bi8FQwDD.cjs';
import '../../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface PasskeyOptions {
    /**
     * A unique identifier for your website. 'localhost' is okay for
     * local dev
     *
     * @default "localhost"
     */
    rpID?: string;
    /**
     * Human-readable title for your website
     *
     * @default "Better Auth"
     */
    rpName?: string;
    /**
     * The URL at which registrations and authentications should occur.
     * `http://localhost` and `http://localhost:PORT` are also valid.
     * Do NOT include any trailing /
     *
     * if this isn't provided. The client itself will
     * pass this value.
     */
    origin?: string | null;
    /**
     * Allow customization of the authenticatorSelection options
     * during passkey registration.
     */
    authenticatorSelection?: AuthenticatorSelectionCriteria;
    /**
     * Advanced options
     */
    advanced?: {
        webAuthnChallengeCookie?: string;
    };
    /**
     * Schema for the passkey model
     */
    schema?: InferOptionSchema<typeof schema>;
}
type Passkey = {
    id: string;
    name?: string;
    publicKey: string;
    userId: string;
    credentialID: string;
    counter: number;
    deviceType: CredentialDeviceType;
    backedUp: boolean;
    transports?: string;
    createdAt: Date;
};
declare const passkey: (options?: PasskeyOptions) => {
    id: "passkey";
    endpoints: {
        generatePasskeyRegistrationOptions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                } | undefined;
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
                response: PublicKeyCredentialCreationOptionsJSON;
            } : PublicKeyCredentialCreationOptionsJSON>;
            options: {
                method: "GET";
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
                query: z.ZodOptional<z.ZodObject<{
                    authenticatorAttachment: z.ZodOptional<z.ZodEnum<["platform", "cross-platform"]>>;
                }, "strip", z.ZodTypeAny, {
                    authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                }, {
                    authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                }>>;
                metadata: {
                    client: boolean;
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                parameters: {
                                    query: {
                                        authenticatorAttachment: {
                                            description: string;
                                            required: boolean;
                                        };
                                    };
                                };
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                challenge: {
                                                    type: string;
                                                };
                                                rp: {
                                                    type: string;
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                        };
                                                        id: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                        };
                                                        displayName: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                pubKeyCredParams: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            type: {
                                                                type: string;
                                                            };
                                                            alg: {
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                timeout: {
                                                    type: string;
                                                };
                                                excludeCredentials: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            id: {
                                                                type: string;
                                                            };
                                                            type: {
                                                                type: string;
                                                            };
                                                            transports: {
                                                                type: string;
                                                                items: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                authenticatorSelection: {
                                                    type: string;
                                                    properties: {
                                                        authenticatorAttachment: {
                                                            type: string;
                                                        };
                                                        requireResidentKey: {
                                                            type: string;
                                                        };
                                                        userVerification: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                attestation: {
                                                    type: string;
                                                };
                                                extensions: {
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
            path: "/passkey/generate-register-options";
        };
        generatePasskeyAuthenticationOptions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: {
                    email?: string | undefined;
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
                response: _simplewebauthn_server.PublicKeyCredentialRequestOptionsJSON;
            } : _simplewebauthn_server.PublicKeyCredentialRequestOptionsJSON>;
            options: {
                method: "POST";
                body: z.ZodOptional<z.ZodObject<{
                    email: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email?: string | undefined;
                }, {
                    email?: string | undefined;
                }>>;
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
                                                challenge: {
                                                    type: string;
                                                };
                                                rp: {
                                                    type: string;
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                        };
                                                        id: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                        };
                                                        displayName: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                timeout: {
                                                    type: string;
                                                };
                                                allowCredentials: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            id: {
                                                                type: string;
                                                            };
                                                            type: {
                                                                type: string;
                                                            };
                                                            transports: {
                                                                type: string;
                                                                items: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                userVerification: {
                                                    type: string;
                                                };
                                                authenticatorSelection: {
                                                    type: string;
                                                    properties: {
                                                        authenticatorAttachment: {
                                                            type: string;
                                                        };
                                                        requireResidentKey: {
                                                            type: string;
                                                        };
                                                        userVerification: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                extensions: {
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
            path: "/passkey/generate-authenticate-options";
        };
        verifyPasskeyRegistration: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    name?: string | undefined;
                    response?: any;
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
                response: Passkey | null;
            } : Passkey | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    response: z.ZodAny;
                    name: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name?: string | undefined;
                    response?: any;
                }, {
                    name?: string | undefined;
                    response?: any;
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
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            $ref: string;
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
            path: "/passkey/verify-registration";
        };
        verifyPasskeyAuthentication: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    response: AuthenticationResponseJSON;
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
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                };
            } : {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    response: z.ZodRecord<z.ZodString, z.ZodAny>;
                }, "strip", z.ZodTypeAny, {
                    response: Record<string, any>;
                }, {
                    response: Record<string, any>;
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
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            response: AuthenticationResponseJSON;
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/passkey/verify-authentication";
        };
        listPasskeys: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
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
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: Passkey[];
            } : Passkey[]>;
            options: {
                method: "GET";
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
                                            type: "array";
                                            items: {
                                                $ref: string;
                                                required: string[];
                                            };
                                            description: string;
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
            path: "/passkey/list-user-passkeys";
        };
        deletePasskey: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    id: string;
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
                response: null;
            } : null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
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
            path: "/passkey/delete-passkey";
        };
        updatePasskey: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    id: string;
                    name: string;
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
                    passkey: Passkey;
                };
            } : {
                passkey: Passkey;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    name: string;
                }, {
                    id: string;
                    name: string;
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
                                                passkey: {
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
            path: "/passkey/update-passkey";
        };
    };
    schema: {
        passkey: {
            fields: {
                name: {
                    type: "string";
                    required: false;
                };
                publicKey: {
                    type: "string";
                    required: true;
                };
                userId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                    };
                    required: true;
                };
                credentialID: {
                    type: "string";
                    required: true;
                };
                counter: {
                    type: "number";
                    required: true;
                };
                deviceType: {
                    type: "string";
                    required: true;
                };
                backedUp: {
                    type: "boolean";
                    required: true;
                };
                transports: {
                    type: "string";
                    required: false;
                };
                createdAt: {
                    type: "date";
                    required: false;
                };
            };
        };
    };
    $ERROR_CODES: {
        readonly CHALLENGE_NOT_FOUND: "Challenge not found";
        readonly YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "You are not allowed to register this passkey";
        readonly FAILED_TO_VERIFY_REGISTRATION: "Failed to verify registration";
        readonly PASSKEY_NOT_FOUND: "Passkey not found";
        readonly AUTHENTICATION_FAILED: "Authentication failed";
        readonly UNABLE_TO_CREATE_SESSION: "Unable to create session";
        readonly FAILED_TO_UPDATE_PASSKEY: "Failed to update passkey";
    };
};
declare const schema: {
    passkey: {
        fields: {
            name: {
                type: "string";
                required: false;
            };
            publicKey: {
                type: "string";
                required: true;
            };
            userId: {
                type: "string";
                references: {
                    model: string;
                    field: string;
                };
                required: true;
            };
            credentialID: {
                type: "string";
                required: true;
            };
            counter: {
                type: "number";
                required: true;
            };
            deviceType: {
                type: "string";
                required: true;
            };
            backedUp: {
                type: "boolean";
                required: true;
            };
            transports: {
                type: "string";
                required: false;
            };
            createdAt: {
                type: "date";
                required: false;
            };
        };
    };
};

export { type Passkey, type PasskeyOptions, passkey };
