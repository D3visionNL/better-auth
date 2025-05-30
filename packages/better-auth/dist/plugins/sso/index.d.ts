import * as better_call from 'better-call';
import { z } from 'zod';
import { O as OAuth2Tokens } from '../../shared/better-auth.ByC0y0O-.js';
import { U as User } from '../../shared/better-auth.BNRr97iY.js';
import '../../shared/better-auth.Bi8FQwDD.js';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface SSOOptions {
    /**
     * custom function to provision a user when they sign in with an SSO provider.
     */
    provisionUser?: (data: {
        /**
         * The user object from the database
         */
        user: User & Record<string, any>;
        /**
         * The user info object from the provider
         */
        userInfo: Record<string, any>;
        /**
         * The OAuth2 tokens from the provider
         */
        token: OAuth2Tokens;
        /**
         * The SSO provider
         */
        provider: SSOProvider;
    }) => Promise<void>;
    /**
     * Organization provisioning options
     */
    organizationProvisioning?: {
        disabled?: boolean;
        defaultRole?: "member" | "admin";
        getRole?: (data: {
            /**
             * The user object from the database
             */
            user: User & Record<string, any>;
            /**
             * The user info object from the provider
             */
            userInfo: Record<string, any>;
            /**
             * The OAuth2 tokens from the provider
             */
            token: OAuth2Tokens;
            /**
             * The SSO provider
             */
            provider: SSOProvider;
        }) => Promise<"member" | "admin">;
    };
    /**
     * Disable implicit sign up for new users. When set to true for the provider,
     * sign-in need to be called with with requestSignUp as true to create new users.
     */
    disableImplicitSignUp?: boolean;
    /**
     * Override user info with the provider info.
     * @default false
     */
    defaultOverrideUserInfo?: boolean;
}
declare const sso: (options?: SSOOptions) => {
    id: "sso";
    endpoints: {
        createOIDCProvider: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    providerId: string;
                    issuer: string;
                    domain: string;
                    clientId: string;
                    clientSecret: string;
                    authorizationEndpoint?: string | undefined;
                    scopes?: string[] | undefined;
                    tokenEndpoint?: string | undefined;
                    overrideUserInfo?: boolean | undefined;
                    organizationId?: string | undefined;
                    pkce?: boolean | undefined;
                    userInfoEndpoint?: string | undefined;
                    tokenEndpointAuthentication?: "client_secret_basic" | "client_secret_post" | undefined;
                    jwksEndpoint?: string | undefined;
                    discoveryEndpoint?: string | undefined;
                    mapping?: {
                        id: string;
                        name: string;
                        email: string;
                        image?: string | undefined;
                        emailVerified?: string | undefined;
                        extraFields?: Record<string, string> | undefined;
                    } | undefined;
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
                    oidcConfig: OIDCConfig;
                    redirectURI: string;
                };
            } : {
                oidcConfig: OIDCConfig;
                redirectURI: string;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    providerId: z.ZodString;
                    issuer: z.ZodString;
                    domain: z.ZodString;
                    clientId: z.ZodString;
                    clientSecret: z.ZodString;
                    authorizationEndpoint: z.ZodOptional<z.ZodString>;
                    tokenEndpoint: z.ZodOptional<z.ZodString>;
                    userInfoEndpoint: z.ZodOptional<z.ZodString>;
                    tokenEndpointAuthentication: z.ZodOptional<z.ZodEnum<["client_secret_post", "client_secret_basic"]>>;
                    jwksEndpoint: z.ZodOptional<z.ZodString>;
                    discoveryEndpoint: z.ZodOptional<z.ZodString>;
                    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    pkce: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                    mapping: z.ZodOptional<z.ZodObject<{
                        id: z.ZodString;
                        email: z.ZodString;
                        emailVerified: z.ZodOptional<z.ZodString>;
                        name: z.ZodString;
                        image: z.ZodOptional<z.ZodString>;
                        extraFields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                    }, "strip", z.ZodTypeAny, {
                        id: string;
                        name: string;
                        email: string;
                        image?: string | undefined;
                        emailVerified?: string | undefined;
                        extraFields?: Record<string, string> | undefined;
                    }, {
                        id: string;
                        name: string;
                        email: string;
                        image?: string | undefined;
                        emailVerified?: string | undefined;
                        extraFields?: Record<string, string> | undefined;
                    }>>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    overrideUserInfo: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                }, "strip", z.ZodTypeAny, {
                    providerId: string;
                    issuer: string;
                    domain: string;
                    clientId: string;
                    clientSecret: string;
                    authorizationEndpoint?: string | undefined;
                    scopes?: string[] | undefined;
                    tokenEndpoint?: string | undefined;
                    overrideUserInfo?: boolean | undefined;
                    organizationId?: string | undefined;
                    pkce?: boolean | undefined;
                    userInfoEndpoint?: string | undefined;
                    tokenEndpointAuthentication?: "client_secret_basic" | "client_secret_post" | undefined;
                    jwksEndpoint?: string | undefined;
                    discoveryEndpoint?: string | undefined;
                    mapping?: {
                        id: string;
                        name: string;
                        email: string;
                        image?: string | undefined;
                        emailVerified?: string | undefined;
                        extraFields?: Record<string, string> | undefined;
                    } | undefined;
                }, {
                    providerId: string;
                    issuer: string;
                    domain: string;
                    clientId: string;
                    clientSecret: string;
                    authorizationEndpoint?: string | undefined;
                    scopes?: string[] | undefined;
                    tokenEndpoint?: string | undefined;
                    overrideUserInfo?: boolean | undefined;
                    organizationId?: string | undefined;
                    pkce?: boolean | undefined;
                    userInfoEndpoint?: string | undefined;
                    tokenEndpointAuthentication?: "client_secret_basic" | "client_secret_post" | undefined;
                    jwksEndpoint?: string | undefined;
                    discoveryEndpoint?: string | undefined;
                    mapping?: {
                        id: string;
                        name: string;
                        email: string;
                        image?: string | undefined;
                        emailVerified?: string | undefined;
                        extraFields?: Record<string, string> | undefined;
                    } | undefined;
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
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                issuer: {
                                                    type: string;
                                                    format: string;
                                                    description: string;
                                                };
                                                domain: {
                                                    type: string;
                                                    description: string;
                                                };
                                                oidcConfig: {
                                                    type: string;
                                                    properties: {
                                                        issuer: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        pkce: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        clientId: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        clientSecret: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        authorizationEndpoint: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        discoveryEndpoint: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        userInfoEndpoint: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        scopes: {
                                                            type: string;
                                                            items: {
                                                                type: string;
                                                            };
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        tokenEndpoint: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        tokenEndpointAuthentication: {
                                                            type: string;
                                                            enum: string[];
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        jwksEndpoint: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        mapping: {
                                                            type: string;
                                                            nullable: boolean;
                                                            properties: {
                                                                id: {
                                                                    type: string;
                                                                    description: string;
                                                                };
                                                                email: {
                                                                    type: string;
                                                                    description: string;
                                                                };
                                                                emailVerified: {
                                                                    type: string;
                                                                    nullable: boolean;
                                                                    description: string;
                                                                };
                                                                name: {
                                                                    type: string;
                                                                    description: string;
                                                                };
                                                                image: {
                                                                    type: string;
                                                                    nullable: boolean;
                                                                    description: string;
                                                                };
                                                                extraFields: {
                                                                    type: string;
                                                                    additionalProperties: {
                                                                        type: string;
                                                                    };
                                                                    nullable: boolean;
                                                                    description: string;
                                                                };
                                                            };
                                                            required: string[];
                                                        };
                                                    };
                                                    required: string[];
                                                    description: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                userId: {
                                                    type: string;
                                                    description: string;
                                                };
                                                providerId: {
                                                    type: string;
                                                    description: string;
                                                };
                                                redirectURI: {
                                                    type: string;
                                                    format: string;
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
            path: "/sso/register";
        };
        signInSSO: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    callbackURL: string;
                    email?: string | undefined;
                    scopes?: string[] | undefined;
                    providerId?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    domain?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    organizationSlug?: string | undefined;
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
                    url: string;
                    redirect: boolean;
                };
            } : {
                url: string;
                redirect: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodOptional<z.ZodString>;
                    organizationSlug: z.ZodOptional<z.ZodString>;
                    providerId: z.ZodOptional<z.ZodString>;
                    domain: z.ZodOptional<z.ZodString>;
                    callbackURL: z.ZodString;
                    errorCallbackURL: z.ZodOptional<z.ZodString>;
                    newUserCallbackURL: z.ZodOptional<z.ZodString>;
                    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    requestSignUp: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    callbackURL: string;
                    email?: string | undefined;
                    scopes?: string[] | undefined;
                    providerId?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    domain?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    organizationSlug?: string | undefined;
                }, {
                    callbackURL: string;
                    email?: string | undefined;
                    scopes?: string[] | undefined;
                    providerId?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    domain?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    organizationSlug?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            issuer: {
                                                type: string;
                                                description: string;
                                            };
                                            providerId: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                            errorCallbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                            newUserCallbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                url: {
                                                    type: string;
                                                    format: string;
                                                    description: string;
                                                };
                                                redirect: {
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
            path: "/sign-in/sso";
        };
        callbackSSO: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                };
            } & {
                params: {
                    providerId: string;
                };
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
                response: never;
            } : never>;
            options: {
                method: "GET";
                query: z.ZodObject<{
                    code: z.ZodOptional<z.ZodString>;
                    state: z.ZodString;
                    error: z.ZodOptional<z.ZodString>;
                    error_description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }, {
                    state: string;
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }>;
                metadata: {
                    isAction: boolean;
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            "302": {
                                description: string;
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sso/callback/:providerId";
        };
    };
    schema: {
        ssoProvider: {
            fields: {
                issuer: {
                    type: "string";
                    required: true;
                };
                oidcConfig: {
                    type: "string";
                    required: false;
                };
                samlConfig: {
                    type: "string";
                    required: false;
                };
                userId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                    };
                };
                providerId: {
                    type: "string";
                    required: true;
                    unique: true;
                };
                organizationId: {
                    type: "string";
                    required: false;
                };
                domain: {
                    type: "string";
                    required: true;
                };
            };
        };
    };
};
interface SSOProvider {
    issuer: string;
    oidcConfig: OIDCConfig;
    userId: string;
    providerId: string;
    organizationId?: string;
}
interface OIDCConfig {
    issuer: string;
    pkce: boolean;
    clientId: string;
    clientSecret: string;
    authorizationEndpoint?: string;
    discoveryEndpoint: string;
    userInfoEndpoint?: string;
    scopes?: string[];
    overrideUserInfo?: boolean;
    tokenEndpoint?: string;
    tokenEndpointAuthentication?: "client_secret_post" | "client_secret_basic";
    jwksEndpoint?: string;
    mapping?: {
        id?: string;
        email?: string;
        emailVerified?: string;
        name?: string;
        image?: string;
        extraFields?: Record<string, string>;
    };
}

export { type OIDCConfig, type SSOOptions, type SSOProvider, sso };
