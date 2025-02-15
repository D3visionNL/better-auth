'use strict';

var chunkCXGP5FNG_cjs = require('./chunk-CXGP5FNG.cjs');
require('./chunk-U4I57HJ4.cjs');
require('./chunk-S5UORXJH.cjs');
var chunkCCKQSGIR_cjs = require('./chunk-CCKQSGIR.cjs');
require('./chunk-VXYIYABQ.cjs');
require('./chunk-PEZRSDZS.cjs');
var store = require('solid-js/store');
var solidJs = require('solid-js');

function useStore(store$1) {
  const unbindActivation = store$1.listen(() => {
  });
  const [state, setState] = store.createStore({
    value: store$1.get()
  });
  const unsubscribe = store$1.subscribe((newValue) => {
    setState("value", store.reconcile(newValue));
  });
  solidJs.onCleanup(() => unsubscribe());
  unbindActivation();
  return () => state.value;
}

// src/client/solid/index.ts
function getAtomKey(str) {
  return `use${chunkCCKQSGIR_cjs.capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    atomListeners
  } = chunkCXGP5FNG_cjs.getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[getAtomKey(key)] = () => useStore(value);
  }
  const routes = {
    ...pluginsActions,
    ...resolvedHooks
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
