'use strict';

var chunkCXGP5FNG_cjs = require('./chunk-CXGP5FNG.cjs');
var chunkCCKQSGIR_cjs = require('./chunk-CCKQSGIR.cjs');

// src/client/vanilla.ts
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
    resolvedHooks[`use${chunkCCKQSGIR_cjs.capitalizeFirstLetter(key)}`] = value;
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

// src/client/index.ts
var InferPlugin = () => {
  return {
    id: "infer-server-plugin",
    $InferServerPlugin: {}
  };
};

exports.InferPlugin = InferPlugin;
exports.createAuthClient = createAuthClient;
