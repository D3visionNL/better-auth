import { Role, AccessControl, Statements } from '../access/index.cjs';
import { z, ZodLiteral } from 'zod';
import * as better_call from 'better-call';
import { G as GenericEndpointContext, S as Session, U as User, p as AuthContext } from '../../shared/better-auth.C67OuOdK.cjs';
import { defaultRoles } from './access/index.cjs';
export { adminAc, defaultAc, defaultStatements, memberAc, ownerAc } from './access/index.cjs';
import '../../shared/better-auth.Bi8FQwDD.cjs';
import '../../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

declare const role: z.ZodString;
declare const invitationStatus: z.ZodDefault<z.ZodEnum<["pending", "accepted", "rejected", "canceled"]>>;
declare const organizationSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    logo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    metadata: z.ZodOptional<z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodString>, z.ZodEffects<z.ZodString, any, string>]>>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    metadata?: any;
    logo?: string | null | undefined;
}, {
    name: string;
    createdAt: Date;
    slug: string;
    metadata?: string | Record<string, string> | undefined;
    id?: string | undefined;
    logo?: string | null | undefined;
}>;
declare const memberSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    organizationId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodString;
    createdAt: z.ZodDefault<z.ZodDate>;
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    organizationId: string;
    role: string;
    teamId?: string | undefined;
}, {
    userId: string;
    organizationId: string;
    role: string;
    id?: string | undefined;
    createdAt?: Date | undefined;
    teamId?: string | undefined;
}>;
declare const invitationSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    organizationId: z.ZodString;
    email: z.ZodString;
    role: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["pending", "accepted", "rejected", "canceled"]>>;
    teamId: z.ZodOptional<z.ZodString>;
    inviterId: z.ZodString;
    expiresAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    status: "pending" | "accepted" | "rejected" | "canceled";
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
    teamId?: string | undefined;
}, {
    email: string;
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
    id?: string | undefined;
    status?: "pending" | "accepted" | "rejected" | "canceled" | undefined;
    teamId?: string | undefined;
}>;
declare const teamSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodString>;
    name: z.ZodString;
    organizationId: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    organizationId: string;
    updatedAt?: Date | undefined;
}, {
    name: string;
    createdAt: Date;
    organizationId: string;
    id?: string | undefined;
    updatedAt?: Date | undefined;
}>;
type Organization = z.infer<typeof organizationSchema>;
type Member = z.infer<typeof memberSchema>;
type Team = z.infer<typeof teamSchema>;
type Invitation = z.infer<typeof invitationSchema>;
type InvitationInput = z.input<typeof invitationSchema>;
type MemberInput = z.input<typeof memberSchema>;
type OrganizationInput = z.input<typeof organizationSchema>;
type TeamInput = z.infer<typeof teamSchema>;
type InferOrganizationZodRolesFromOption<O extends OrganizationOptions | undefined> = ZodLiteral<O extends {
    roles: {
        [key: string]: any;
    };
} ? keyof O["roles"] | (keyof O["roles"])[] : "admin" | "member" | "owner" | ("admin" | "member" | "owner")[]>;
type InferOrganizationRolesFromOption<O extends OrganizationOptions | undefined> = O extends {
    roles: any;
} ? keyof O["roles"] : "admin" | "member" | "owner";
type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled";
type InferMember<O extends OrganizationOptions> = O["teams"] extends {
    enabled: true;
} ? {
    id: string;
    organizationId: string;
    role: InferOrganizationRolesFromOption<O>;
    createdAt: Date;
    userId: string;
    teamId?: string;
    user: {
        email: string;
        name: string;
        image?: string;
    };
} : {
    id: string;
    organizationId: string;
    role: InferOrganizationRolesFromOption<O>;
    createdAt: Date;
    userId: string;
    user: {
        email: string;
        name: string;
        image?: string;
    };
};
type InferInvitation<O extends OrganizationOptions> = O["teams"] extends {
    enabled: true;
} ? {
    id: string;
    organizationId: string;
    email: string;
    role: InferOrganizationRolesFromOption<O>;
    status: InvitationStatus;
    inviterId: string;
    expiresAt: Date;
    teamId?: string;
} : {
    id: string;
    organizationId: string;
    email: string;
    role: InferOrganizationRolesFromOption<O>;
    status: InvitationStatus;
    inviterId: string;
    expiresAt: Date;
};

declare const getFullOrganization: <O extends OrganizationOptions>() => {
    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
        body?: undefined;
    } & {
        method?: "GET" | undefined;
    } & {
        query?: {
            organizationId?: string | undefined;
            organizationSlug?: string | undefined;
        } | undefined;
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
        response: (O["teams"] extends {
            enabled: true;
        } ? {
            members: InferMember<O>[];
            invitations: InferInvitation<O>[];
            teams: Team[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            metadata?: any;
            logo?: string | null | undefined;
        } : {
            members: InferMember<O>[];
            invitations: InferInvitation<O>[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            metadata?: any;
            logo?: string | null | undefined;
        }) | null;
    } : (O["teams"] extends {
        enabled: true;
    } ? {
        members: InferMember<O>[];
        invitations: InferInvitation<O>[];
        teams: Team[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        metadata?: any;
        logo?: string | null | undefined;
    } : {
        members: InferMember<O>[];
        invitations: InferInvitation<O>[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        metadata?: any;
        logo?: string | null | undefined;
    }) | null>;
    options: {
        method: "GET";
        query: z.ZodOptional<z.ZodObject<{
            organizationId: z.ZodOptional<z.ZodString>;
            organizationSlug: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            organizationId?: string | undefined;
            organizationSlug?: string | undefined;
        }, {
            organizationId?: string | undefined;
            organizationSlug?: string | undefined;
        }>>;
        requireHeaders: true;
        use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
            orgOptions: OrganizationOptions;
            roles: typeof defaultRoles & {
                [key: string]: Role<{}>;
            };
            getSession: (context: GenericEndpointContext) => Promise<{
                session: Session & {
                    activeOrganizationId?: string;
                };
                user: User;
            }>;
        }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
        }>) => Promise<{
            session: {
                session: Session & {
                    activeOrganizationId?: string;
                };
                user: User;
            };
        }>))[];
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
                                    description: string;
                                    $ref: string;
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
    path: "/organization/get-full-organization";
};

declare function parseRoles(roles: string | string[]): string;
interface OrganizationOptions {
    /**
     * Configure whether new users are able to create new organizations.
     * You can also pass a function that returns a boolean.
     *
     * 	@example
     * ```ts
     * allowUserToCreateOrganization: async (user) => {
     * 		const plan = await getUserPlan(user);
     *      return plan.name === "pro";
     * }
     * ```
     * @default true
     */
    allowUserToCreateOrganization?: boolean | ((user: User) => Promise<boolean> | boolean);
    /**
     * The maximum number of organizations a user can create.
     *
     * You can also pass a function that returns a boolean
     */
    organizationLimit?: number | ((user: User) => Promise<boolean> | boolean);
    /**
     * The role that is assigned to the creator of the
     * organization.
     *
     * @default "owner"
     */
    creatorRole?: string;
    /**
     * The number of memberships a user can have in an organization.
     *
     * @default 100
     */
    membershipLimit?: number;
    /**
     * Configure the roles and permissions for the
     * organization plugin.
     */
    ac?: AccessControl;
    /**
     * Custom permissions for roles.
     */
    roles?: {
        [key in string]?: Role<any>;
    };
    /**
     * Support for team.
     */
    teams?: {
        /**
         * Enable team features.
         */
        enabled: boolean;
        /**
         * Default team configuration
         */
        defaultTeam?: {
            /**
             * Enable creating a default team when an organization is created
             *
             * @default true
             */
            enabled: boolean;
            /**
             * Pass a custom default team creator function
             */
            customCreateDefaultTeam?: (organization: Organization & Record<string, any>, request?: Request) => Promise<Team & Record<string, any>>;
        };
        /**
         * Maximum number of teams an organization can have.
         *
         * You can pass a number or a function that returns a number
         *
         * @default "unlimited"
         *
         * @param organization
         * @param request
         * @returns
         */
        maximumTeams?: ((data: {
            organizationId: string;
            session: {
                user: User;
                session: Session;
            } | null;
        }, request?: Request) => number | Promise<number>) | number;
        /**
         * By default, if an organization does only have one team, they'll not be able to remove it.
         *
         * You can disable this behavior by setting this to `false.
         *
         * @default false
         */
        allowRemovingAllTeams?: boolean;
    };
    /**
     * The expiration time for the invitation link.
     *
     * @default 48 hours
     */
    invitationExpiresIn?: number;
    /**
     * The maximum invitation a user can send.
     *
     * @default 100
     */
    invitationLimit?: number | ((data: {
        user: User;
        organization: Organization;
        member: Member;
    }, ctx: AuthContext) => Promise<number> | number);
    /**
     * Cancel pending invitations on re-invite.
     *
     * @default true
     */
    cancelPendingInvitationsOnReInvite?: boolean;
    /**
     * Send an email with the
     * invitation link to the user.
     *
     * Note: Better Auth doesn't
     * generate invitation URLs.
     * You'll need to construct the
     * URL using the invitation ID
     * and pass it to the
     * acceptInvitation endpoint for
     * the user to accept the
     * invitation.
     *
     * @example
     * ```ts
     * sendInvitationEmail: async (data) => {
     * 	const url = `https://yourapp.com/organization/
     * accept-invitation?id=${data.id}`;
     * 	await sendEmail(data.email, "Invitation to join
     * organization", `Click the link to join the
     * organization: ${url}`);
     * }
     * ```
     */
    sendInvitationEmail?: (data: {
        /**
         * the invitation id
         */
        id: string;
        /**
         * the role of the user
         */
        role: string;
        /**
         * the email of the user
         */
        email: string;
        /**
         * the organization the user is invited to join
         */
        organization: Organization;
        /**
         * the invitation object
         */
        invitation: Invitation;
        /**
         * the member who is inviting the user
         */
        inviter: Member & {
            user: User;
        };
    }, 
    /**
     * The request object
     */
    request?: Request) => Promise<void>;
    /**
     * The schema for the organization plugin.
     */
    schema?: {
        session?: {
            fields?: {
                activeOrganizationId?: string;
            };
        };
        organization?: {
            modelName?: string;
            fields?: {
                [key in keyof Omit<Organization, "id">]?: string;
            };
        };
        member?: {
            modelName?: string;
            fields?: {
                [key in keyof Omit<Member, "id">]?: string;
            };
        };
        invitation?: {
            modelName?: string;
            fields?: {
                [key in keyof Omit<Invitation, "id">]?: string;
            };
        };
        team?: {
            modelName?: string;
            fields?: {
                [key in keyof Omit<Team, "id">]?: string;
            };
        };
    };
    /**
     * Configure how organization deletion is handled
     */
    organizationDeletion?: {
        /**
         * disable deleting organization
         */
        disabled?: boolean;
        /**
         * A callback that runs before the organization is
         * deleted
         *
         * @param data - organization and user object
         * @param request - the request object
         * @returns
         */
        beforeDelete?: (data: {
            organization: Organization;
            user: User;
        }, request?: Request) => Promise<void>;
        /**
         * A callback that runs after the organization is
         * deleted
         *
         * @param data - organization and user object
         * @param request - the request object
         * @returns
         */
        afterDelete?: (data: {
            organization: Organization;
            user: User;
        }, request?: Request) => Promise<void>;
    };
    organizationCreation?: {
        disabled?: boolean;
        beforeCreate?: (data: {
            organization: Omit<Organization, "id">;
            user: User;
        }, request?: Request) => Promise<void | {
            data: Omit<Organization, "id">;
        }>;
        afterCreate?: (data: {
            organization: Organization;
            member: Member;
            user: User;
        }, request?: Request) => Promise<void>;
    };
}
/**
 * Organization plugin for Better Auth. Organization allows you to create teams, members,
 * and manage access control for your users.
 *
 * @example
 * ```ts
 * const auth = betterAuth({
 * 	plugins: [
 * 		organization({
 * 			allowUserToCreateOrganization: true,
 * 		}),
 * 	],
 * });
 * ```
 */
declare const organization: <O extends OrganizationOptions>(options?: O) => {
    id: "organization";
    endpoints: (O["teams"] extends {
        enabled: true;
    } ? {
        createTeam: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    name: string;
                    organizationId?: string | undefined;
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
                    id: string;
                    name: string;
                    createdAt: Date;
                    organizationId: string;
                    updatedAt?: Date | undefined;
                };
            } : {
                id: string;
                name: string;
                createdAt: Date;
                organizationId: string;
                updatedAt?: Date | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    organizationId?: string | undefined;
                }, {
                    name: string;
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                                id: {
                                                    type: string;
                                                    description: string;
                                                };
                                                name: {
                                                    type: string;
                                                    description: string;
                                                };
                                                organizationId: {
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
            path: "/organization/create-team";
        };
        listOrganizationTeams: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    organizationId?: string | undefined;
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
                response: unknown[] | null;
            } : unknown[] | null>;
            options: {
                method: "GET";
                query: z.ZodOptional<z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | undefined;
                }, {
                    organizationId?: string | undefined;
                }>>;
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
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    name: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                    organizationId: {
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
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
            } & {
                use: any[];
            };
            path: "/organization/list-teams";
        };
        removeTeam: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    teamId: string;
                    organizationId?: string | undefined;
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
                } | null;
            } : {
                message: string;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    teamId: z.ZodString;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    teamId: string;
                    organizationId?: string | undefined;
                }, {
                    teamId: string;
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                                message: {
                                                    type: string;
                                                    description: string;
                                                    enum: string[];
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
            path: "/organization/remove-team";
        };
        updateTeam: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    data: {
                        id?: string | undefined;
                        name?: string | undefined;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                        organizationId?: string | undefined;
                    };
                    teamId: string;
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
                    id: string;
                    name: string;
                    createdAt: Date;
                    organizationId: string;
                    updatedAt?: Date | undefined;
                } | null;
            } : {
                id: string;
                name: string;
                createdAt: Date;
                organizationId: string;
                updatedAt?: Date | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    teamId: z.ZodString;
                    data: z.ZodObject<{
                        id: z.ZodOptional<z.ZodDefault<z.ZodString>>;
                        name: z.ZodOptional<z.ZodString>;
                        organizationId: z.ZodOptional<z.ZodString>;
                        createdAt: z.ZodOptional<z.ZodDate>;
                        updatedAt: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
                    }, "strip", z.ZodTypeAny, {
                        id?: string | undefined;
                        name?: string | undefined;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                        organizationId?: string | undefined;
                    }, {
                        id?: string | undefined;
                        name?: string | undefined;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                        organizationId?: string | undefined;
                    }>;
                }, "strip", z.ZodTypeAny, {
                    data: {
                        id?: string | undefined;
                        name?: string | undefined;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                        organizationId?: string | undefined;
                    };
                    teamId: string;
                }, {
                    data: {
                        id?: string | undefined;
                        name?: string | undefined;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                        organizationId?: string | undefined;
                    };
                    teamId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                id: {
                                                    type: string;
                                                    description: string;
                                                };
                                                name: {
                                                    type: string;
                                                    description: string;
                                                };
                                                organizationId: {
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
            path: "/organization/update-team";
        };
    } & {
        createOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    name: string;
                    slug: string;
                    metadata?: Record<string, any> | undefined;
                    userId?: string | undefined;
                    logo?: string | undefined;
                    keepCurrentActiveOrganization?: boolean | undefined;
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
                    metadata: Record<string, any> | undefined;
                    members: {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string;
                        role: string;
                        teamId?: string | undefined;
                    }[];
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    logo?: string | null | undefined;
                } | null;
            } : {
                metadata: Record<string, any> | undefined;
                members: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                }[];
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                logo?: string | null | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    name: z.ZodString;
                    slug: z.ZodString;
                    userId: z.ZodOptional<z.ZodString>;
                    logo: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                    keepCurrentActiveOrganization: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    slug: string;
                    metadata?: Record<string, any> | undefined;
                    userId?: string | undefined;
                    logo?: string | undefined;
                    keepCurrentActiveOrganization?: boolean | undefined;
                }, {
                    name: string;
                    slug: string;
                    metadata?: Record<string, any> | undefined;
                    userId?: string | undefined;
                    logo?: string | undefined;
                    keepCurrentActiveOrganization?: boolean | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/create";
        };
        updateOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    data: {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    };
                    organizationId?: string | undefined;
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
                response: {
                    metadata: Record<string, any> | undefined;
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    logo?: string | null | undefined;
                } | null;
            } : {
                metadata: Record<string, any> | undefined;
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                logo?: string | null | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    data: z.ZodObject<{
                        name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        logo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
                    }, "strip", z.ZodTypeAny, {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    }, {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    }>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    data: {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    };
                    organizationId?: string | undefined;
                }, {
                    data: {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    };
                    organizationId?: string | undefined;
                }>;
                requireHeaders: true;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/update";
        };
        deleteOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    organizationId: string;
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
                response: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                } | null;
            } : {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    organizationId: string;
                }, {
                    organizationId: string;
                }>;
                requireHeaders: true;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                            type: "string";
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
            path: "/organization/delete";
        };
        setActiveOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    organizationId?: string | null | undefined;
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
                response: (O["teams"] extends {
                    enabled: true;
                } ? {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                    teams: Team[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                } : {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                }) | null;
            } : (O["teams"] extends {
                enabled: true;
            } ? {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
                teams: Team[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } : {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }) | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    organizationSlug: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | null | undefined;
                    organizationSlug?: string | undefined;
                }, {
                    organizationId?: string | null | undefined;
                    organizationSlug?: string | undefined;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/set-active";
        };
        getFullOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    organizationId?: string | undefined;
                    organizationSlug?: string | undefined;
                } | undefined;
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
                response: (O["teams"] extends {
                    enabled: true;
                } ? {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                    teams: Team[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                } : {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                }) | null;
            } : (O["teams"] extends {
                enabled: true;
            } ? {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
                teams: Team[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } : {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }) | null>;
            options: {
                method: "GET";
                query: z.ZodOptional<z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                    organizationSlug: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | undefined;
                    organizationSlug?: string | undefined;
                }, {
                    organizationId?: string | undefined;
                    organizationSlug?: string | undefined;
                }>>;
                requireHeaders: true;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/get-full-organization";
        };
        listOrganizations: {
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
                response: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                }[];
            } : {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }[]>;
            options: {
                method: "GET";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
            path: "/organization/list";
        };
        createInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(...inputCtx: better_call.HasRequiredKeys<better_call.InputContext<"/organization/invite-member", {
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            }>> extends true ? [better_call.InferBodyInput<{
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            }, {
                email: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
                resend?: boolean;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }] : [((better_call.InferBodyInput<{
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            }, {
                email: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
                resend?: boolean;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }) | undefined)?]): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                };
            } : {
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            path: "/organization/invite-member";
        };
        cancelInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    invitationId: string;
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
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                } | null;
            } : {
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: string;
                                        properties: {
                                            invitation: {
                                                type: string;
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
            path: "/organization/cancel-invitation";
        };
        acceptInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    invitationId: string;
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
                    invitation: {
                        id: string;
                        email: string;
                        status: "pending" | "accepted" | "rejected" | "canceled";
                        expiresAt: Date;
                        organizationId: string;
                        role: string;
                        inviterId: string;
                        teamId?: string | undefined;
                    };
                    member: {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string;
                        role: string;
                        teamId?: string | undefined;
                    };
                } | null;
            } : {
                invitation: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                };
                member: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                invitation: {
                                                    type: string;
                                                };
                                                member: {
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
            path: "/organization/accept-invitation";
        };
        getInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    id: string;
                };
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
                response: {
                    organizationName: string;
                    organizationSlug: string;
                    inviterEmail: string;
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                };
            } : {
                organizationName: string;
                organizationSlug: string;
                inviterEmail: string;
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "GET";
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                requireHeaders: true;
                query: z.ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
                                                    type: string;
                                                };
                                                organizationName: {
                                                    type: string;
                                                };
                                                organizationSlug: {
                                                    type: string;
                                                };
                                                inviterEmail: {
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
            path: "/organization/get-invitation";
        };
        rejectInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    invitationId: string;
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
                    invitation: {
                        id: string;
                        email: string;
                        status: "pending" | "accepted" | "rejected" | "canceled";
                        expiresAt: Date;
                        organizationId: string;
                        role: string;
                        inviterId: string;
                        teamId?: string | undefined;
                    } | null;
                    member: null;
                };
            } : {
                invitation: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                } | null;
                member: null;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                invitation: {
                                                    type: string;
                                                };
                                                member: {
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
            path: "/organization/reject-invitation";
        };
        checkOrganizationSlug: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    slug: string;
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
                    slug: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    slug: string;
                }, {
                    slug: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
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
                    } | null;
                }>) | ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>))[];
            } & {
                use: any[];
            };
            path: "/organization/check-slug";
        };
        addMember: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(...inputCtx: better_call.HasRequiredKeys<better_call.InputContext<"/organization/add-member", {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            }>> extends true ? [better_call.InferBodyInput<{
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            }, {
                userId: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }] : [((better_call.InferBodyInput<{
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            }, {
                userId: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }) | undefined)?]): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                } | null;
            } : {
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            };
            path: "/organization/add-member";
        };
        removeMember: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
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
                    member: {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string;
                        role: string;
                        teamId?: string | undefined;
                    };
                } | null;
            } : {
                member: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    memberIdOrEmail: z.ZodString;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                member: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        organizationId: {
                                                            type: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
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
            path: "/organization/remove-member";
        };
        updateMemberRole: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                    memberId: string;
                    organizationId?: string;
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
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } : {
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    memberId: z.ZodString;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    role: string | string[];
                    memberId: string;
                    organizationId?: string | undefined;
                }, {
                    role: string | string[];
                    memberId: string;
                    organizationId?: string | undefined;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                metadata: {
                    $Infer: {
                        body: {
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            memberId: string;
                            organizationId?: string;
                        };
                    };
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
                                                member: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        organizationId: {
                                                            type: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
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
            path: "/organization/update-member-role";
        };
        getActiveMember: {
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
                response: {
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | null | undefined;
                    };
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                } | null;
            } : {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image: string | null | undefined;
                };
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            } | null>;
            options: {
                method: "GET";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                id: {
                                                    type: string;
                                                };
                                                userId: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                role: {
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
            path: "/organization/get-active-member";
        };
        leaveOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    organizationId: string;
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
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | null | undefined;
                    };
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } : {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image: string | null | undefined;
                };
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    organizationId: string;
                }, {
                    organizationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
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
                }>) | ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>))[];
            } & {
                use: any[];
            };
            path: "/organization/leave";
        };
        listInvitations: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    organizationId?: string | undefined;
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
                response: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                }[];
            } : {
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            }[]>;
            options: {
                method: "GET";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                query: z.ZodOptional<z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | undefined;
                }, {
                    organizationId?: string | undefined;
                }>>;
            } & {
                use: any[];
            };
            path: "/organization/list-invitations";
        };
    } : {
        createOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    name: string;
                    slug: string;
                    metadata?: Record<string, any> | undefined;
                    userId?: string | undefined;
                    logo?: string | undefined;
                    keepCurrentActiveOrganization?: boolean | undefined;
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
                    metadata: Record<string, any> | undefined;
                    members: {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string;
                        role: string;
                        teamId?: string | undefined;
                    }[];
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    logo?: string | null | undefined;
                } | null;
            } : {
                metadata: Record<string, any> | undefined;
                members: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                }[];
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                logo?: string | null | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    name: z.ZodString;
                    slug: z.ZodString;
                    userId: z.ZodOptional<z.ZodString>;
                    logo: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                    keepCurrentActiveOrganization: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    slug: string;
                    metadata?: Record<string, any> | undefined;
                    userId?: string | undefined;
                    logo?: string | undefined;
                    keepCurrentActiveOrganization?: boolean | undefined;
                }, {
                    name: string;
                    slug: string;
                    metadata?: Record<string, any> | undefined;
                    userId?: string | undefined;
                    logo?: string | undefined;
                    keepCurrentActiveOrganization?: boolean | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/create";
        };
        updateOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    data: {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    };
                    organizationId?: string | undefined;
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
                response: {
                    metadata: Record<string, any> | undefined;
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    logo?: string | null | undefined;
                } | null;
            } : {
                metadata: Record<string, any> | undefined;
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                logo?: string | null | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    data: z.ZodObject<{
                        name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        logo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
                    }, "strip", z.ZodTypeAny, {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    }, {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    }>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    data: {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    };
                    organizationId?: string | undefined;
                }, {
                    data: {
                        metadata?: Record<string, any> | undefined;
                        name?: string | undefined;
                        slug?: string | undefined;
                        logo?: string | undefined;
                    };
                    organizationId?: string | undefined;
                }>;
                requireHeaders: true;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/update";
        };
        deleteOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    organizationId: string;
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
                response: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                } | null;
            } : {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    organizationId: string;
                }, {
                    organizationId: string;
                }>;
                requireHeaders: true;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
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
                                            type: "string";
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
            path: "/organization/delete";
        };
        setActiveOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    organizationId?: string | null | undefined;
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
                response: (O["teams"] extends {
                    enabled: true;
                } ? {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                    teams: Team[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                } : {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                }) | null;
            } : (O["teams"] extends {
                enabled: true;
            } ? {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
                teams: Team[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } : {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }) | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    organizationSlug: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | null | undefined;
                    organizationSlug?: string | undefined;
                }, {
                    organizationId?: string | null | undefined;
                    organizationSlug?: string | undefined;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/set-active";
        };
        getFullOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    organizationId?: string | undefined;
                    organizationSlug?: string | undefined;
                } | undefined;
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
                response: (O["teams"] extends {
                    enabled: true;
                } ? {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                    teams: Team[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                } : {
                    members: InferMember<O>[];
                    invitations: InferInvitation<O>[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                }) | null;
            } : (O["teams"] extends {
                enabled: true;
            } ? {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
                teams: Team[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } : {
                members: InferMember<O>[];
                invitations: InferInvitation<O>[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }) | null>;
            options: {
                method: "GET";
                query: z.ZodOptional<z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                    organizationSlug: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | undefined;
                    organizationSlug?: string | undefined;
                }, {
                    organizationId?: string | undefined;
                    organizationSlug?: string | undefined;
                }>>;
                requireHeaders: true;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                            description: string;
                                            $ref: string;
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
            path: "/organization/get-full-organization";
        };
        listOrganizations: {
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
                response: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    slug: string;
                    metadata?: any;
                    logo?: string | null | undefined;
                }[];
            } : {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }[]>;
            options: {
                method: "GET";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
            path: "/organization/list";
        };
        createInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(...inputCtx: better_call.HasRequiredKeys<better_call.InputContext<"/organization/invite-member", {
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            }>> extends true ? [better_call.InferBodyInput<{
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            }, {
                email: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
                resend?: boolean;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }] : [((better_call.InferBodyInput<{
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            }, {
                email: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
                resend?: boolean;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }) | undefined)?]): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                };
            } : {
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "POST";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                body: z.ZodObject<{
                    email: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                    resend: z.ZodOptional<z.ZodBoolean>;
                    teamId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }, {
                    email: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                    teamId?: string | undefined;
                    resend?: boolean | undefined;
                }>;
                metadata: {
                    $Infer: {
                        body: {
                            email: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                            resend?: boolean;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
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
            path: "/organization/invite-member";
        };
        cancelInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    invitationId: string;
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
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                } | null;
            } : {
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: string;
                                        properties: {
                                            invitation: {
                                                type: string;
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
            path: "/organization/cancel-invitation";
        };
        acceptInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    invitationId: string;
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
                    invitation: {
                        id: string;
                        email: string;
                        status: "pending" | "accepted" | "rejected" | "canceled";
                        expiresAt: Date;
                        organizationId: string;
                        role: string;
                        inviterId: string;
                        teamId?: string | undefined;
                    };
                    member: {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string;
                        role: string;
                        teamId?: string | undefined;
                    };
                } | null;
            } : {
                invitation: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                };
                member: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                invitation: {
                                                    type: string;
                                                };
                                                member: {
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
            path: "/organization/accept-invitation";
        };
        getInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    id: string;
                };
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
                response: {
                    organizationName: string;
                    organizationSlug: string;
                    inviterEmail: string;
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                };
            } : {
                organizationName: string;
                organizationSlug: string;
                inviterEmail: string;
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "GET";
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                requireHeaders: true;
                query: z.ZodObject<{
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                }, {
                    id: string;
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
                                                id: {
                                                    type: string;
                                                };
                                                email: {
                                                    type: string;
                                                };
                                                role: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                inviterId: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                                expiresAt: {
                                                    type: string;
                                                };
                                                organizationName: {
                                                    type: string;
                                                };
                                                organizationSlug: {
                                                    type: string;
                                                };
                                                inviterEmail: {
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
            path: "/organization/get-invitation";
        };
        rejectInvitation: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    invitationId: string;
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
                    invitation: {
                        id: string;
                        email: string;
                        status: "pending" | "accepted" | "rejected" | "canceled";
                        expiresAt: Date;
                        organizationId: string;
                        role: string;
                        inviterId: string;
                        teamId?: string | undefined;
                    } | null;
                    member: null;
                };
            } : {
                invitation: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                } | null;
                member: null;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    invitationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    invitationId: string;
                }, {
                    invitationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                invitation: {
                                                    type: string;
                                                };
                                                member: {
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
            path: "/organization/reject-invitation";
        };
        checkOrganizationSlug: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    slug: string;
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
                    slug: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    slug: string;
                }, {
                    slug: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
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
                    } | null;
                }>) | ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>))[];
            } & {
                use: any[];
            };
            path: "/organization/check-slug";
        };
        addMember: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(...inputCtx: better_call.HasRequiredKeys<better_call.InputContext<"/organization/add-member", {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            }>> extends true ? [better_call.InferBodyInput<{
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            }, {
                userId: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }] : [((better_call.InferBodyInput<{
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            }, {
                userId: string;
                role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                organizationId?: string;
            } & (O extends {
                teams: {
                    enabled: true;
                };
            } ? {
                teamId?: string;
            } : {})> & {
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
            }) | undefined)?]): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                } | null;
            } : {
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    userId: z.ZodString;
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }, {
                    userId: string;
                    role: string | string[];
                    organizationId?: string | undefined;
                }>;
                use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>)[];
                metadata: {
                    SERVER_ONLY: true;
                    $Infer: {
                        body: {
                            userId: string;
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            organizationId?: string;
                        } & (O extends {
                            teams: {
                                enabled: true;
                            };
                        } ? {
                            teamId?: string;
                        } : {});
                    };
                };
            } & {
                use: any[];
            };
            path: "/organization/add-member";
        };
        removeMember: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
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
                    member: {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string;
                        role: string;
                        teamId?: string | undefined;
                    };
                } | null;
            } : {
                member: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } | null>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    memberIdOrEmail: z.ZodString;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }, {
                    memberIdOrEmail: string;
                    organizationId?: string | undefined;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                member: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        organizationId: {
                                                            type: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
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
            path: "/organization/remove-member";
        };
        updateMemberRole: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                    memberId: string;
                    organizationId?: string;
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
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } : {
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    role: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
                    memberId: z.ZodString;
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    role: string | string[];
                    memberId: string;
                    organizationId?: string | undefined;
                }, {
                    role: string | string[];
                    memberId: string;
                    organizationId?: string | undefined;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                metadata: {
                    $Infer: {
                        body: {
                            role: InferOrganizationRolesFromOption<O> | InferOrganizationRolesFromOption<O>[];
                            memberId: string;
                            organizationId?: string;
                        };
                    };
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
                                                member: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        organizationId: {
                                                            type: string;
                                                        };
                                                        role: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
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
            path: "/organization/update-member-role";
        };
        getActiveMember: {
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
                response: {
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | null | undefined;
                    };
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                } | null;
            } : {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image: string | null | undefined;
                };
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            } | null>;
            options: {
                method: "GET";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
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
                                                id: {
                                                    type: string;
                                                };
                                                userId: {
                                                    type: string;
                                                };
                                                organizationId: {
                                                    type: string;
                                                };
                                                role: {
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
            path: "/organization/get-active-member";
        };
        leaveOrganization: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    organizationId: string;
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
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | null | undefined;
                    };
                    id: string;
                    createdAt: Date;
                    userId: string;
                    organizationId: string;
                    role: string;
                    teamId?: string | undefined;
                };
            } : {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image: string | null | undefined;
                };
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    organizationId: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    organizationId: string;
                }, {
                    organizationId: string;
                }>;
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
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
                }>) | ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>))[];
            } & {
                use: any[];
            };
            path: "/organization/leave";
        };
        listInvitations: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    organizationId?: string | undefined;
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
                response: {
                    id: string;
                    email: string;
                    status: "pending" | "accepted" | "rejected" | "canceled";
                    expiresAt: Date;
                    organizationId: string;
                    role: string;
                    inviterId: string;
                    teamId?: string | undefined;
                }[];
            } : {
                id: string;
                email: string;
                status: "pending" | "accepted" | "rejected" | "canceled";
                expiresAt: Date;
                organizationId: string;
                role: string;
                inviterId: string;
                teamId?: string | undefined;
            }[]>;
            options: {
                method: "GET";
                use: (((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                    orgOptions: OrganizationOptions;
                    roles: typeof defaultRoles & {
                        [key: string]: Role<{}>;
                    };
                    getSession: (context: GenericEndpointContext) => Promise<{
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    }>;
                }>) | ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>))[];
                query: z.ZodOptional<z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | undefined;
                }, {
                    organizationId?: string | undefined;
                }>>;
            } & {
                use: any[];
            };
            path: "/organization/list-invitations";
        };
    }) & {
        hasPermission: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: ({
                    /**
                     * @deprecated Use `permissions` instead
                     */
                    permission: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                    })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                    })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                    })[key][number] : never)[] | undefined; };
                    permissions?: never;
                } | {
                    permissions: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                    })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                    })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                    })[key][number] : never)[] | undefined; };
                    permission?: never;
                }) & {
                    organizationId?: string;
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
                requireHeaders: true;
                body: z.ZodIntersection<z.ZodObject<{
                    organizationId: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    organizationId?: string | undefined;
                }, {
                    organizationId?: string | undefined;
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
                use: ((inputContext: better_call.MiddlewareInputContext<{
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
                }>) => Promise<{
                    session: {
                        session: Session & {
                            activeOrganizationId?: string;
                        };
                        user: User;
                    };
                }>)[];
                metadata: {
                    $Infer: {
                        body: ({
                            /**
                             * @deprecated Use `permissions` instead
                             */
                            permission: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly organization: readonly ["update", "delete"];
                                readonly member: readonly ["create", "update", "delete"];
                                readonly invitation: readonly ["create", "cancel"];
                                readonly team: readonly ["create", "update", "delete"];
                            })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly organization: readonly ["update", "delete"];
                                readonly member: readonly ["create", "update", "delete"];
                                readonly invitation: readonly ["create", "cancel"];
                                readonly team: readonly ["create", "update", "delete"];
                            })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly organization: readonly ["update", "delete"];
                                readonly member: readonly ["create", "update", "delete"];
                                readonly invitation: readonly ["create", "cancel"];
                                readonly team: readonly ["create", "update", "delete"];
                            })[key][number] : never)[] | undefined; };
                            permissions?: never;
                        } | {
                            permissions: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly organization: readonly ["update", "delete"];
                                readonly member: readonly ["create", "update", "delete"];
                                readonly invitation: readonly ["create", "cancel"];
                                readonly team: readonly ["create", "update", "delete"];
                            })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly organization: readonly ["update", "delete"];
                                readonly member: readonly ["create", "update", "delete"];
                                readonly invitation: readonly ["create", "cancel"];
                                readonly team: readonly ["create", "update", "delete"];
                            })[key] extends readonly unknown[] ? (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
                                readonly organization: readonly ["update", "delete"];
                                readonly member: readonly ["create", "update", "delete"];
                                readonly invitation: readonly ["create", "cancel"];
                                readonly team: readonly ["create", "update", "delete"];
                            })[key][number] : never)[] | undefined; };
                            permission?: never;
                        }) & {
                            organizationId?: string;
                        };
                    };
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
                };
            } & {
                use: any[];
            };
            path: "/organization/has-permission";
        };
    };
    schema: {
        team?: {
            modelName: string | undefined;
            fields: {
                name: {
                    type: "string";
                    required: true;
                    fieldName: string | undefined;
                };
                organizationId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    fieldName: string | undefined;
                };
                createdAt: {
                    type: "date";
                    required: true;
                    fieldName: string | undefined;
                };
                updatedAt: {
                    type: "date";
                    required: false;
                    fieldName: string | undefined;
                };
            };
        } | undefined;
        session: {
            fields: {
                activeOrganizationId: {
                    type: "string";
                    required: false;
                    fieldName: string | undefined;
                };
            };
        };
        organization: {
            modelName: string | undefined;
            fields: {
                name: {
                    type: "string";
                    required: true;
                    sortable: true;
                    fieldName: string | undefined;
                };
                slug: {
                    type: "string";
                    unique: true;
                    sortable: true;
                    fieldName: string | undefined;
                };
                logo: {
                    type: "string";
                    required: false;
                    fieldName: string | undefined;
                };
                createdAt: {
                    type: "date";
                    required: true;
                    fieldName: string | undefined;
                };
                metadata: {
                    type: "string";
                    required: false;
                    fieldName: string | undefined;
                };
            };
        };
        member: {
            modelName: string | undefined;
            fields: {
                createdAt: {
                    type: "date";
                    required: true;
                    fieldName: string | undefined;
                };
                teamId?: {
                    type: "string";
                    required: false;
                    sortable: true;
                    fieldName: string | undefined;
                } | undefined;
                organizationId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    fieldName: string | undefined;
                };
                userId: {
                    type: "string";
                    required: true;
                    fieldName: string | undefined;
                    references: {
                        model: string;
                        field: string;
                    };
                };
                role: {
                    type: "string";
                    required: true;
                    sortable: true;
                    defaultValue: string;
                    fieldName: string | undefined;
                };
            };
        };
        invitation: {
            modelName: string | undefined;
            fields: {
                status: {
                    type: "string";
                    required: true;
                    sortable: true;
                    defaultValue: string;
                    fieldName: string | undefined;
                };
                expiresAt: {
                    type: "date";
                    required: true;
                    fieldName: string | undefined;
                };
                inviterId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                    };
                    fieldName: string | undefined;
                    required: true;
                };
                teamId?: {
                    type: "string";
                    required: false;
                    sortable: true;
                    fieldName: string | undefined;
                } | undefined;
                organizationId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    fieldName: string | undefined;
                };
                email: {
                    type: "string";
                    required: true;
                    sortable: true;
                    fieldName: string | undefined;
                };
                role: {
                    type: "string";
                    required: false;
                    sortable: true;
                    fieldName: string | undefined;
                };
            };
        };
    };
    $Infer: {
        Organization: Organization;
        Invitation: InferInvitation<O>;
        Member: InferMember<O>;
        Team: any;
        ActiveOrganization: Awaited<ReturnType<ReturnType<typeof getFullOrganization<O>>>>;
    };
    $ERROR_CODES: {
        readonly YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization";
        readonly YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations";
        readonly ORGANIZATION_ALREADY_EXISTS: "Organization already exists";
        readonly ORGANIZATION_NOT_FOUND: "Organization not found";
        readonly USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization";
        readonly YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization";
        readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization";
        readonly NO_ACTIVE_ORGANIZATION: "No active organization";
        readonly USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization";
        readonly MEMBER_NOT_FOUND: "Member not found";
        readonly ROLE_NOT_FOUND: "Role not found";
        readonly YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team";
        readonly TEAM_ALREADY_EXISTS: "Team already exists";
        readonly TEAM_NOT_FOUND: "Team not found";
        readonly YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner";
        readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member";
        readonly YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization";
        readonly USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization";
        readonly INVITATION_NOT_FOUND: "Invitation not found";
        readonly YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation";
        readonly YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation";
        readonly INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization";
        readonly YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "you are not allowed to invite user with this role";
        readonly FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation";
        readonly YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams";
        readonly UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team";
        readonly YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member";
        readonly ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached";
        readonly YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization";
        readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization";
        readonly YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team";
        readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team";
        readonly INVITATION_LIMIT_REACHED: "Invitation limit reached";
    };
};

export { type InferInvitation, type InferMember, type InferOrganizationRolesFromOption, type InferOrganizationZodRolesFromOption, type Invitation, type InvitationInput, type InvitationStatus, type Member, type MemberInput, type Organization, type OrganizationInput, type OrganizationOptions, type Team, type TeamInput, defaultRoles, invitationSchema, invitationStatus, memberSchema, organization, organizationSchema, parseRoles, role, teamSchema };
