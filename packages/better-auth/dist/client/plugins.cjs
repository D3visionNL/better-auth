'use strict';

var chunkYLFV4SQL_cjs = require('../chunk-YLFV4SQL.cjs');
var chunkCF7NIEGH_cjs = require('../chunk-CF7NIEGH.cjs');
var chunk2X5G64P2_cjs = require('../chunk-2X5G64P2.cjs');
require('../chunk-RBN34WVC.cjs');
var chunkCXGP5FNG_cjs = require('../chunk-CXGP5FNG.cjs');
require('../chunk-U4I57HJ4.cjs');
require('../chunk-S5UORXJH.cjs');
require('../chunk-CCKQSGIR.cjs');
require('../chunk-VXYIYABQ.cjs');
var chunkPEZRSDZS_cjs = require('../chunk-PEZRSDZS.cjs');
var nanostores = require('nanostores');

var organizationClient = (options) => {
  const $listOrg = nanostores.atom(false);
  const $activeOrgSignal = nanostores.atom(false);
  const $activeMemberSignal = nanostores.atom(false);
  const roles = {
    admin: chunk2X5G64P2_cjs.adminAc,
    member: chunk2X5G64P2_cjs.memberAc,
    owner: chunk2X5G64P2_cjs.ownerAc,
    ...options?.roles
  };
  return {
    id: "organization",
    $InferServerPlugin: {},
    getActions: ($fetch) => ({
      $Infer: {
        ActiveOrganization: {},
        Organization: {},
        Invitation: {},
        Member: {}
      },
      organization: {
        checkRolePermission: (data) => {
          if (Object.keys(data.permission).length > 1) {
            throw new chunkPEZRSDZS_cjs.BetterAuthError(
              "you can only check one resource permission at a time."
            );
          }
          const role = roles[data.role];
          if (!role) {
            return false;
          }
          const isAuthorized = role?.authorize(data.permission);
          return isAuthorized.success;
        }
      }
    }),
    getAtoms: ($fetch) => {
      const listOrganizations = chunkCXGP5FNG_cjs.useAuthQuery(
        $listOrg,
        "/organization/list",
        $fetch,
        {
          method: "GET"
        }
      );
      const activeOrganization = chunkCXGP5FNG_cjs.useAuthQuery(
        [$activeOrgSignal],
        "/organization/get-full-organization",
        $fetch,
        () => ({
          method: "GET"
        })
      );
      const activeMember = chunkCXGP5FNG_cjs.useAuthQuery(
        [$activeMemberSignal],
        "/organization/get-active-member",
        $fetch,
        {
          method: "GET"
        }
      );
      return {
        $listOrg,
        $activeOrgSignal,
        $activeMemberSignal,
        activeOrganization,
        listOrganizations,
        activeMember
      };
    },
    pathMethods: {
      "/organization/get-full-organization": "GET"
    },
    atomListeners: [
      {
        matcher(path) {
          return path === "/organization/create" || path === "/organization/delete" || path === "/organization/update";
        },
        signal: "$listOrg"
      },
      {
        matcher(path) {
          return path.startsWith("/organization");
        },
        signal: "$activeOrgSignal"
      },
      {
        matcher(path) {
          return path.includes("/organization/update-member-role");
        },
        signal: "$activeMemberSignal"
      }
    ]
  };
};

// src/plugins/username/client.ts
var usernameClient = () => {
  return {
    id: "username",
    $InferServerPlugin: {}
  };
};

// src/plugins/magic-link/client.ts
var magicLinkClient = () => {
  return {
    id: "magic-link",
    $InferServerPlugin: {}
  };
};

// src/plugins/phone-number/client.ts
var phoneNumberClient = () => {
  return {
    id: "phoneNumber",
    $InferServerPlugin: {},
    atomListeners: [
      {
        matcher(path) {
          return path === "/phone-number/update" || path === "/phone-number/verify";
        },
        signal: "$sessionSignal"
      }
    ]
  };
};

// src/plugins/anonymous/client.ts
var anonymousClient = () => {
  return {
    id: "anonymous",
    $InferServerPlugin: {},
    pathMethods: {
      "/sign-in/anonymous": "POST"
    }
  };
};

// src/plugins/additional-fields/client.ts
var inferAdditionalFields = (schema) => {
  return {
    id: "additional-fields-client",
    $InferServerPlugin: {}
  };
};

// src/plugins/admin/client.ts
var adminClient = () => {
  return {
    id: "better-auth-client",
    $InferServerPlugin: {},
    pathMethods: {
      "/admin/list-users": "GET",
      "/admin/stop-impersonating": "POST"
    }
  };
};

// src/plugins/generic-oauth/client.ts
var genericOAuthClient = () => {
  return {
    id: "generic-oauth-client",
    $InferServerPlugin: {}
  };
};

// src/plugins/jwt/client.ts
var jwtClient = () => {
  return {
    id: "better-auth-client",
    $InferServerPlugin: {}
  };
};

// src/plugins/multi-session/client.ts
var multiSessionClient = () => {
  return {
    id: "multi-session",
    $InferServerPlugin: {},
    atomListeners: [
      {
        matcher(path) {
          return path === "/multi-session/set-active";
        },
        signal: "$sessionSignal"
      }
    ]
  };
};

// src/plugins/email-otp/client.ts
var emailOTPClient = () => {
  return {
    id: "email-otp",
    $InferServerPlugin: {}
  };
};

// src/plugins/one-tap/client.ts
var isRequestInProgress = false;
var oneTapClient = (options) => {
  return {
    id: "one-tap",
    getActions: ($fetch, _) => ({
      oneTap: async (opts, fetchOptions) => {
        if (isRequestInProgress) {
          console.warn(
            "A Google One Tap request is already in progress. Please wait."
          );
          return;
        }
        isRequestInProgress = true;
        try {
          if (typeof window === "undefined" || !window.document) {
            console.warn(
              "Google One Tap is only available in browser environments"
            );
            return;
          }
          const { autoSelect, cancelOnTapOutside, context } = opts ?? {};
          const contextValue = context ?? options.context ?? "signin";
          await loadGoogleScript();
          await new Promise((resolve) => {
            window.google?.accounts.id.initialize({
              client_id: options.clientId,
              callback: async (response) => {
                await $fetch("/one-tap/callback", {
                  method: "POST",
                  body: { idToken: response.credential },
                  ...opts?.fetchOptions,
                  ...fetchOptions
                });
                if (!opts?.fetchOptions && !fetchOptions || opts?.callbackURL) {
                  window.location.href = opts?.callbackURL ?? "/";
                }
                resolve();
              },
              auto_select: autoSelect,
              cancel_on_tap_outside: cancelOnTapOutside,
              context: contextValue
            });
            window.google?.accounts.id.prompt();
          });
        } catch (error) {
          console.error("Error during Google One Tap flow:", error);
          throw error;
        } finally {
          isRequestInProgress = false;
        }
      }
    }),
    getAtoms($fetch) {
      return {};
    }
  };
};
var loadGoogleScript = () => {
  return new Promise((resolve) => {
    if (window.googleScriptInitialized) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.googleScriptInitialized = true;
      resolve();
    };
    document.head.appendChild(script);
  });
};

// src/plugins/custom-session/client.ts
var customSessionClient = () => {
  return InferServerPlugin();
};

// src/client/plugins/infer-plugin.ts
var InferServerPlugin = () => {
  return {
    id: "infer-server-plugin",
    $InferServerPlugin: {}
  };
};

// src/plugins/sso/client.ts
var ssoClient = () => {
  return {
    id: "sso-client",
    $InferServerPlugin: {}
  };
};

// src/plugins/oidc-provider/client.ts
var oidcClient = () => {
  return {
    id: "oidc-client",
    $InferServerPlugin: {}
  };
};

Object.defineProperty(exports, "getPasskeyActions", {
  enumerable: true,
  get: function () { return chunkYLFV4SQL_cjs.getPasskeyActions; }
});
Object.defineProperty(exports, "passkeyClient", {
  enumerable: true,
  get: function () { return chunkYLFV4SQL_cjs.passkeyClient; }
});
Object.defineProperty(exports, "twoFactorClient", {
  enumerable: true,
  get: function () { return chunkCF7NIEGH_cjs.twoFactorClient; }
});
exports.InferServerPlugin = InferServerPlugin;
exports.adminClient = adminClient;
exports.anonymousClient = anonymousClient;
exports.customSessionClient = customSessionClient;
exports.emailOTPClient = emailOTPClient;
exports.genericOAuthClient = genericOAuthClient;
exports.inferAdditionalFields = inferAdditionalFields;
exports.jwtClient = jwtClient;
exports.magicLinkClient = magicLinkClient;
exports.multiSessionClient = multiSessionClient;
exports.oidcClient = oidcClient;
exports.oneTapClient = oneTapClient;
exports.organizationClient = organizationClient;
exports.phoneNumberClient = phoneNumberClient;
exports.ssoClient = ssoClient;
exports.usernameClient = usernameClient;
