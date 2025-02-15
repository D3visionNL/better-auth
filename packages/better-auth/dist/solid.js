import { getClientConfig, createDynamicPathProxy } from './chunk-PAQJNMGG.js';
import './chunk-HVHN3Y2L.js';
import './chunk-XFCIANZX.js';
import { capitalizeFirstLetter } from './chunk-3XTQSPPA.js';
import './chunk-TQQSPPNA.js';
import './chunk-UNWCXKMP.js';
import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';

function useStore(store) {
  const unbindActivation = store.listen(() => {
  });
  const [state, setState] = createStore({
    value: store.get()
  });
  const unsubscribe = store.subscribe((newValue) => {
    setState("value", reconcile(newValue));
  });
  onCleanup(() => unsubscribe());
  unbindActivation();
  return () => state.value;
}

// src/client/solid/index.ts
function getAtomKey(str) {
  return `use${capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    atomListeners
  } = getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[getAtomKey(key)] = () => useStore(value);
  }
  const routes = {
    ...pluginsActions,
    ...resolvedHooks
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
