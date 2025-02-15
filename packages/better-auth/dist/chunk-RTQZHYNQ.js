import { defaultRoles } from './chunk-GBLEGHZW.js';
import { createAuthMiddleware, sessionMiddleware, createAuthEndpoint, getSessionFromCtx, BASE_ERROR_CODES } from './chunk-P6JGS32U.js';
import { parser_default } from './chunk-HVHN3Y2L.js';
import { setSessionCookie } from './chunk-IWEXZ2ES.js';
import { generateId } from './chunk-KLDFBLYL.js';
import { getDate } from './chunk-FURNA6HY.js';
import { BetterAuthError } from './chunk-UNWCXKMP.js';
import { APIError } from 'better-call';
import { z } from 'zod';

// src/utils/shim.ts
var shimContext = (originalObject, newContext) => {
  const shimmedObj = {};
  for (const [key, value] of Object.entries(originalObject)) {
    shimmedObj[key] = (ctx) => {
      return value({
        ...ctx,
        context: {
          ...newContext,
          ...ctx.context
        }
      });
    };
    shimmedObj[key].path = value.path;
    shimmedObj[key].method = value.method;
    shimmedObj[key].options = value.options;
    shimmedObj[key].headers = value.headers;
  }
  return shimmedObj;
};

// src/plugins/organization/adapter.ts
var getOrgAdapter = (context, options) => {
  const adapter = context.adapter;
  return {
    findOrganizationBySlug: async (slug) => {
      const organization2 = await adapter.findOne({
        model: "organization",
        where: [
          {
            field: "slug",
            value: slug
          }
        ]
      });
      return organization2;
    },
    createOrganization: async (data) => {
      const organization2 = await adapter.create({
        model: "organization",
        data: {
          ...data.organization,
          metadata: data.organization.metadata ? JSON.stringify(data.organization.metadata) : void 0
        }
      });
      const member = await adapter.create({
        model: "member",
        data: {
          organizationId: organization2.id,
          userId: data.user.id,
          createdAt: /* @__PURE__ */ new Date(),
          role: options?.creatorRole || "owner"
        }
      });
      return {
        ...organization2,
        metadata: organization2.metadata ? JSON.parse(organization2.metadata) : void 0,
        members: [
          {
            ...member,
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image
            }
          }
        ]
      };
    },
    findMemberByEmail: async (data) => {
      const user = await adapter.findOne({
        model: "user",
        where: [
          {
            field: "email",
            value: data.email
          }
        ]
      });
      if (!user) {
        return null;
      }
      const member = await adapter.findOne({
        model: "member",
        where: [
          {
            field: "organizationId",
            value: data.organizationId
          },
          {
            field: "userId",
            value: user.id
          }
        ]
      });
      if (!member) {
        return null;
      }
      return {
        ...member,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        }
      };
    },
    findMemberByOrgId: async (data) => {
      const [member, user] = await Promise.all([
        await adapter.findOne({
          model: "member",
          where: [
            {
              field: "userId",
              value: data.userId
            },
            {
              field: "organizationId",
              value: data.organizationId
            }
          ]
        }),
        await adapter.findOne({
          model: "user",
          where: [
            {
              field: "id",
              value: data.userId
            }
          ]
        })
      ]);
      if (!user || !member) {
        return null;
      }
      return {
        ...member,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        }
      };
    },
    findMemberById: async (memberId) => {
      const member = await adapter.findOne({
        model: "member",
        where: [
          {
            field: "id",
            value: memberId
          }
        ]
      });
      if (!member) {
        return null;
      }
      const user = await adapter.findOne({
        model: "user",
        where: [
          {
            field: "id",
            value: member.userId
          }
        ]
      });
      if (!user) {
        return null;
      }
      return {
        ...member,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        }
      };
    },
    createMember: async (data) => {
      const member = await adapter.create({
        model: "member",
        data
      });
      return member;
    },
    updateMember: async (memberId, role2) => {
      const member = await adapter.update({
        model: "member",
        where: [
          {
            field: "id",
            value: memberId
          }
        ],
        update: {
          role: role2
        }
      });
      return member;
    },
    deleteMember: async (memberId) => {
      const member = await adapter.delete({
        model: "member",
        where: [
          {
            field: "id",
            value: memberId
          }
        ]
      });
      return member;
    },
    updateOrganization: async (organizationId, data) => {
      const organization2 = await adapter.update({
        model: "organization",
        where: [
          {
            field: "id",
            value: organizationId
          }
        ],
        update: {
          ...data,
          metadata: typeof data.metadata === "object" ? JSON.stringify(data.metadata) : data.metadata
        }
      });
      if (!organization2) {
        return null;
      }
      return {
        ...organization2,
        metadata: organization2.metadata ? parser_default(organization2.metadata) : void 0
      };
    },
    deleteOrganization: async (organizationId) => {
      await adapter.delete({
        model: "member",
        where: [
          {
            field: "organizationId",
            value: organizationId
          }
        ]
      });
      await adapter.delete({
        model: "invitation",
        where: [
          {
            field: "organizationId",
            value: organizationId
          }
        ]
      });
      await adapter.delete({
        model: "organization",
        where: [
          {
            field: "id",
            value: organizationId
          }
        ]
      });
      return organizationId;
    },
    setActiveOrganization: async (sessionToken, organizationId) => {
      const session = await context.internalAdapter.updateSession(
        sessionToken,
        {
          activeOrganizationId: organizationId
        }
      );
      return session;
    },
    findOrganizationById: async (organizationId) => {
      const organization2 = await adapter.findOne({
        model: "organization",
        where: [
          {
            field: "id",
            value: organizationId
          }
        ]
      });
      return organization2;
    },
    /**
     * @requires db
     */
    findFullOrganization: async ({
      organizationId,
      isSlug
    }) => {
      const org = await adapter.findOne({
        model: "organization",
        where: [{ field: isSlug ? "slug" : "id", value: organizationId }]
      });
      if (!org) {
        return null;
      }
      const [invitations, members] = await Promise.all([
        adapter.findMany({
          model: "invitation",
          where: [{ field: "organizationId", value: org.id }]
        }),
        adapter.findMany({
          model: "member",
          where: [{ field: "organizationId", value: org.id }]
        })
      ]);
      if (!org) return null;
      const userIds = members.map((member) => member.userId);
      const users = await adapter.findMany({
        model: "user",
        where: [{ field: "id", value: userIds, operator: "in" }]
      });
      const userMap = new Map(users.map((user) => [user.id, user]));
      const membersWithUsers = members.map((member) => {
        const user = userMap.get(member.userId);
        if (!user) {
          throw new BetterAuthError(
            "Unexpected error: User not found for member"
          );
        }
        return {
          ...member,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          }
        };
      });
      return {
        ...org,
        invitations,
        members: membersWithUsers
      };
    },
    listOrganizations: async (userId) => {
      const members = await adapter.findMany({
        model: "member",
        where: [
          {
            field: "userId",
            value: userId
          }
        ]
      });
      if (!members || members.length === 0) {
        return [];
      }
      const organizationIds = members.map((member) => member.organizationId);
      const organizations = await adapter.findMany({
        model: "organization",
        where: [
          {
            field: "id",
            value: organizationIds,
            operator: "in"
          }
        ]
      });
      return organizations;
    },
    createInvitation: async ({
      invitation,
      user
    }) => {
      const defaultExpiration = 1e3 * 60 * 60 * 48;
      const expiresAt = getDate(
        options?.invitationExpiresIn || defaultExpiration
      );
      const invite = await adapter.create({
        model: "invitation",
        data: {
          email: invitation.email,
          role: invitation.role,
          organizationId: invitation.organizationId,
          status: "pending",
          expiresAt,
          inviterId: user.id
        }
      });
      return invite;
    },
    findInvitationById: async (id) => {
      const invitation = await adapter.findOne({
        model: "invitation",
        where: [
          {
            field: "id",
            value: id
          }
        ]
      });
      return invitation;
    },
    findPendingInvitation: async (data) => {
      const invitation = await adapter.findMany({
        model: "invitation",
        where: [
          {
            field: "email",
            value: data.email
          },
          {
            field: "organizationId",
            value: data.organizationId
          },
          {
            field: "status",
            value: "pending"
          }
        ]
      });
      return invitation.filter(
        (invite) => new Date(invite.expiresAt) > /* @__PURE__ */ new Date()
      );
    },
    updateInvitation: async (data) => {
      const invitation = await adapter.update({
        model: "invitation",
        where: [
          {
            field: "id",
            value: data.invitationId
          }
        ],
        update: {
          status: data.status
        }
      });
      return invitation;
    }
  };
};
var orgMiddleware = createAuthMiddleware(async (ctx) => {
  return {};
});
var orgSessionMiddleware = createAuthMiddleware(
  {
    use: [sessionMiddleware]
  },
  async (ctx) => {
    const session = ctx.context.session;
    return {
      session
    };
  }
);
var role = z.string();
var invitationStatus = z.enum(["pending", "accepted", "rejected", "canceled"]).default("pending");
z.object({
  id: z.string().default(generateId),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullish(),
  metadata: z.record(z.string()).or(z.string().transform((v) => JSON.parse(v))).nullish(),
  createdAt: z.date()
});
z.object({
  id: z.string().default(generateId),
  organizationId: z.string(),
  userId: z.string(),
  role,
  createdAt: z.date()
});
z.object({
  id: z.string().default(generateId),
  organizationId: z.string(),
  email: z.string(),
  role,
  status: invitationStatus,
  /**
   * The id of the user who invited the user.
   */
  inviterId: z.string(),
  expiresAt: z.date()
});

// src/plugins/organization/error-codes.ts
var ORGANIZATION_ERROR_CODES = {
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
  ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
  ORGANIZATION_NOT_FOUND: "Organization not found",
  USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
  NO_ACTIVE_ORGANIZATION: "No active organization",
  USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
  MEMBER_NOT_FOUND: "Member not found",
  ROLE_NOT_FOUND: "Role not found",
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
  INVITATION_NOT_FOUND: "Invitation not found",
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
  YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
  INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "you are not allowed to invite user with this role"
};

// src/plugins/organization/routes/crud-invites.ts
var createInvitation = (option) => createAuthEndpoint(
  "/organization/invite-member",
  {
    method: "POST",
    use: [orgMiddleware, orgSessionMiddleware],
    body: z.object({
      email: z.string({
        description: "The email address of the user to invite"
      }),
      role: z.string({
        description: "The role to assign to the user"
      }),
      organizationId: z.string({
        description: "The organization ID to invite the user to"
      }).optional(),
      resend: z.boolean({
        description: "Resend the invitation email, if the user is already invited"
      }).optional()
    }),
    metadata: {
      openapi: {
        description: "Invite a user to an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string"
                    },
                    email: {
                      type: "string"
                    },
                    role: {
                      type: "string"
                    },
                    organizationId: {
                      type: "string"
                    },
                    inviterId: {
                      type: "string"
                    },
                    status: {
                      type: "string"
                    },
                    expiresAt: {
                      type: "string"
                    }
                  },
                  required: [
                    "id",
                    "email",
                    "role",
                    "organizationId",
                    "inviterId",
                    "status",
                    "expiresAt"
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    if (!ctx.context.orgOptions.sendInvitationEmail) {
      ctx.context.logger.warn(
        "Invitation email is not enabled. Pass `sendInvitationEmail` to the plugin options to enable it."
      );
      throw new APIError("BAD_REQUEST", {
        message: "Invitation email is not enabled"
      });
    }
    const session = ctx.context.session;
    const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
    if (!organizationId) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId
    });
    if (!member) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
      });
    }
    const role2 = ctx.context.roles[member.role];
    if (!role2) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND
      });
    }
    const canInvite = role2.authorize({
      invitation: ["create"]
    });
    if (canInvite.error) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION
      });
    }
    const creatorRole = ctx.context.orgOptions.creatorRole || "owner";
    if (member.role !== creatorRole && ctx.body.role === creatorRole) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE
      });
    }
    const alreadyMember = await adapter.findMemberByEmail({
      email: ctx.body.email,
      organizationId
    });
    if (alreadyMember) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION
      });
    }
    const alreadyInvited = await adapter.findPendingInvitation({
      email: ctx.body.email,
      organizationId
    });
    if (alreadyInvited.length && !ctx.body.resend) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION
      });
    }
    const invitation = await adapter.createInvitation({
      invitation: {
        role: ctx.body.role,
        email: ctx.body.email,
        organizationId
      },
      user: session.user
    });
    const organization2 = await adapter.findOrganizationById(organizationId);
    if (!organization2) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
      });
    }
    await ctx.context.orgOptions.sendInvitationEmail?.(
      {
        id: invitation.id,
        role: invitation.role,
        email: invitation.email,
        organization: organization2,
        inviter: {
          ...member,
          user: session.user
        }
      },
      ctx.request
    );
    return ctx.json(invitation);
  }
);
var acceptInvitation = createAuthEndpoint(
  "/organization/accept-invitation",
  {
    method: "POST",
    body: z.object({
      invitationId: z.string({
        description: "The ID of the invitation to accept"
      })
    }),
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "Accept an invitation to an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invitation: {
                      type: "object"
                    },
                    member: {
                      type: "object"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const invitation = await adapter.findInvitationById(ctx.body.invitationId);
    if (!invitation || invitation.expiresAt < /* @__PURE__ */ new Date() || invitation.status !== "pending") {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.INVITATION_NOT_FOUND
      });
    }
    if (invitation.email !== session.user.email) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION
      });
    }
    const acceptedI = await adapter.updateInvitation({
      invitationId: ctx.body.invitationId,
      status: "accepted"
    });
    const member = await adapter.createMember({
      organizationId: invitation.organizationId,
      userId: session.user.id,
      role: invitation.role,
      createdAt: /* @__PURE__ */ new Date()
    });
    await adapter.setActiveOrganization(
      session.session.token,
      invitation.organizationId
    );
    if (!acceptedI) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.INVITATION_NOT_FOUND
        }
      });
    }
    return ctx.json({
      invitation: acceptedI,
      member
    });
  }
);
var rejectInvitation = createAuthEndpoint(
  "/organization/reject-invitation",
  {
    method: "POST",
    body: z.object({
      invitationId: z.string({
        description: "The ID of the invitation to reject"
      })
    }),
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "Reject an invitation to an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invitation: {
                      type: "object"
                    },
                    member: {
                      type: "null"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const invitation = await adapter.findInvitationById(ctx.body.invitationId);
    if (!invitation || invitation.expiresAt < /* @__PURE__ */ new Date() || invitation.status !== "pending") {
      throw new APIError("BAD_REQUEST", {
        message: "Invitation not found!"
      });
    }
    if (invitation.email !== session.user.email) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION
      });
    }
    const rejectedI = await adapter.updateInvitation({
      invitationId: ctx.body.invitationId,
      status: "rejected"
    });
    return ctx.json({
      invitation: rejectedI,
      member: null
    });
  }
);
var cancelInvitation = createAuthEndpoint(
  "/organization/cancel-invitation",
  {
    method: "POST",
    body: z.object({
      invitationId: z.string({
        description: "The ID of the invitation to cancel"
      })
    }),
    use: [orgMiddleware, orgSessionMiddleware],
    openapi: {
      description: "Cancel an invitation to an organization",
      responses: {
        "200": {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  invitation: {
                    type: "object"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const invitation = await adapter.findInvitationById(ctx.body.invitationId);
    if (!invitation) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.INVITATION_NOT_FOUND
      });
    }
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId: invitation.organizationId
    });
    if (!member) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
      });
    }
    const canCancel = ctx.context.roles[member.role].authorize({
      invitation: ["cancel"]
    });
    if (canCancel.error) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION
      });
    }
    const canceledI = await adapter.updateInvitation({
      invitationId: ctx.body.invitationId,
      status: "canceled"
    });
    return ctx.json(canceledI);
  }
);
var getInvitation = createAuthEndpoint(
  "/organization/get-invitation",
  {
    method: "GET",
    use: [orgMiddleware],
    requireHeaders: true,
    query: z.object({
      id: z.string({
        description: "The ID of the invitation to get"
      })
    }),
    metadata: {
      openapi: {
        description: "Get an invitation by ID",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string"
                    },
                    email: {
                      type: "string"
                    },
                    role: {
                      type: "string"
                    },
                    organizationId: {
                      type: "string"
                    },
                    inviterId: {
                      type: "string"
                    },
                    status: {
                      type: "string"
                    },
                    expiresAt: {
                      type: "string"
                    },
                    organizationName: {
                      type: "string"
                    },
                    organizationSlug: {
                      type: "string"
                    },
                    inviterEmail: {
                      type: "string"
                    }
                  },
                  required: [
                    "id",
                    "email",
                    "role",
                    "organizationId",
                    "inviterId",
                    "status",
                    "expiresAt",
                    "organizationName",
                    "organizationSlug",
                    "inviterEmail"
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = await getSessionFromCtx(ctx);
    if (!session) {
      throw new APIError("UNAUTHORIZED", {
        message: "Not authenticated"
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const invitation = await adapter.findInvitationById(ctx.query.id);
    if (!invitation || invitation.status !== "pending" || invitation.expiresAt < /* @__PURE__ */ new Date()) {
      throw new APIError("BAD_REQUEST", {
        message: "Invitation not found!"
      });
    }
    if (invitation.email !== session.user.email) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION
      });
    }
    const organization2 = await adapter.findOrganizationById(
      invitation.organizationId
    );
    if (!organization2) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
      });
    }
    const member = await adapter.findMemberByOrgId({
      userId: invitation.inviterId,
      organizationId: invitation.organizationId
    });
    if (!member) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION
      });
    }
    return ctx.json({
      ...invitation,
      organizationName: organization2.name,
      organizationSlug: organization2.slug,
      inviterEmail: member.user.email
    });
  }
);
var addMember = () => createAuthEndpoint(
  "/organization/add-member",
  {
    method: "POST",
    body: z.object({
      userId: z.string(),
      role: z.string(),
      organizationId: z.string().optional()
    }),
    use: [orgMiddleware],
    metadata: {
      SERVER_ONLY: true
    }
  },
  async (ctx) => {
    const session = ctx.body.userId ? await getSessionFromCtx(ctx).catch((e) => null) : null;
    const orgId = ctx.body.organizationId || session?.session.activeOrganizationId;
    if (!orgId) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION
        }
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const user = await ctx.context.internalAdapter.findUserById(
      ctx.body.userId
    );
    if (!user) {
      throw new APIError("BAD_REQUEST", {
        message: BASE_ERROR_CODES.USER_NOT_FOUND
      });
    }
    const alreadyMember = await adapter.findMemberByEmail({
      email: user.email,
      organizationId: orgId
    });
    if (alreadyMember) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION
      });
    }
    const createdMember = await adapter.createMember({
      id: generateId(),
      organizationId: orgId,
      userId: user.id,
      role: ctx.body.role,
      createdAt: /* @__PURE__ */ new Date()
    });
    return ctx.json(createdMember);
  }
);
var removeMember = createAuthEndpoint(
  "/organization/remove-member",
  {
    method: "POST",
    body: z.object({
      memberIdOrEmail: z.string({
        description: "The ID or email of the member to remove"
      }),
      /**
       * If not provided, the active organization will be used
       */
      organizationId: z.string({
        description: "The ID of the organization to remove the member from. If not provided, the active organization will be used"
      }).optional()
    }),
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "Remove a member from an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    member: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string"
                        },
                        userId: {
                          type: "string"
                        },
                        organizationId: {
                          type: "string"
                        },
                        role: {
                          type: "string"
                        }
                      },
                      required: ["id", "userId", "organizationId", "role"]
                    }
                  },
                  required: ["member"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
    if (!organizationId) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION
        }
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId
    });
    if (!member) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
      });
    }
    const role2 = ctx.context.roles[member.role];
    if (!role2) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND
      });
    }
    const isLeaving = session.user.email === ctx.body.memberIdOrEmail || member.id === ctx.body.memberIdOrEmail;
    const isOwnerLeaving = isLeaving && member.role === (ctx.context.orgOptions?.creatorRole || "owner");
    if (isOwnerLeaving) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER
      });
    }
    const canDeleteMember = isLeaving || role2.authorize({
      member: ["delete"]
    }).success;
    if (!canDeleteMember) {
      throw new APIError("UNAUTHORIZED", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER
      });
    }
    let existing = null;
    if (ctx.body.memberIdOrEmail.includes("@")) {
      existing = await adapter.findMemberByEmail({
        email: ctx.body.memberIdOrEmail,
        organizationId
      });
    } else {
      existing = await adapter.findMemberById(ctx.body.memberIdOrEmail);
    }
    if (existing?.organizationId !== organizationId) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
      });
    }
    await adapter.deleteMember(existing.id);
    if (session.user.id === existing.userId && session.session.activeOrganizationId === existing.organizationId) {
      await adapter.setActiveOrganization(session.session.token, null);
    }
    return ctx.json({
      member: existing
    });
  }
);
var updateMemberRole = (option) => createAuthEndpoint(
  "/organization/update-member-role",
  {
    method: "POST",
    body: z.object({
      role: z.string(),
      memberId: z.string(),
      /**
       * If not provided, the active organization will be used
       */
      organizationId: z.string().optional()
    }),
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "Update the role of a member in an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    member: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string"
                        },
                        userId: {
                          type: "string"
                        },
                        organizationId: {
                          type: "string"
                        },
                        role: {
                          type: "string"
                        }
                      },
                      required: ["id", "userId", "organizationId", "role"]
                    }
                  },
                  required: ["member"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
    if (!organizationId) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION
        }
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId
    });
    if (!member) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
        }
      });
    }
    const role2 = ctx.context.roles[member.role];
    if (!role2) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND
        }
      });
    }
    const canUpdateMember = role2.authorize({
      member: ["update"]
    }).error || ctx.body.role === "owner" && member.role !== "owner";
    if (canUpdateMember) {
      return ctx.json(null, {
        body: {
          message: "You are not allowed to update this member"
        },
        status: 403
      });
    }
    const updatedMember = await adapter.updateMember(
      ctx.body.memberId,
      ctx.body.role
    );
    if (!updatedMember) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
        }
      });
    }
    return ctx.json(updatedMember);
  }
);
var getActiveMember = createAuthEndpoint(
  "/organization/get-active-member",
  {
    method: "GET",
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "Get the active member in the organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string"
                    },
                    userId: {
                      type: "string"
                    },
                    organizationId: {
                      type: "string"
                    },
                    role: {
                      type: "string"
                    }
                  },
                  required: ["id", "userId", "organizationId", "role"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION
        }
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId
    });
    if (!member) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND
        }
      });
    }
    return ctx.json(member);
  }
);
var createOrganization = createAuthEndpoint(
  "/organization/create",
  {
    method: "POST",
    body: z.object({
      name: z.string({
        description: "The name of the organization"
      }),
      slug: z.string({
        description: "The slug of the organization"
      }),
      userId: z.string({
        description: "The user id of the organization creator. If not provided, the current user will be used. Should only be used by admins or when called by the server."
      }).optional(),
      logo: z.string({
        description: "The logo of the organization"
      }).optional(),
      metadata: z.record(z.string(), z.any(), {
        description: "The metadata of the organization"
      }).optional()
    }),
    use: [orgMiddleware],
    metadata: {
      openapi: {
        description: "Create an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  description: "The organization that was created",
                  $ref: "#/components/schemas/Organization"
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = await getSessionFromCtx(ctx);
    if (!session && (ctx.request || ctx.headers)) {
      throw new APIError("UNAUTHORIZED");
    }
    let user = session?.user || null;
    if (!user) {
      if (!ctx.body.userId) {
        throw new APIError("UNAUTHORIZED");
      }
      user = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
    }
    if (!user) {
      return ctx.json(null, {
        status: 401
      });
    }
    const options = ctx.context.orgOptions;
    const canCreateOrg = typeof options?.allowUserToCreateOrganization === "function" ? await options.allowUserToCreateOrganization(user) : options?.allowUserToCreateOrganization === void 0 ? true : options.allowUserToCreateOrganization;
    if (!canCreateOrg) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION
      });
    }
    const adapter = getOrgAdapter(ctx.context, options);
    const userOrganizations = await adapter.listOrganizations(user.id);
    const hasReachedOrgLimit = typeof options.organizationLimit === "number" ? userOrganizations.length >= options.organizationLimit : typeof options.organizationLimit === "function" ? await options.organizationLimit(user) : false;
    if (hasReachedOrgLimit) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS
      });
    }
    const existingOrganization = await adapter.findOrganizationBySlug(
      ctx.body.slug
    );
    if (existingOrganization) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ORGANIZATION_ALREADY_EXISTS
      });
    }
    const organization2 = await adapter.createOrganization({
      organization: {
        id: generateId(),
        slug: ctx.body.slug,
        name: ctx.body.name,
        logo: ctx.body.logo,
        createdAt: /* @__PURE__ */ new Date(),
        metadata: ctx.body.metadata
      },
      user
    });
    if (ctx.context.session) {
      await adapter.setActiveOrganization(
        ctx.context.session.session.token,
        organization2.id
      );
    }
    return ctx.json(organization2);
  }
);
var updateOrganization = createAuthEndpoint(
  "/organization/update",
  {
    method: "POST",
    body: z.object({
      data: z.object({
        name: z.string({
          description: "The name of the organization"
        }).optional(),
        slug: z.string({
          description: "The slug of the organization"
        }).optional(),
        logo: z.string({
          description: "The logo of the organization"
        }).optional(),
        metadata: z.record(z.string(), z.any(), {
          description: "The metadata of the organization"
        }).optional()
      }).partial(),
      organizationId: z.string().optional()
    }),
    requireHeaders: true,
    use: [orgMiddleware],
    metadata: {
      openapi: {
        description: "Update an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  description: "The updated organization",
                  $ref: "#/components/schemas/Organization"
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = await ctx.context.getSession(ctx);
    if (!session) {
      throw new APIError("UNAUTHORIZED", {
        message: "User not found"
      });
    }
    const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
    if (!organizationId) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
        }
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId
    });
    if (!member) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION
        }
      });
    }
    const role2 = ctx.context.roles[member.role];
    if (!role2) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: "Role not found!"
        }
      });
    }
    const canUpdateOrg = role2.authorize({
      organization: ["update"]
    });
    if (canUpdateOrg.error) {
      return ctx.json(null, {
        body: {
          message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION
        },
        status: 403
      });
    }
    const updatedOrg = await adapter.updateOrganization(
      organizationId,
      ctx.body.data
    );
    return ctx.json(updatedOrg);
  }
);
var deleteOrganization = createAuthEndpoint(
  "/organization/delete",
  {
    method: "POST",
    body: z.object({
      organizationId: z.string({
        description: "The organization id to delete"
      })
    }),
    requireHeaders: true,
    use: [orgMiddleware],
    metadata: {
      openapi: {
        description: "Delete an organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                  description: "The organization id that was deleted"
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = await ctx.context.getSession(ctx);
    if (!session) {
      return ctx.json(null, {
        status: 401
      });
    }
    const organizationId = ctx.body.organizationId;
    if (!organizationId) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
        }
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const member = await adapter.findMemberByOrgId({
      userId: session.user.id,
      organizationId
    });
    if (!member) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION
        }
      });
    }
    const role2 = ctx.context.roles[member.role];
    if (!role2) {
      return ctx.json(null, {
        status: 400,
        body: {
          message: "Role not found!"
        }
      });
    }
    const canDeleteOrg = role2.authorize({
      organization: ["delete"]
    });
    if (canDeleteOrg.error) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION
      });
    }
    if (organizationId === session.session.activeOrganizationId) {
      await adapter.setActiveOrganization(session.session.token, null);
    }
    const option = ctx.context.orgOptions.organizationDeletion;
    if (option?.disabled) {
      throw new APIError("FORBIDDEN");
    }
    const org = await adapter.findOrganizationById(organizationId);
    if (!org) {
      throw new APIError("BAD_REQUEST");
    }
    if (option?.beforeDelete) {
      await option.beforeDelete({
        organization: org,
        user: session.user
      });
    }
    await adapter.deleteOrganization(organizationId);
    if (option?.afterDelete) {
      await option.afterDelete({
        organization: org,
        user: session.user
      });
    }
    return ctx.json(org);
  }
);
var getFullOrganization = createAuthEndpoint(
  "/organization/get-full-organization",
  {
    method: "GET",
    query: z.optional(
      z.object({
        organizationId: z.string({
          description: "The organization id to get"
        }).optional(),
        organizationSlug: z.string({
          description: "The organization slug to get"
        }).optional()
      })
    ),
    requireHeaders: true,
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "Get the full organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  description: "The organization",
                  $ref: "#/components/schemas/Organization"
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    const organizationId = ctx.query?.organizationSlug || ctx.query?.organizationId || session.session.activeOrganizationId;
    if (!organizationId) {
      return ctx.json(null, {
        status: 200
      });
    }
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const organization2 = await adapter.findFullOrganization({
      organizationId,
      isSlug: !!ctx.query?.organizationSlug
    });
    const isMember = organization2?.members.find(
      (member) => member.userId === session.user.id
    );
    if (!isMember) {
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION
      });
    }
    if (!organization2) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
      });
    }
    return ctx.json(organization2);
  }
);
var setActiveOrganization = createAuthEndpoint(
  "/organization/set-active",
  {
    method: "POST",
    body: z.object({
      organizationId: z.string({
        description: "The organization id to set as active. It can be null to unset the active organization"
      }).nullable().optional(),
      organizationSlug: z.string({
        description: "The organization slug to set as active. It can be null to unset the active organization if organizationId is not provided"
      }).optional()
    }),
    use: [orgSessionMiddleware, orgMiddleware],
    metadata: {
      openapi: {
        description: "Set the active organization",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  description: "The organization",
                  $ref: "#/components/schemas/Organization"
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const session = ctx.context.session;
    let organizationId = ctx.body.organizationSlug || ctx.body.organizationId;
    if (organizationId === null) {
      const sessionOrgId = session.session.activeOrganizationId;
      if (!sessionOrgId) {
        return ctx.json(null);
      }
      const updatedSession2 = await adapter.setActiveOrganization(
        session.session.token,
        null
      );
      await setSessionCookie(ctx, {
        session: updatedSession2,
        user: session.user
      });
      return ctx.json(null);
    }
    if (!organizationId) {
      const sessionOrgId = session.session.activeOrganizationId;
      if (!sessionOrgId) {
        return ctx.json(null);
      }
      organizationId = sessionOrgId;
    }
    const organization2 = await adapter.findFullOrganization({
      organizationId,
      isSlug: !!ctx.body.organizationSlug
    });
    const isMember = organization2?.members.find(
      (member) => member.userId === session.user.id
    );
    if (!isMember) {
      await adapter.setActiveOrganization(session.session.token, null);
      throw new APIError("FORBIDDEN", {
        message: ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION
      });
    }
    if (!organization2) {
      throw new APIError("BAD_REQUEST", {
        message: ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND
      });
    }
    const updatedSession = await adapter.setActiveOrganization(
      session.session.token,
      organization2.id
    );
    await setSessionCookie(ctx, {
      session: updatedSession,
      user: session.user
    });
    return ctx.json(organization2);
  }
);
var listOrganizations = createAuthEndpoint(
  "/organization/list",
  {
    method: "GET",
    use: [orgMiddleware, orgSessionMiddleware],
    metadata: {
      openapi: {
        description: "List all organizations",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Organization"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
    const organizations = await adapter.listOrganizations(
      ctx.context.session.user.id
    );
    return ctx.json(organizations);
  }
);

// src/plugins/organization/organization.ts
var organization = (options) => {
  const endpoints = {
    createOrganization,
    updateOrganization,
    deleteOrganization,
    setActiveOrganization,
    getFullOrganization,
    listOrganizations,
    createInvitation: createInvitation(),
    cancelInvitation,
    acceptInvitation,
    getInvitation,
    rejectInvitation,
    addMember: addMember(),
    removeMember,
    updateMemberRole: updateMemberRole(),
    getActiveMember
  };
  const roles = {
    ...defaultRoles,
    ...options?.roles
  };
  const api = shimContext(endpoints, {
    orgOptions: options || {},
    roles,
    getSession: async (context) => {
      return await getSessionFromCtx(context);
    }
  });
  return {
    id: "organization",
    endpoints: {
      ...api,
      hasPermission: createAuthEndpoint(
        "/organization/has-permission",
        {
          method: "POST",
          requireHeaders: true,
          body: z.object({
            organizationId: z.string().optional(),
            permission: z.record(z.string(), z.array(z.string()))
          }),
          use: [orgSessionMiddleware],
          metadata: {
            openapi: {
              description: "Check if the user has permission",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        permission: {
                          type: "object",
                          description: "The permission to check"
                        }
                      },
                      required: ["permission"]
                    }
                  }
                }
              },
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          error: {
                            type: "string"
                          },
                          success: {
                            type: "boolean"
                          }
                        },
                        required: ["success"]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          if (!ctx.body.permission || Object.keys(ctx.body.permission).length > 1) {
            throw new APIError("BAD_REQUEST", {
              message: "invalid permission check. you can only check one resource permission at a time."
            });
          }
          const activeOrganizationId = ctx.body.organizationId || ctx.context.session.session.activeOrganizationId;
          if (!activeOrganizationId) {
            throw new APIError("BAD_REQUEST", {
              message: ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION
            });
          }
          const adapter = getOrgAdapter(ctx.context);
          const member = await adapter.findMemberByOrgId({
            userId: ctx.context.session.user.id,
            organizationId: activeOrganizationId
          });
          if (!member) {
            throw new APIError("UNAUTHORIZED", {
              message: ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION
            });
          }
          const role2 = roles[member.role];
          const result = role2.authorize(ctx.body.permission);
          if (result.error) {
            return ctx.json(
              {
                error: result.error,
                success: false
              },
              {
                status: 403
              }
            );
          }
          return ctx.json({
            error: null,
            success: true
          });
        }
      )
    },
    schema: {
      session: {
        fields: {
          activeOrganizationId: {
            type: "string",
            required: false,
            fieldName: options?.schema?.session?.fields?.activeOrganizationId
          }
        }
      },
      organization: {
        modelName: options?.schema?.organization?.modelName,
        fields: {
          name: {
            type: "string",
            required: true,
            sortable: true,
            fieldName: options?.schema?.organization?.fields?.name
          },
          slug: {
            type: "string",
            unique: true,
            sortable: true,
            fieldName: options?.schema?.organization?.fields?.slug
          },
          logo: {
            type: "string",
            required: false,
            fieldName: options?.schema?.organization?.fields?.logo
          },
          createdAt: {
            type: "date",
            required: true,
            fieldName: options?.schema?.organization?.fields?.createdAt
          },
          metadata: {
            type: "string",
            required: false,
            fieldName: options?.schema?.organization?.fields?.metadata
          }
        }
      },
      member: {
        modelName: options?.schema?.member?.modelName,
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model: "organization",
              field: "id"
            },
            fieldName: options?.schema?.member?.fields?.organizationId
          },
          userId: {
            type: "string",
            required: true,
            fieldName: options?.schema?.member?.fields?.userId,
            references: {
              model: "user",
              field: "id"
            }
          },
          role: {
            type: "string",
            required: true,
            sortable: true,
            defaultValue: "member",
            fieldName: options?.schema?.member?.fields?.role
          },
          createdAt: {
            type: "date",
            required: true,
            fieldName: options?.schema?.member?.fields?.createdAt
          }
        }
      },
      invitation: {
        modelName: options?.schema?.invitation?.modelName,
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model: "organization",
              field: "id"
            },
            fieldName: options?.schema?.invitation?.fields?.organizationId
          },
          email: {
            type: "string",
            required: true,
            sortable: true,
            fieldName: options?.schema?.invitation?.fields?.email
          },
          role: {
            type: "string",
            required: false,
            sortable: true,
            fieldName: options?.schema?.invitation?.fields?.role
          },
          status: {
            type: "string",
            required: true,
            sortable: true,
            defaultValue: "pending",
            fieldName: options?.schema?.invitation?.fields?.status
          },
          expiresAt: {
            type: "date",
            required: true,
            fieldName: options?.schema?.invitation?.fields?.expiresAt
          },
          inviterId: {
            type: "string",
            references: {
              model: "user",
              field: "id"
            },
            fieldName: options?.schema?.invitation?.fields?.inviterId,
            required: true
          }
        }
      }
    },
    $Infer: {
      Organization: {},
      Invitation: {},
      Member: {},
      ActiveOrganization: {}
    },
    $ERROR_CODES: ORGANIZATION_ERROR_CODES
  };
};

export { organization };
