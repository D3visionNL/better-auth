import { B as BetterAuthOptions, a as Adapter, i as AdapterFactoryOptions, j as AdapterFactoryConfig, k as AdapterFactoryCustomizeAdapterCreator } from '../shared/better-auth.CDN3l_op.mjs';
export { A as AdapterDebugLogs, l as AdapterTestDebugLogs, C as CustomAdapter } from '../shared/better-auth.CDN3l_op.mjs';
import '../shared/better-auth.DTtXpZYr.mjs';
import 'better-call';
import 'kysely';
import '@better-auth/core/db';
import 'zod';
import '../shared/better-auth.BHPr8J54.mjs';
import 'better-sqlite3';
import 'bun:sqlite';
import 'node:sqlite';
import 'zod/v4/core';

type AdapterFactory = (options: BetterAuthOptions) => Adapter;
declare const createAdapterFactory: ({ adapter: customAdapter, config: cfg, }: AdapterFactoryOptions) => AdapterFactory;

/**
 * @deprecated Use `createAdapterFactory` instead. This export will be removed in the next major version.
 */
declare const createAdapter: ({ adapter: customAdapter, config: cfg, }: AdapterFactoryOptions) => AdapterFactory;
/**
 * @deprecated Use `AdapterFactoryOptions` instead. This export will be removed in the next major version.
 */
type CreateAdapterOptions = AdapterFactoryOptions;
/**
 * @deprecated Use `AdapterFactoryConfig` instead. This export will be removed in the next major version.
 */
type AdapterConfig = AdapterFactoryConfig;
/**
 * @deprecated Use `AdapterFactoryCustomizeAdapterCreator` instead. This export will be removed in the next major version.
 */
type CreateCustomAdapter = AdapterFactoryCustomizeAdapterCreator;

export { AdapterFactoryConfig, AdapterFactoryCustomizeAdapterCreator, AdapterFactoryOptions, createAdapter, createAdapterFactory };
export type { AdapterConfig, AdapterFactory, CreateAdapterOptions, CreateCustomAdapter };
