import * as nanostores from 'nanostores';
import { atom } from 'nanostores';
import { AccessControl, Role, Statements } from '../../plugins/access/index.mjs';
import * as _better_fetch_fetch from '@better-fetch/fetch';
import { BetterFetch, BetterFetchOption } from '@better-fetch/fetch';
import { organization, InferMember, InferInvitation, Team, Organization, Member, Invitation } from '../../plugins/organization/index.mjs';
import { b as Prettify } from '../../shared/better-auth.Bi8FQwDD.mjs';
import { username } from '../../plugins/username/index.mjs';
import { Passkey, passkey } from '../../plugins/passkey/index.mjs';
export { twoFactorClient } from '../../plugins/two-factor/index.mjs';
import { magicLink } from '../../plugins/magic-link/index.mjs';
import { phoneNumber } from '../../plugins/phone-number/index.mjs';
import { anonymous } from '../../plugins/anonymous/index.mjs';
import { a1 as FieldAttribute, B as BetterAuthOptions, h as BetterAuthPlugin } from '../../shared/better-auth.kHOzQ3TU.mjs';
import { admin } from '../../plugins/admin/index.mjs';
import { genericOAuth } from '../../plugins/generic-oauth/index.mjs';
import { jwt } from '../../plugins/jwt/index.mjs';
import { multiSession } from '../../plugins/multi-session/index.mjs';
import { emailOTP } from '../../plugins/email-otp/index.mjs';
import { Store } from '../../types/index.mjs';
import { sso } from '../../plugins/sso/index.mjs';
import { oidcProvider } from '../../plugins/oidc-provider/index.mjs';
import { a as apiKey } from '../../shared/better-auth.DCH7RxHm.mjs';
import { oneTimeToken } from '../../plugins/one-time-token/index.mjs';
export * from '@simplewebauthn/server';
import 'zod';
import 'better-call';
import '../../plugins/organization/access/index.mjs';
import '../../shared/better-auth.CggyDr6H.mjs';
import 'jose';
import 'kysely';
import 'better-sqlite3';
import 'bun:sqlite';

interface OrganizationClientOptions {
    ac?: AccessControl;
    roles?: {
        [key in string]: Role;
    };
    teams?: {
        enabled: boolean;
    };
}
declare const organizationClient: <O extends OrganizationClientOptions>(options?: O) => {
    id: "organization";
    $InferServerPlugin: ReturnType<typeof organization<{
        ac: O["ac"] extends AccessControl ? O["ac"] : AccessControl<{
            readonly organization: readonly ["update", "delete"];
            readonly member: readonly ["create", "update", "delete"];
            readonly invitation: readonly ["create", "cancel"];
            readonly team: readonly ["create", "update", "delete"];
        }>;
        roles: O["roles"] extends Record<string, Role> ? O["roles"] : {
            admin: Role;
            member: Role;
            owner: Role;
        };
        teams: {
            enabled: O["teams"] extends {
                enabled: true;
            } ? true : false;
        };
    }>>;
    getActions: ($fetch: _better_fetch_fetch.BetterFetch) => {
        $Infer: {
            ActiveOrganization: O["teams"] extends {
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
            };
            Organization: Organization;
            Invitation: InferInvitation<O>;
            Member: InferMember<O>;
            Team: Team;
        };
        organization: {
            checkRolePermission: <R extends O extends {
                roles: any;
            } ? keyof O["roles"] : "admin" | "member" | "owner">(data: ({
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
                role: R;
            }) => boolean;
        };
    };
    getAtoms: ($fetch: _better_fetch_fetch.BetterFetch) => {
        $listOrg: nanostores.PreinitializedWritableAtom<boolean> & object;
        $activeOrgSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
        $activeMemberSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
        activeOrganization: nanostores.PreinitializedWritableAtom<{
            data: Prettify<{
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            } & {
                members: (Member & {
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        image: string | undefined;
                    };
                })[];
                invitations: Invitation[];
            }> | null;
            error: null | _better_fetch_fetch.BetterFetchError;
            isPending: boolean;
            isRefetching: boolean;
            refetch: () => void;
        }> & object;
        listOrganizations: nanostores.PreinitializedWritableAtom<{
            data: {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
                metadata?: any;
                logo?: string | null | undefined;
            }[] | null;
            error: null | _better_fetch_fetch.BetterFetchError;
            isPending: boolean;
            isRefetching: boolean;
            refetch: () => void;
        }> & object;
        activeMember: nanostores.PreinitializedWritableAtom<{
            data: {
                id: string;
                createdAt: Date;
                userId: string;
                organizationId: string;
                role: string;
                teamId?: string | undefined;
            } | null;
            error: null | _better_fetch_fetch.BetterFetchError;
            isPending: boolean;
            isRefetching: boolean;
            refetch: () => void;
        }> & object;
    };
    pathMethods: {
        "/organization/get-full-organization": "GET";
    };
    atomListeners: ({
        matcher(path: string): path is "/organization/create" | "/organization/update" | "/organization/delete";
        signal: "$listOrg";
    } | {
        matcher(path: string): boolean;
        signal: "$activeOrgSignal";
    } | {
        matcher(path: string): boolean;
        signal: "$sessionSignal";
    } | {
        matcher(path: string): boolean;
        signal: "$activeMemberSignal";
    })[];
};

declare const usernameClient: () => {
    id: "username";
    $InferServerPlugin: ReturnType<typeof username>;
};

declare const getPasskeyActions: ($fetch: BetterFetch, { $listPasskeys, }: {
    $listPasskeys: ReturnType<typeof atom<any>>;
}) => {
    signIn: {
        /**
         * Sign in with a registered passkey
         */
        passkey: (opts?: {
            autoFill?: boolean;
            email?: string;
            fetchOptions?: BetterFetchOption;
        }, options?: BetterFetchOption) => Promise<{
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | undefined>;
    };
    passkey: {
        /**
         * Add a passkey to the user account
         */
        addPasskey: (opts?: {
            fetchOptions?: BetterFetchOption;
            /**
             * The name of the passkey. This is used to
             * identify the passkey in the UI.
             */
            name?: string;
            /**
             * The type of attachment for the passkey. Defaults to both
             * platform and cross-platform allowed, with platform preferred.
             */
            authenticatorAttachment?: "platform" | "cross-platform";
            /**
             * Try to silently create a passkey with the password manager that the user just signed
             * in with.
             * @default false
             */
            useAutoRegister?: boolean;
        }, fetchOpts?: BetterFetchOption) => Promise<{
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | undefined>;
    };
    /**
     * Inferred Internal Types
     */
    $Infer: {
        Passkey: Passkey;
    };
};
declare const passkeyClient: () => {
    id: "passkey";
    $InferServerPlugin: ReturnType<typeof passkey>;
    getActions: ($fetch: BetterFetch) => {
        signIn: {
            /**
             * Sign in with a registered passkey
             */
            passkey: (opts?: {
                autoFill?: boolean;
                email?: string;
                fetchOptions?: BetterFetchOption;
            }, options?: BetterFetchOption) => Promise<{
                data: null;
                error: {
                    message?: string | undefined;
                    status: number;
                    statusText: string;
                };
            } | undefined>;
        };
        passkey: {
            /**
             * Add a passkey to the user account
             */
            addPasskey: (opts?: {
                fetchOptions?: BetterFetchOption;
                /**
                 * The name of the passkey. This is used to
                 * identify the passkey in the UI.
                 */
                name?: string;
                /**
                 * The type of attachment for the passkey. Defaults to both
                 * platform and cross-platform allowed, with platform preferred.
                 */
                authenticatorAttachment?: "platform" | "cross-platform";
                /**
                 * Try to silently create a passkey with the password manager that the user just signed
                 * in with.
                 * @default false
                 */
                useAutoRegister?: boolean;
            }, fetchOpts?: BetterFetchOption) => Promise<{
                data: null;
                error: {
                    message?: string | undefined;
                    status: number;
                    statusText: string;
                };
            } | undefined>;
        };
        /**
         * Inferred Internal Types
         */
        $Infer: {
            Passkey: Passkey;
        };
    };
    getAtoms($fetch: BetterFetch): {
        listPasskeys: nanostores.PreinitializedWritableAtom<{
            data: Passkey[] | null;
            error: null | _better_fetch_fetch.BetterFetchError;
            isPending: boolean;
            isRefetching: boolean;
            refetch: () => void;
        }> & object;
        $listPasskeys: nanostores.PreinitializedWritableAtom<any> & object;
    };
    pathMethods: {
        "/passkey/register": "POST";
        "/passkey/authenticate": "POST";
    };
    atomListeners: {
        matcher(path: string): path is "/passkey/verify-registration" | "/passkey/delete-passkey" | "/passkey/update-passkey";
        signal: "_listPasskeys";
    }[];
};

declare const magicLinkClient: () => {
    id: "magic-link";
    $InferServerPlugin: ReturnType<typeof magicLink>;
};

declare const phoneNumberClient: () => {
    id: "phoneNumber";
    $InferServerPlugin: ReturnType<typeof phoneNumber>;
    atomListeners: {
        matcher(path: string): path is "/phone-number/verify" | "/phone-number/update";
        signal: "$sessionSignal";
    }[];
};

declare const anonymousClient: () => {
    id: "anonymous";
    $InferServerPlugin: ReturnType<typeof anonymous>;
    pathMethods: {
        "/sign-in/anonymous": "POST";
    };
};

declare const inferAdditionalFields: <T, S extends {
    user?: {
        [key: string]: FieldAttribute;
    };
    session?: {
        [key: string]: FieldAttribute;
    };
} = {}>(schema?: S) => {
    id: "additional-fields-client";
    $InferServerPlugin: ((T extends BetterAuthOptions ? T : T extends {
        options: BetterAuthOptions;
    } ? T["options"] : never) extends never ? S extends {
        user?: {
            [key: string]: FieldAttribute;
        };
        session?: {
            [key: string]: FieldAttribute;
        };
    } ? {
        id: "additional-fields-client";
        schema: {
            user: {
                fields: S["user"] extends object ? S["user"] : {};
            };
            session: {
                fields: S["session"] extends object ? S["session"] : {};
            };
        };
    } : never : (T extends BetterAuthOptions ? T : T extends {
        options: BetterAuthOptions;
    } ? T["options"] : never) extends BetterAuthOptions ? {
        id: "additional-fields";
        schema: {
            user: {
                fields: (T extends BetterAuthOptions ? T : T extends {
                    options: BetterAuthOptions;
                } ? T["options"] : never)["user"] extends {
                    additionalFields: infer U;
                } ? U : {};
            };
            session: {
                fields: (T extends BetterAuthOptions ? T : T extends {
                    options: BetterAuthOptions;
                } ? T["options"] : never)["session"] extends {
                    additionalFields: infer U;
                } ? U : {};
            };
        };
    } : never) extends BetterAuthPlugin ? (T extends BetterAuthOptions ? T : T extends {
        options: BetterAuthOptions;
    } ? T["options"] : never) extends never ? S extends {
        user?: {
            [key: string]: FieldAttribute;
        };
        session?: {
            [key: string]: FieldAttribute;
        };
    } ? {
        id: "additional-fields-client";
        schema: {
            user: {
                fields: S["user"] extends object ? S["user"] : {};
            };
            session: {
                fields: S["session"] extends object ? S["session"] : {};
            };
        };
    } : never : (T extends BetterAuthOptions ? T : T extends {
        options: BetterAuthOptions;
    } ? T["options"] : never) extends BetterAuthOptions ? {
        id: "additional-fields";
        schema: {
            user: {
                fields: (T extends BetterAuthOptions ? T : T extends {
                    options: BetterAuthOptions;
                } ? T["options"] : never)["user"] extends {
                    additionalFields: infer U;
                } ? U : {};
            };
            session: {
                fields: (T extends BetterAuthOptions ? T : T extends {
                    options: BetterAuthOptions;
                } ? T["options"] : never)["session"] extends {
                    additionalFields: infer U;
                } ? U : {};
            };
        };
    } : never : undefined;
};

interface AdminClientOptions {
    ac?: AccessControl;
    roles?: {
        [key in string]: Role;
    };
}
declare const adminClient: <O extends AdminClientOptions>(options?: O) => {
    id: "admin-client";
    $InferServerPlugin: ReturnType<typeof admin<{
        ac: O["ac"] extends AccessControl ? O["ac"] : AccessControl<{
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>;
        roles: O["roles"] extends Record<string, Role> ? O["roles"] : {
            admin: Role;
            user: Role;
        };
    }>>;
    getActions: ($fetch: _better_fetch_fetch.BetterFetch) => {
        admin: {
            checkRolePermission: <R extends O extends {
                roles: any;
            } ? keyof O["roles"] : "admin" | "user">(data: ({
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
                role: R;
            }) => boolean;
        };
    };
    pathMethods: {
        "/admin/list-users": "GET";
        "/admin/stop-impersonating": "POST";
    };
};

declare const genericOAuthClient: () => {
    id: "generic-oauth-client";
    $InferServerPlugin: ReturnType<typeof genericOAuth>;
};

declare const jwtClient: () => {
    id: "better-auth-client";
    $InferServerPlugin: ReturnType<typeof jwt>;
};

declare const multiSessionClient: () => {
    id: "multi-session";
    $InferServerPlugin: ReturnType<typeof multiSession>;
    atomListeners: {
        matcher(path: string): path is "/multi-session/set-active";
        signal: "$sessionSignal";
    }[];
};

declare const emailOTPClient: () => {
    id: "email-otp";
    $InferServerPlugin: ReturnType<typeof emailOTP>;
};

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (callback?: (notification: any) => void) => void;
                };
            };
        };
        googleScriptInitialized?: boolean;
    }
}
interface GoogleOneTapOptions {
    /**
     * Google client ID
     */
    clientId: string;
    /**
     * Auto select the account if the user is already signed in
     */
    autoSelect?: boolean;
    /**
     * Cancel the flow when the user taps outside the prompt
     */
    cancelOnTapOutside?: boolean;
    /**
     * The mode to use for the Google One Tap flow
     *
     * popup: Use a popup window
     * redirect: Redirect the user to the Google One Tap flow
     *
     * @default "popup"
     */
    uxMode?: "popup" | "redirect";
    /**
     * The context to use for the Google One Tap flow. See https://developers.google.com/identity/gsi/web/reference/js-reference
     *
     * @default "signin"
     */
    context?: "signin" | "signup" | "use";
    /**
     * Additional configuration options to pass to the Google One Tap API.
     */
    additionalOptions?: Record<string, any>;
    /**
     * Configuration options for the prompt and exponential backoff behavior.
     */
    promptOptions?: {
        /**
         * Base delay (in milliseconds) for exponential backoff.
         * @default 1000
         */
        baseDelay?: number;
        /**
         * Maximum number of prompt attempts before calling onPromptNotification.
         * @default 5
         */
        maxAttempts?: number;
    };
}
interface GoogleOneTapActionOptions extends Omit<GoogleOneTapOptions, "clientId" | "promptOptions"> {
    fetchOptions?: BetterFetchOption;
    /**
     * Callback URL.
     */
    callbackURL?: string;
    /**
     * Optional callback that receives the prompt notification if (or when) the prompt is dismissed or skipped.
     * This lets you render an alternative UI (e.g. a Google Sign-In button) to restart the process.
     */
    onPromptNotification?: (notification: any) => void;
}
declare const oneTapClient: (options: GoogleOneTapOptions) => {
    id: "one-tap";
    getActions: ($fetch: _better_fetch_fetch.BetterFetch, _: Store) => {
        oneTap: (opts?: GoogleOneTapActionOptions, fetchOptions?: BetterFetchOption) => Promise<void>;
    };
    getAtoms($fetch: _better_fetch_fetch.BetterFetch): {};
};

declare const customSessionClient: <A extends {
    options: BetterAuthOptions;
}>() => {
    id: "infer-server-plugin";
    $InferServerPlugin: (A extends {
        options: infer O;
    } ? O : A)["plugins"] extends (infer P)[] ? P extends {
        id: "custom-session";
    } ? P : never : never;
};

declare const InferServerPlugin: <AuthOrOption extends BetterAuthOptions | {
    options: BetterAuthOptions;
}, ID extends string>() => {
    id: "infer-server-plugin";
    $InferServerPlugin: (AuthOrOption extends {
        options: infer O;
    } ? O : AuthOrOption)["plugins"] extends (infer P)[] ? P extends {
        id: ID;
    } ? P : never : never;
};

declare const ssoClient: () => {
    id: "sso-client";
    $InferServerPlugin: ReturnType<typeof sso>;
};

declare const oidcClient: () => {
    id: "oidc-client";
    $InferServerPlugin: ReturnType<typeof oidcProvider>;
};

declare const apiKeyClient: () => {
    id: "api-key";
    $InferServerPlugin: ReturnType<typeof apiKey>;
    pathMethods: {
        "/api-key/create": "POST";
        "/api-key/delete": "POST";
        "/api-key/delete-all-expired-api-keys": "POST";
    };
};

declare const oneTimeTokenClient: () => {
    id: "one-time-token";
    $InferServerPlugin: ReturnType<typeof oneTimeToken>;
};

export { type GoogleOneTapActionOptions, type GoogleOneTapOptions, InferServerPlugin, adminClient, anonymousClient, apiKeyClient, customSessionClient, emailOTPClient, genericOAuthClient, getPasskeyActions, inferAdditionalFields, jwtClient, magicLinkClient, multiSessionClient, oidcClient, oneTapClient, oneTimeTokenClient, organizationClient, passkeyClient, phoneNumberClient, ssoClient, usernameClient };
