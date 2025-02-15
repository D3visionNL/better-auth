import { getClientConfig, createDynamicPathProxy } from './chunk-PAQJNMGG.js';
import './chunk-HVHN3Y2L.js';
import './chunk-XFCIANZX.js';
import './chunk-TQQSPPNA.js';
import './chunk-UNWCXKMP.js';
import { listenKeys } from 'nanostores';
import { useRef, useCallback, useSyncExternalStore } from 'react';

var emit = (snapshotRef, onChange) => (value) => {
  snapshotRef.current = value;
  onChange();
};
function useStore(store, { keys, deps = [store, keys] } = {}) {
  let snapshotRef = useRef();
  snapshotRef.current = store.get();
  let subscribe = useCallback(
    (onChange) => (keys?.length || 0) > 0 ? listenKeys(store, keys, emit(snapshotRef, onChange)) : store.listen(emit(snapshotRef, onChange)),
    deps
  );
  let get = () => snapshotRef.current;
  return useSyncExternalStore(subscribe, get, get);
}

// src/client/react/index.ts
function getAtomKey(str) {
  return `use${capitalizeFirstLetter(str)}`;
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    $store,
    atomListeners
  } = getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[getAtomKey(key)] = () => useStore(value);
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

export { capitalizeFirstLetter, createAuthClient, useStore };
