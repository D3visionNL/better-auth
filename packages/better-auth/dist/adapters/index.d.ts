import { f as BetterAuthOptions, g as Adapter } from '../shared/better-auth.Cl6aee2s.js';
import { a as AdapterConfig, C as CreateCustomAdapter } from '../shared/better-auth.DYUrg8Mx.js';
export { A as AdapterDebugLogs, d as AdapterTestDebugLogs, c as CleanedWhere, b as CustomAdapter } from '../shared/better-auth.DYUrg8Mx.js';
import '../shared/better-auth.CYegVoq1.js';
import 'zod';
import '../shared/better-auth.Bzjh9zg_.js';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

declare const createAdapter: ({ adapter, config: cfg, }: {
    config: AdapterConfig;
    adapter: CreateCustomAdapter;
}) => (options: BetterAuthOptions) => Adapter;

export { AdapterConfig, CreateCustomAdapter, createAdapter };
