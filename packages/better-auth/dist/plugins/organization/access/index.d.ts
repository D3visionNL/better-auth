import { Subset, AuthorizeResponse } from '../../access/index.js';
import '../../../shared/better-auth.DTtXpZYr.js';

declare const defaultStatements: {
    readonly organization: readonly ["update", "delete"];
    readonly member: readonly ["create", "update", "delete"];
    readonly invitation: readonly ["create", "cancel"];
    readonly team: readonly ["create", "update", "delete"];
    readonly ac: readonly ["create", "read", "update", "delete"];
};
declare const defaultAc: {
    newRole<K extends "organization" | "member" | "invitation" | "team" | "ac">(statements: Subset<K, {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>): {
        authorize<K_1 extends K>(request: K_1 extends infer T extends keyof Subset<K, {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }> ? { [key in T]?: Subset<K, {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key] | {
            actions: Subset<K, {
                readonly organization: readonly ["update", "delete"];
                readonly member: readonly ["create", "update", "delete"];
                readonly invitation: readonly ["create", "cancel"];
                readonly team: readonly ["create", "update", "delete"];
                readonly ac: readonly ["create", "read", "update", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
        statements: Subset<K, {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>;
    };
    statements: {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    };
};
declare const adminAc: {
    authorize<K extends "organization" | "member" | "invitation" | "team" | "ac">(request: K extends infer T extends keyof Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }> ? { [key in T]?: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>[key] | {
        actions: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
    statements: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>;
};
declare const ownerAc: {
    authorize<K extends "organization" | "member" | "invitation" | "team" | "ac">(request: K extends infer T extends keyof Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }> ? { [key in T]?: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>[key] | {
        actions: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
    statements: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>;
};
declare const memberAc: {
    authorize<K extends "organization" | "member" | "invitation" | "team" | "ac">(request: K extends infer T extends keyof Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }> ? { [key in T]?: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>[key] | {
        actions: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
    statements: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
        readonly organization: readonly ["update", "delete"];
        readonly member: readonly ["create", "update", "delete"];
        readonly invitation: readonly ["create", "cancel"];
        readonly team: readonly ["create", "update", "delete"];
        readonly ac: readonly ["create", "read", "update", "delete"];
    }>;
};
declare const defaultRoles: {
    admin: {
        authorize<K extends "organization" | "member" | "invitation" | "team" | "ac">(request: K extends infer T extends keyof Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }> ? { [key in T]?: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key] | {
            actions: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
                readonly organization: readonly ["update", "delete"];
                readonly member: readonly ["create", "update", "delete"];
                readonly invitation: readonly ["create", "cancel"];
                readonly team: readonly ["create", "update", "delete"];
                readonly ac: readonly ["create", "read", "update", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
        statements: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>;
    };
    owner: {
        authorize<K extends "organization" | "member" | "invitation" | "team" | "ac">(request: K extends infer T extends keyof Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }> ? { [key in T]?: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key] | {
            actions: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
                readonly organization: readonly ["update", "delete"];
                readonly member: readonly ["create", "update", "delete"];
                readonly invitation: readonly ["create", "cancel"];
                readonly team: readonly ["create", "update", "delete"];
                readonly ac: readonly ["create", "read", "update", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
        statements: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>;
    };
    member: {
        authorize<K extends "organization" | "member" | "invitation" | "team" | "ac">(request: K extends infer T extends keyof Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }> ? { [key in T]?: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>[key] | {
            actions: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
                readonly organization: readonly ["update", "delete"];
                readonly member: readonly ["create", "update", "delete"];
                readonly invitation: readonly ["create", "cancel"];
                readonly team: readonly ["create", "update", "delete"];
                readonly ac: readonly ["create", "read", "update", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): AuthorizeResponse;
        statements: Subset<"organization" | "member" | "invitation" | "team" | "ac", {
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
            readonly ac: readonly ["create", "read", "update", "delete"];
        }>;
    };
};

export { adminAc, defaultAc, defaultRoles, defaultStatements, memberAc, ownerAc };
