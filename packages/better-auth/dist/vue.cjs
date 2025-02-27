'use strict';

var chunkCXGP5FNG_cjs = require('./chunk-CXGP5FNG.cjs');
require('./chunk-U4I57HJ4.cjs');
require('./chunk-S5UORXJH.cjs');
var chunkCCKQSGIR_cjs = require('./chunk-CCKQSGIR.cjs');
require('./chunk-VXYIYABQ.cjs');
require('./chunk-PEZRSDZS.cjs');
var vue = require('vue');

function registerStore(store) {
  let instance = vue.getCurrentInstance();
  if (instance && instance.proxy) {
    let vm = instance.proxy;
    let cache = "_nanostores" in vm ? vm._nanostores : vm._nanostores = [];
    cache.push(store);
  }
}
function useStore(store) {
  let state = vue.shallowRef();
  let unsubscribe = store.subscribe((value) => {
    state.value = value;
  });
  vue.getCurrentScope() && vue.onScopeDispose(unsubscribe);
  if (process.env.NODE_ENV !== "production") {
    registerStore(store);
    return vue.readonly(state);
  }
  return state;
}

// src/client/vue/index.ts
function getAtomKey(str) {
  return `use${chunkCCKQSGIR_cjs.capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    $store,
    atomListeners
  } = chunkCXGP5FNG_cjs.getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[getAtomKey(key)] = () => useStore(value);
  }
  function useSession(useFetch) {
    if (useFetch) {
      const ref = useStore(pluginsAtoms.$sessionSignal);
      const baseURL = options?.fetchOptions?.baseURL || options?.baseURL;
      let authPath = baseURL ? new URL(baseURL).pathname : "/api/auth";
      authPath = authPath === "/" ? "/api/auth" : authPath;
      authPath = authPath.endsWith("/") ? authPath.slice(0, -1) : authPath;
      return useFetch(`${authPath}/get-session`, {
        ref
      }).then((res) => {
        return {
          data: res.data,
          isPending: false,
          error: res.error
        };
      });
    }
    return resolvedHooks.useSession();
  }
  const routes = {
    ...pluginsActions,
    ...resolvedHooks,
    useSession,
    $fetch,
    $store
  };
  const proxy = chunkCXGP5FNG_cjs.createDynamicPathProxy(
    routes,
    $fetch,
    pluginPathMethods,
    pluginsAtoms,
    atomListeners
  );
  return proxy;
}

exports.createAuthClient = createAuthClient;
