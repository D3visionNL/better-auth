'use strict';

var chunkCXGP5FNG_cjs = require('./chunk-CXGP5FNG.cjs');
require('./chunk-U4I57HJ4.cjs');
require('./chunk-S5UORXJH.cjs');
require('./chunk-VXYIYABQ.cjs');
require('./chunk-PEZRSDZS.cjs');
var nanostores = require('nanostores');
var react = require('react');

var emit = (snapshotRef, onChange) => (value) => {
  snapshotRef.current = value;
  onChange();
};
function useStore(store, { keys, deps = [store, keys] } = {}) {
  let snapshotRef = react.useRef();
  snapshotRef.current = store.get();
  let subscribe = react.useCallback(
    (onChange) => (keys?.length || 0) > 0 ? nanostores.listenKeys(store, keys, emit(snapshotRef, onChange)) : store.listen(emit(snapshotRef, onChange)),
    deps
  );
  let get = () => snapshotRef.current;
  return react.useSyncExternalStore(subscribe, get, get);
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
  } = chunkCXGP5FNG_cjs.getClientConfig(options);
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
  const proxy = chunkCXGP5FNG_cjs.createDynamicPathProxy(
    routes,
    $fetch,
    pluginPathMethods,
    pluginsAtoms,
    atomListeners
  );
  return proxy;
}

exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.createAuthClient = createAuthClient;
exports.useStore = useStore;
