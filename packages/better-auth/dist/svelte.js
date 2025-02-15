import { getClientConfig, createDynamicPathProxy } from './chunk-PAQJNMGG.js';
import './chunk-HVHN3Y2L.js';
import './chunk-XFCIANZX.js';
import { capitalizeFirstLetter } from './chunk-3XTQSPPA.js';
import './chunk-TQQSPPNA.js';
import './chunk-UNWCXKMP.js';

// src/client/svelte/index.ts
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    atomListeners,
    $store
  } = getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[`use${capitalizeFirstLetter(key)}`] = () => value;
  }
  const routes = {
    ...pluginsActions,
    ...resolvedHooks,
    $fetch,
    $store
  };
  const proxy = createDynamicPathProxy(
    routes,
    $fetch,
    pluginPathMethods,
    pluginsAtoms,
    atomListeners
  );
  return proxy;
}

export { createAuthClient };
