import { AccessControl, Role, Statements } from '../access/index.js';
import * as better_call from 'better-call';
import { z } from 'zod';
import { I as InferOptionSchema, G as GenericEndpointContext, H as HookEndpointContext, S as Session, U as User } from '../../shared/better-auth.BNRr97iY.js';
import '../../shared/better-auth.Bi8FQwDD.js';
import '../../shared/better-auth.ByC0y0O-.js';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface UserWithRole extends User {
    role?: string;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
}
interface SessionWithImpersonatedBy extends Session {
    impersonatedBy?: string;
}
interface AdminOptions {
    /**
     * The default role for a user
     *
     * @default "user"
     */
    defaultRole?: string;
    /**
     * Roles that are considered admin roles.
     *
     * Any user role that isn't in this list, even if they have the permission,
     * will not be considered an admin.
     *
     * @default ["admin"]
     */
    adminRoles?: string | string[];
    /**
     * A default ban reason
     *
     * By default, no reason is provided
     */
    defaultBanReason?: string;
    /**
     * Number of seconds until the ban expires
     *
     * By default, the ban never expires
     */
    defaultBanExpiresIn?: number;
    /**
     * Duration of the impersonation session in seconds
     *
     * By default, the impersonation session lasts 1 hour
     */
    impersonationSessionDuration?: number;
    /**
     * Custom schema for the admin plugin
     */
    schema?: InferOptionSchema<typeof schema>;
    /**
     * Configure the roles and permissions for the admin
     * plugin.
     */
    ac?: AccessControl;
    /**
     * Custom permissions for roles.
     */
    roles?: {
        [key in string]?: Role;
    };
    /**
     * List of user ids that should have admin access
     *
     * If this is set, the `adminRole` option is ignored
     */
    adminUserIds?: string[];
    /**
     * Message to show when a user is banned
     *
     * By default, the message is "You have been banned from this application"
     */
    bannedUserMessage?: string;
}
type InferAdminRolesFromOption<O extends AdminOptions | undefined> = O extends {
    roles: Record<string, unknown>;
} ? keyof O["roles"] : "user" | "admin";
declare const admin: <O extends AdminOptions>(options?: O) => {
    id: "admin";
    init(): {
        options: {
            databaseHooks: {
                user: {
                    create: {
                        before(user: {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        }): Promise<{
                            data: {
                                id: string;
                                name: string;
                                email: string;
                                emailVerified: boolean;
                                createdAt: Date;
                                updatedAt: Date;
                                image?: string | null | undefined;
                                role: string;
                            };
                        }>;
                    };
                };
                session: {
                    create: {
                        before(session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        }, ctx: GenericEndpointContext | undefined): Promise<void>;
                    };
                };
            };
        };
    };
    hooks: {
        after: {
            matcher(context: HookEndpointContext): boolean;
            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<SessionWithImpersonatedBy[] | undefined>;
        }[];
    };
    endpoints: {
        setRole: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                    role: InferAdminRolesFromOption<O> | InferAdminRolesFromOption<O>[];
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
                    user: UserWithRole;
                };
            } : {
                user: UserWithRole;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                }, {
                    userId: string;
                    role: string | string[];
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferAdminRolesFromOption<O> | InferAdminRolesFromOption<O>[];
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/set-role";
        };
        createUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    password: string;
                    name: string;
                    role?: InferAdminRolesFromOption<O> | InferAdminRolesFromOption<O>[];
                    data?: Record<string, any>;
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
                    user: UserWithRole;
                };
            } : {
                user: UserWithRole;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    email: z.ZodString;
                    password: z.ZodString;
                    name: z.ZodString;
                    role: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                    /**
                     * extra fields for user
                     */
                    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                }, "strip", z.ZodTypeAny, {
                    password: string;
                    name: string;
                    email: string;
                    data?: Record<string, any> | undefined;
                    role?: string | string[] | undefined;
                }, {
                    password: string;
                    name: string;
                    email: string;
                    data?: Record<string, any> | undefined;
                    role?: string | string[] | undefined;
                }>;
                metadata: {
                    openapi: {
                        operationId: string;
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
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            email: string;
                            password: string;
                            name: string;
                            role?: InferAdminRolesFromOption<O> | InferAdminRolesFromOption<O>[];
                            data?: Record<string, any>;
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/create-user";
        };
        listUsers: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    searchValue?: string | undefined;
                    searchField?: "name" | "email" | undefined;
                    searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
                    limit?: string | number | undefined;
                    offset?: string | number | undefined;
                    sortBy?: string | undefined;
                    sortDirection?: "asc" | "desc" | undefined;
                    filterField?: string | undefined;
                    filterValue?: string | number | boolean | undefined;
                    filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | undefined;
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
                    users: UserWithRole[];
                    total: number;
                    limit: number | undefined;
                    offset: number | undefined;
                } | {
                    users: never[];
                    total: number;
                };
            } : {
                users: UserWithRole[];
                total: number;
                limit: number | undefined;
                offset: number | undefined;
            } | {
                users: never[];
                total: number;
            }>;
            options: {
                method: "GET";
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                query: z.ZodObject<{
                    searchValue: z.ZodOptional<z.ZodString>;
                    searchField: z.ZodOptional<z.ZodEnum<["email", "name"]>>;
                    searchOperator: z.ZodOptional<z.ZodEnum<["contains", "starts_with", "ends_with"]>>;
                    limit: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
                    offset: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
                    sortBy: z.ZodOptional<z.ZodString>;
                    sortDirection: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
                    filterField: z.ZodOptional<z.ZodString>;
                    filterValue: z.ZodOptional<z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodNumber]>, z.ZodBoolean]>>;
                    filterOperator: z.ZodOptional<z.ZodEnum<["eq", "ne", "lt", "lte", "gt", "gte"]>>;
                }, "strip", z.ZodTypeAny, {
                    searchValue?: string | undefined;
                    searchField?: "name" | "email" | undefined;
                    searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
                    limit?: string | number | undefined;
                    offset?: string | number | undefined;
                    sortBy?: string | undefined;
                    sortDirection?: "asc" | "desc" | undefined;
                    filterField?: string | undefined;
                    filterValue?: string | number | boolean | undefined;
                    filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | undefined;
                }, {
                    searchValue?: string | undefined;
                    searchField?: "name" | "email" | undefined;
                    searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
                    limit?: string | number | undefined;
                    offset?: string | number | undefined;
                    sortBy?: string | undefined;
                    sortDirection?: "asc" | "desc" | undefined;
                    filterField?: string | undefined;
                    filterValue?: string | number | boolean | undefined;
                    filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | undefined;
                }>;
                metadata: {
                    openapi: {
                        operationId: string;
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
                                                users: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                                total: {
                                                    type: string;
                                                };
                                                limit: {
                                                    type: string;
                                                };
                                                offset: {
                                                    type: string;
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
            path: "/admin/list-users";
        };
        listUserSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
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
                    sessions: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    }[];
                };
            } : {
                sessions: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                }[];
            }>;
            options: {
                method: "POST";
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                body: z.ZodObject<{
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                metadata: {
                    openapi: {
                        operationId: string;
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
                                                sessions: {
                                                    type: string;
                                                    items: {
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
            } & {
                use: any[];
            };
            path: "/admin/list-user-sessions";
        };
        unbanUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
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
                    user: any;
                };
            } : {
                user: any;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
            path: "/admin/unban-user";
        };
        banUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                    banReason?: string | undefined;
                    banExpiresIn?: number | undefined;
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
                    user: any;
                };
            } : {
                user: any;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    /**
                     * Reason for the ban
                     */
                    banReason: z.ZodOptional<z.ZodString>;
                    /**
                     * Number of seconds until the ban expires
                     */
                    banExpiresIn: z.ZodOptional<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    banReason?: string | undefined;
                    banExpiresIn?: number | undefined;
                }, {
                    userId: string;
                    banReason?: string | undefined;
                    banExpiresIn?: number | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
            path: "/admin/ban-user";
        };
        impersonateUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
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
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        emailVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        image?: string | null | undefined;
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
                user: {
                    id: string;
                    name: string;
                    email: string;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | null | undefined;
                };
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
                };
            } & {
                use: any[];
            };
            path: "/admin/impersonate-user";
        };
        stopImpersonating: {
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
                    session: Session & Record<string, any>;
                    user: User & Record<string, any>;
                };
            } : {
                session: Session & Record<string, any>;
                user: User & Record<string, any>;
            }>;
            options: {
                method: "POST";
            } & {
                use: any[];
            };
            path: "/admin/stop-impersonating";
        };
        revokeUserSession: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    sessionToken: string;
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
                    sessionToken: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    sessionToken: string;
                }, {
                    sessionToken: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
            path: "/admin/revoke-user-session";
        };
        revokeUserSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
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
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
            path: "/admin/revoke-user-sessions";
        };
        removeUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
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
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
            path: "/admin/remove-user";
        };
        setUserPassword: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                    newPassword: string;
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
                    newPassword: z.ZodString;
                    userId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    newPassword: string;
                }, {
                    userId: string;
                    newPassword: string;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    session: {
                        user: UserWithRole;
                        session: Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
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
            path: "/admin/set-user-password";
        };
        userHasPermission: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: ({
                    /**
                     * @deprecated Use `permissions` instead
                     */
                    permission: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    })[key][number] : never)[] | undefined; };
                    permissions?: never;
                } | {
                    permissions: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    })[key][number] : never)[] | undefined; };
                    permission?: never;
                }) & {
                    userId?: string;
                    role?: InferAdminRolesFromOption<O>;
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
                    error: null;
                    success: boolean;
                };
            } : {
                error: null;
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodIntersection<z.ZodObject<{
                    userId: z.ZodOptional<z.ZodString>;
                    role: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId?: string | undefined;
                    role?: string | undefined;
                }, {
                    userId?: string | undefined;
                    role?: string | undefined;
                }>, z.ZodUnion<[z.ZodObject<{
                    permission: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
                    permissions: z.ZodUndefined;
                }, "strip", z.ZodTypeAny, {
                    permission: Record<string, string[]>;
                    permissions?: undefined;
                }, {
                    permission: Record<string, string[]>;
                    permissions?: undefined;
                }>, z.ZodObject<{
                    permission: z.ZodUndefined;
                    permissions: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
                }, "strip", z.ZodTypeAny, {
                    permissions: Record<string, string[]>;
                    permission?: undefined;
                }, {
                    permissions: Record<string, string[]>;
                    permission?: undefined;
                }>]>>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            permission: {
                                                type: string;
                                                description: string;
                                                deprecated: boolean;
                                            };
                                            permissions: {
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
                                                error: {
                                                    type: string;
                                                };
                                                success: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: ({
                            /**
                             * @deprecated Use `permissions` instead
                             */
                            permission: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                                readonly session: readonly ["list", "revoke", "delete"];
                            })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                                readonly session: readonly ["list", "revoke", "delete"];
                            })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                                readonly session: readonly ["list", "revoke", "delete"];
                            })[key][number] : never)[] | undefined; };
                            permissions?: never;
                        } | {
                            permissions: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                                readonly session: readonly ["list", "revoke", "delete"];
                            })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                                readonly session: readonly ["list", "revoke", "delete"];
                            })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
                                readonly session: readonly ["list", "revoke", "delete"];
                            })[key][number] : never)[] | undefined; };
                            permission?: never;
                        }) & {
                            userId?: string;
                            role?: InferAdminRolesFromOption<O>;
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/has-permission";
        };
    };
    $ERROR_CODES: {
        readonly FAILED_TO_CREATE_USER: "Failed to create user";
        readonly USER_ALREADY_EXISTS: "User already exists";
        readonly YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself";
        readonly YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role";
        readonly YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users";
        readonly YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users";
        readonly YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions";
        readonly YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users";
        readonly YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users";
        readonly YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions";
        readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users";
        readonly YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password";
        readonly BANNED_USER: "You have been banned from this application";
    };
    schema: {
        user: {
            fields: {
                role: {
                    type: "string";
                    required: false;
                    input: false;
                };
                banned: {
                    type: "boolean";
                    defaultValue: false;
                    required: false;
                    input: false;
                };
                banReason: {
                    type: "string";
                    required: false;
                    input: false;
                };
                banExpires: {
                    type: "date";
                    required: false;
                    input: false;
                };
            };
        };
        session: {
            fields: {
                impersonatedBy: {
                    type: "string";
                    required: false;
                };
            };
        };
    };
};
declare const schema: {
    user: {
        fields: {
            role: {
                type: "string";
                required: false;
                input: false;
            };
            banned: {
                type: "boolean";
                defaultValue: false;
                required: false;
                input: false;
            };
            banReason: {
                type: "string";
                required: false;
                input: false;
            };
            banExpires: {
                type: "date";
                required: false;
                input: false;
            };
        };
    };
    session: {
        fields: {
            impersonatedBy: {
                type: "string";
                required: false;
            };
        };
    };
};

export { type AdminOptions, type InferAdminRolesFromOption, type SessionWithImpersonatedBy, type UserWithRole, admin };
