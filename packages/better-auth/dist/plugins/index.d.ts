export { InferInvitation, InferMember, InferOrganizationRolesFromOption, InferOrganizationZodRolesFromOption, Invitation, InvitationInput, InvitationStatus, Member, MemberInput, Organization, OrganizationInput, OrganizationOptions, Team, TeamInput, invitationSchema, invitationStatus, memberSchema, organization, organizationSchema, parseRoles, role, teamSchema } from './organization/index.js';
export { adminAc, defaultAc, defaultRoles, defaultStatements, memberAc, ownerAc } from './organization/access/index.js';
export { TWO_FACTOR_ERROR_CODES, TwoFactorOptions, TwoFactorProvider, TwoFactorTable, UserWithTwoFactor, twoFactor, twoFactorClient } from './two-factor/index.js';
export { USERNAME_ERROR_CODES, UsernameOptions, username } from './username/index.js';
export { bearer } from './bearer/index.js';
import { G as GenericEndpointContext } from '../shared/better-auth.BNRr97iY.js';
export { l as AuthEndpoint, m as AuthMiddleware, g as AuthPluginSchema, h as BetterAuthPlugin, I as InferOptionSchema, i as InferPluginErrorCodes, k as createAuthEndpoint, j as createAuthMiddleware, o as optionsMiddleware } from '../shared/better-auth.BNRr97iY.js';
export { H as HIDE_METADATA } from '../shared/better-auth.DEHJp1rk.js';
export { magicLink } from './magic-link/index.js';
export { PhoneNumberOptions, UserWithPhoneNumber, phoneNumber } from './phone-number/index.js';
export { AnonymousOptions, UserWithAnonymous, anonymous } from './anonymous/index.js';
export { AdminOptions, InferAdminRolesFromOption, SessionWithImpersonatedBy, UserWithRole, admin } from './admin/index.js';
export { GenericOAuthConfig, genericOAuth } from './generic-oauth/index.js';
export { JwtOptions, getJwtToken, jwt } from './jwt/index.js';
export { multiSession } from './multi-session/index.js';
export { EmailOTPOptions, emailOTP } from './email-otp/index.js';
export { oneTap } from './one-tap/index.js';
export { oAuthProxy } from './oauth-proxy/index.js';
export { customSession } from './custom-session/index.js';
export { OpenAPIOptions, Path, generator, openAPI } from './open-api/index.js';
import { OIDCOptions, OIDCMetadata, OAuthAccessToken } from './oidc-provider/index.js';
export { AuthorizationQuery, Client, CodeVerificationValue, TokenBody, getMetadata, oidcProvider } from './oidc-provider/index.js';
export { captcha } from './captcha/index.js';
export { A as API_KEY_TABLE_NAME, E as ERROR_CODES, a as apiKey, d as defaultKeyHasher } from '../shared/better-auth.cMgbPWLA.js';
export { HaveIBeenPwnedOptions, haveIBeenPwned } from './haveibeenpwned/index.js';
export { oneTimeToken } from './one-time-token/index.js';
import * as better_call from 'better-call';
import { z } from 'zod';
import './access/index.js';
import '../shared/better-auth.Bi8FQwDD.js';
import '@better-fetch/fetch';
import '../shared/better-auth.ByC0y0O-.js';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface MCPOptions {
    loginPage: string;
    oidcConfig?: OIDCOptions;
}
declare const getMCPProviderMetadata: (ctx: GenericEndpointContext, options?: OIDCOptions) => OIDCMetadata;
declare const mcp: (options: MCPOptions) => {
    id: "mcp";
    hooks: {
        after: {
            matcher(): true;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<void | {
                redirect: boolean;
                url: any;
            }>;
        }[];
    };
    endpoints: {
        getMcpOAuthConfig: {
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
                response: OIDCMetadata | null;
            } : OIDCMetadata | null>;
            options: {
                method: "GET";
                metadata: {
                    client: boolean;
                };
            } & {
                use: any[];
            };
            path: "/.well-known/oauth-authorization-server";
        };
        mcpOAuthAuthroize: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: Record<string, any>;
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
                response: void;
            } : void>;
            options: {
                method: "GET";
                query: z.ZodRecord<z.ZodString, z.ZodAny>;
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
                                            additionalProperties: boolean;
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
            path: "/mcp/authorize";
        };
        mcpOAuthToken: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: Record<string, any>;
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
                    access_token: string;
                    token_type: string;
                    expires_in: number;
                    refresh_token: string;
                    scope: string;
                } | {
                    access_token: string;
                    token_type: string;
                    expires_in: number;
                    refresh_token: string | undefined;
                    scope: string;
                    id_token: string | undefined;
                };
            } : {
                access_token: string;
                token_type: string;
                expires_in: number;
                refresh_token: string;
                scope: string;
            } | {
                access_token: string;
                token_type: string;
                expires_in: number;
                refresh_token: string | undefined;
                scope: string;
                id_token: string | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodRecord<z.ZodString, z.ZodAny>;
                metadata: {
                    isAction: boolean;
                };
            } & {
                use: any[];
            };
            path: "/mcp/token";
        };
        registerMcpClient: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    redirect_uris: string[];
                    metadata?: Record<string, any> | undefined;
                    scope?: string | undefined;
                    jwks?: Record<string, any> | undefined;
                    jwks_uri?: string | undefined;
                    token_endpoint_auth_method?: "none" | "client_secret_basic" | "client_secret_post" | undefined;
                    grant_types?: ("password" | "refresh_token" | "authorization_code" | "implicit" | "client_credentials" | "urn:ietf:params:oauth:grant-type:jwt-bearer" | "urn:ietf:params:oauth:grant-type:saml2-bearer")[] | undefined;
                    response_types?: ("code" | "token")[] | undefined;
                    client_name?: string | undefined;
                    client_uri?: string | undefined;
                    logo_uri?: string | undefined;
                    contacts?: string[] | undefined;
                    tos_uri?: string | undefined;
                    policy_uri?: string | undefined;
                    software_id?: string | undefined;
                    software_version?: string | undefined;
                    software_statement?: string | undefined;
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
                    client_id: string;
                    client_secret: string;
                    client_id_issued_at: number;
                    client_secret_expires_at: number;
                    redirect_uris: string[];
                    token_endpoint_auth_method: "none" | "client_secret_basic" | "client_secret_post";
                    grant_types: string[];
                    response_types: string[];
                    client_name: string | undefined;
                    client_uri: string | undefined;
                    logo_uri: string | undefined;
                    scope: string | undefined;
                    contacts: string[] | undefined;
                    tos_uri: string | undefined;
                    policy_uri: string | undefined;
                    jwks_uri: string | undefined;
                    jwks: Record<string, any> | undefined;
                    software_id: string | undefined;
                    software_version: string | undefined;
                    software_statement: string | undefined;
                    metadata: Record<string, any> | undefined;
                };
            } : {
                client_id: string;
                client_secret: string;
                client_id_issued_at: number;
                client_secret_expires_at: number;
                redirect_uris: string[];
                token_endpoint_auth_method: "none" | "client_secret_basic" | "client_secret_post";
                grant_types: string[];
                response_types: string[];
                client_name: string | undefined;
                client_uri: string | undefined;
                logo_uri: string | undefined;
                scope: string | undefined;
                contacts: string[] | undefined;
                tos_uri: string | undefined;
                policy_uri: string | undefined;
                jwks_uri: string | undefined;
                jwks: Record<string, any> | undefined;
                software_id: string | undefined;
                software_version: string | undefined;
                software_statement: string | undefined;
                metadata: Record<string, any> | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    redirect_uris: z.ZodArray<z.ZodString, "many">;
                    token_endpoint_auth_method: z.ZodOptional<z.ZodDefault<z.ZodEnum<["none", "client_secret_basic", "client_secret_post"]>>>;
                    grant_types: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<["authorization_code", "implicit", "password", "client_credentials", "refresh_token", "urn:ietf:params:oauth:grant-type:jwt-bearer", "urn:ietf:params:oauth:grant-type:saml2-bearer"]>, "many">>>;
                    response_types: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<["code", "token"]>, "many">>>;
                    client_name: z.ZodOptional<z.ZodString>;
                    client_uri: z.ZodOptional<z.ZodString>;
                    logo_uri: z.ZodOptional<z.ZodString>;
                    scope: z.ZodOptional<z.ZodString>;
                    contacts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    tos_uri: z.ZodOptional<z.ZodString>;
                    policy_uri: z.ZodOptional<z.ZodString>;
                    jwks_uri: z.ZodOptional<z.ZodString>;
                    jwks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                    software_id: z.ZodOptional<z.ZodString>;
                    software_version: z.ZodOptional<z.ZodString>;
                    software_statement: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    redirect_uris: string[];
                    metadata?: Record<string, any> | undefined;
                    scope?: string | undefined;
                    jwks?: Record<string, any> | undefined;
                    jwks_uri?: string | undefined;
                    token_endpoint_auth_method?: "none" | "client_secret_basic" | "client_secret_post" | undefined;
                    grant_types?: ("password" | "refresh_token" | "authorization_code" | "implicit" | "client_credentials" | "urn:ietf:params:oauth:grant-type:jwt-bearer" | "urn:ietf:params:oauth:grant-type:saml2-bearer")[] | undefined;
                    response_types?: ("code" | "token")[] | undefined;
                    client_name?: string | undefined;
                    client_uri?: string | undefined;
                    logo_uri?: string | undefined;
                    contacts?: string[] | undefined;
                    tos_uri?: string | undefined;
                    policy_uri?: string | undefined;
                    software_id?: string | undefined;
                    software_version?: string | undefined;
                    software_statement?: string | undefined;
                }, {
                    redirect_uris: string[];
                    metadata?: Record<string, any> | undefined;
                    scope?: string | undefined;
                    jwks?: Record<string, any> | undefined;
                    jwks_uri?: string | undefined;
                    token_endpoint_auth_method?: "none" | "client_secret_basic" | "client_secret_post" | undefined;
                    grant_types?: ("password" | "refresh_token" | "authorization_code" | "implicit" | "client_credentials" | "urn:ietf:params:oauth:grant-type:jwt-bearer" | "urn:ietf:params:oauth:grant-type:saml2-bearer")[] | undefined;
                    response_types?: ("code" | "token")[] | undefined;
                    client_name?: string | undefined;
                    client_uri?: string | undefined;
                    logo_uri?: string | undefined;
                    contacts?: string[] | undefined;
                    tos_uri?: string | undefined;
                    policy_uri?: string | undefined;
                    software_id?: string | undefined;
                    software_version?: string | undefined;
                    software_statement?: string | undefined;
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
                                                name: {
                                                    type: string;
                                                    description: string;
                                                };
                                                icon: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                metadata: {
                                                    type: string;
                                                    additionalProperties: boolean;
                                                    nullable: boolean;
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
                                                redirectURLs: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        format: string;
                                                    };
                                                    description: string;
                                                };
                                                type: {
                                                    type: string;
                                                    description: string;
                                                    enum: string[];
                                                };
                                                authenticationScheme: {
                                                    type: string;
                                                    description: string;
                                                    enum: string[];
                                                };
                                                disabled: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
                                                };
                                                userId: {
                                                    type: string;
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
            path: "/mcp/register";
        };
        getMcpSession: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
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
                headers: HeadersInit;
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
                response: OAuthAccessToken | null;
            } : OAuthAccessToken | null>;
            options: {
                method: "GET";
                requireHeaders: true;
            } & {
                use: any[];
            };
            path: "/mcp/get-session";
        };
    };
    schema: {
        oauthApplication: {
            modelName: string;
            fields: {
                name: {
                    type: "string";
                };
                icon: {
                    type: "string";
                    required: false;
                };
                metadata: {
                    type: "string";
                    required: false;
                };
                clientId: {
                    type: "string";
                    unique: true;
                };
                clientSecret: {
                    type: "string";
                };
                redirectURLs: {
                    type: "string";
                };
                type: {
                    type: "string";
                };
                disabled: {
                    type: "boolean";
                    required: false;
                    defaultValue: false;
                };
                userId: {
                    type: "string";
                    required: false;
                };
                createdAt: {
                    type: "date";
                };
                updatedAt: {
                    type: "date";
                };
            };
        };
        oauthAccessToken: {
            modelName: string;
            fields: {
                accessToken: {
                    type: "string";
                    unique: true;
                };
                refreshToken: {
                    type: "string";
                    unique: true;
                };
                accessTokenExpiresAt: {
                    type: "date";
                };
                refreshTokenExpiresAt: {
                    type: "date";
                };
                clientId: {
                    type: "string";
                };
                userId: {
                    type: "string";
                    required: false;
                };
                scopes: {
                    type: "string";
                };
                createdAt: {
                    type: "date";
                };
                updatedAt: {
                    type: "date";
                };
            };
        };
        oauthConsent: {
            modelName: string;
            fields: {
                clientId: {
                    type: "string";
                };
                userId: {
                    type: "string";
                };
                scopes: {
                    type: "string";
                };
                createdAt: {
                    type: "date";
                };
                updatedAt: {
                    type: "date";
                };
                consentGiven: {
                    type: "boolean";
                };
            };
        };
    };
};
declare const withMcpAuth: <Auth extends {
    api: {
        getMcpSession: (...args: any) => Promise<OAuthAccessToken | null>;
    };
}>(auth: Auth, handler: (req: Request, sesssion: OAuthAccessToken) => Response | Promise<Response>) => (req: Request) => Promise<Response>;
declare const oAuthDiscoveryMetadata: <Auth extends {
    api: {
        getMcpOAuthConfig: (...args: any) => any;
    };
}>(auth: Auth) => (request: Request) => Promise<Response>;

export { OAuthAccessToken, OIDCMetadata, OIDCOptions, getMCPProviderMetadata, mcp, oAuthDiscoveryMetadata, withMcpAuth };
