'use strict';

var chunkCXGP5FNG_cjs = require('./chunk-CXGP5FNG.cjs');
require('./chunk-U4I57HJ4.cjs');
require('./chunk-S5UORXJH.cjs');
var chunkCCKQSGIR_cjs = require('./chunk-CCKQSGIR.cjs');
require('./chunk-VXYIYABQ.cjs');
require('./chunk-PEZRSDZS.cjs');

// src/client/svelte/index.ts
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    atomListeners,
    $store
  } = chunkCXGP5FNG_cjs.getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[`use${chunkCCKQSGIR_cjs.capitalizeFirstLetter(key)}`] = () => value;
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

exports.createAuthClient = createAuthClient;
