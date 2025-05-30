import * as better_call from 'better-call';
import { z } from 'zod';
import { U as User, p as AuthContext } from '../../shared/better-auth.kHOzQ3TU.mjs';
import { O as OAuth2Tokens, a as OAuthProvider } from '../../shared/better-auth.CggyDr6H.mjs';
import '../../shared/better-auth.Bi8FQwDD.mjs';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';
import 'jose';

/**
 * Configuration interface for generic OAuth providers.
 */
interface GenericOAuthConfig {
    /** Unique identifier for the OAuth provider */
    providerId: string;
    /**
     * URL to fetch OAuth 2.0 configuration.
     * If provided, the authorization and token endpoints will be fetched from this URL.
     */
    discoveryUrl?: string;
    /**
     * URL for the authorization endpoint.
     * Optional if using discoveryUrl.
     */
    authorizationUrl?: string;
    /**
     * URL for the token endpoint.
     * Optional if using discoveryUrl.
     */
    tokenUrl?: string;
    /**
     * URL for the user info endpoint.
     * Optional if using discoveryUrl.
     */
    userInfoUrl?: string;
    /** OAuth client ID */
    clientId: string;
    /** OAuth client secret */
    clientSecret: string;
    /**
     * Array of OAuth scopes to request.
     * @default []
     */
    scopes?: string[];
    /**
     * Custom redirect URI.
     * If not provided, a default URI will be constructed.
     */
    redirectURI?: string;
    /**
     * OAuth response type.
     * @default "code"
     */
    responseType?: string;
    /**
     * The response mode to use for the authorization code request.

     */
    responseMode?: "query" | "form_post";
    /**
     * Prompt parameter for the authorization request.
     * Controls the authentication experience for the user.
     */
    prompt?: "none" | "login" | "consent" | "select_account";
    /**
     * Whether to use PKCE (Proof Key for Code Exchange)
     * @default false
     */
    pkce?: boolean;
    /**
     * Access type for the authorization request.
     * Use "offline" to request a refresh token.
     */
    accessType?: string;
    /**
     * Custom function to fetch user info.
     * If provided, this function will be used instead of the default user info fetching logic.
     * @param tokens - The OAuth tokens received after successful authentication
     * @returns A promise that resolves to a User object or null
     */
    getUserInfo?: (tokens: OAuth2Tokens) => Promise<User | null>;
    /**
     * Custom function to map the user profile to a User object.
     */
    mapProfileToUser?: (profile: Record<string, any>) => {
        id?: string;
        name?: string;
        email?: string;
        image?: string;
        emailVerified?: boolean;
        [key: string]: any;
    } | Promise<{
        id?: string;
        name?: string;
        email?: string;
        image?: string;
        emailVerified?: boolean;
        [key: string]: any;
    }>;
    /**
     * Additional search-params to add to the authorizationUrl.
     * Warning: Search-params added here overwrite any default params.
     */
    authorizationUrlParams?: Record<string, string>;
    /**
     * Disable implicit sign up for new users. When set to true for the provider,
     * sign-in need to be called with with requestSignUp as true to create new users.
     */
    disableImplicitSignUp?: boolean;
    /**
     * Disable sign up for new users.
     */
    disableSignUp?: boolean;
    /**
     * Authentication method for token requests.
     * @default "post"
     */
    authentication?: "basic" | "post";
    /**
     * Custom headers to include in the discovery request.
     * Useful for providers like Epic that require specific headers (e.g., Epic-Client-ID).
     */
    discoveryHeaders?: Record<string, string>;
    /**
     * Custom headers to include in the authorization request.
     * Useful for providers like Qonto that require specific headers (e.g., X-Qonto-Staging-Token for local development).
     */
    authorizationHeaders?: Record<string, string>;
    /**
     * Override user info with the provider info.
     *
     * This will update the user info with the provider info,
     * when the user signs in with the provider.
     * @default false
     */
    overrideUserInfo?: boolean;
}
interface GenericOAuthOptions {
    /**
     * Array of OAuth provider configurations.
     */
    config: GenericOAuthConfig[];
}
/**
 * A generic OAuth plugin that can be used to add OAuth support to any provider
 */
declare const genericOAuth: (options: GenericOAuthOptions) => {
    id: "generic-oauth";
    init: (ctx: AuthContext) => {
        context: {
            socialProviders: OAuthProvider<Record<string, any>>[];
        };
    };
    endpoints: {
        signInWithOAuth2: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    providerId: string;
                    scopes?: string[] | undefined;
                    callbackURL?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
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
                    providerId: z.ZodString;
                    callbackURL: z.ZodOptional<z.ZodString>;
                    errorCallbackURL: z.ZodOptional<z.ZodString>;
                    newUserCallbackURL: z.ZodOptional<z.ZodString>;
                    disableRedirect: z.ZodOptional<z.ZodBoolean>;
                    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    requestSignUp: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    providerId: string;
                    scopes?: string[] | undefined;
                    callbackURL?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }, {
                    providerId: string;
                    scopes?: string[] | undefined;
                    callbackURL?: string | undefined;
                    requestSignUp?: boolean | undefined;
                    errorCallbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
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
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
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
            path: "/sign-in/oauth2";
        };
        oAuth2Callback: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    state?: string | undefined;
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
                response: void;
            } : void>;
            options: {
                method: "GET";
                query: z.ZodObject<{
                    code: z.ZodOptional<z.ZodString>;
                    error: z.ZodOptional<z.ZodString>;
                    error_description: z.ZodOptional<z.ZodString>;
                    state: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                }, {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
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
                                                url: {
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
            path: "/oauth2/callback/:providerId";
        };
        oAuth2LinkAccount: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    providerId: string;
                    callbackURL: string;
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
                    providerId: z.ZodString;
                    callbackURL: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    providerId: string;
                    callbackURL: string;
                }, {
                    providerId: string;
                    callbackURL: string;
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
            path: "/oauth2/link";
        };
    };
    $ERROR_CODES: {
        readonly INVALID_OAUTH_CONFIGURATION: "Invalid OAuth configuration";
    };
};

export { type GenericOAuthConfig, genericOAuth };
