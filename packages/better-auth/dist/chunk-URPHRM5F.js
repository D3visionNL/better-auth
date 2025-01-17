import { useAuthQuery } from './chunk-PAQJNMGG.js';
import { startAuthentication, startRegistration, WebAuthnError } from '@simplewebauthn/browser';
import { atom } from 'nanostores';

var getPasskeyActions = ($fetch, {
  $listPasskeys
}) => {
  const signInPasskey = async (opts, options) => {
    const response = await $fetch(
      "/passkey/generate-authenticate-options",
      {
        method: "POST",
        body: {
          email: opts?.email
        }
      }
    );
    if (!response.data) {
      return response;
    }
    try {
      const res = await startAuthentication({
        optionsJSON: response.data,
        useBrowserAutofill: opts?.autoFill
      });
      const verified = await $fetch("/passkey/verify-authentication", {
        body: {
          response: res
        },
        ...opts?.fetchOptions,
        ...options,
        method: "POST"
      });
      if (!verified.data) {
        return verified;
      }
    } catch (e) {
      return {
        data: null,
        error: {
          message: "auth cancelled",
          status: 400,
          statusText: "BAD_REQUEST"
        }
      };
    }
  };
  const registerPasskey = async (opts, fetchOpts) => {
    const options = await $fetch(
      "/passkey/generate-register-options",
      {
        method: "GET"
      }
    );
    if (!options.data) {
      return options;
    }
    try {
      const res = await startRegistration({
        optionsJSON: options.data,
        useAutoRegister: opts?.useAutoRegister
      });
      const verified = await $fetch("/passkey/verify-registration", {
        ...opts?.fetchOptions,
        ...fetchOpts,
        body: {
          response: res,
          name: opts?.name
        },
        method: "POST"
      });
      if (!verified.data) {
        return verified;
      }
      $listPasskeys.set(Math.random());
    } catch (e) {
      if (e instanceof WebAuthnError) {
        if (e.code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED") {
          return {
            data: null,
            error: {
              message: "previously registered",
              status: 400,
              statusText: "BAD_REQUEST"
            }
          };
        }
        if (e.code === "ERROR_CEREMONY_ABORTED") {
          return {
            data: null,
            error: {
              message: "registration cancelled",
              status: 400,
              statusText: "BAD_REQUEST"
            }
          };
        }
        return {
          data: null,
          error: {
            message: e.message,
            status: 400,
            statusText: "BAD_REQUEST"
          }
        };
      }
      return {
        data: null,
        error: {
          message: e instanceof Error ? e.message : "unknown error",
          status: 500,
          statusText: "INTERNAL_SERVER_ERROR"
        }
      };
    }
  };
  return {
    signIn: {
      /**
       * Sign in with a registered passkey
       */
      passkey: signInPasskey
    },
    passkey: {
      /**
       * Add a passkey to the user account
       */
      addPasskey: registerPasskey
    },
    /**
     * Inferred Internal Types
     */
    $Infer: {}
  };
};
var passkeyClient = () => {
  const $listPasskeys = atom();
  return {
    id: "passkey",
    $InferServerPlugin: {},
    getActions: ($fetch) => getPasskeyActions($fetch, {
      $listPasskeys
    }),
    getAtoms($fetch) {
      const listPasskeys = useAuthQuery(
        $listPasskeys,
        "/passkey/list-user-passkeys",
        $fetch,
        {
          method: "GET"
        }
      );
      return {
        listPasskeys,
        $listPasskeys
      };
    },
    pathMethods: {
      "/passkey/register": "POST",
      "/passkey/authenticate": "POST"
    },
    atomListeners: [
      {
        matcher(path) {
          return path === "/passkey/verify-registration" || path === "/passkey/delete-passkey" || path === "/passkey/update-passkey";
        },
        signal: "_listPasskeys"
      }
    ]
  };
};

export { getPasskeyActions, passkeyClient };
