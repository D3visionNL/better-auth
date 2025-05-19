import { f as BetterAuthOptions, g as Adapter } from '../shared/better-auth.CpmhGkrr.cjs';
import { a as AdapterConfig, C as CreateCustomAdapter } from '../shared/better-auth.DBYtR3Gh.cjs';
export { A as AdapterDebugLogs, d as AdapterTestDebugLogs, c as CleanedWhere, b as CustomAdapter } from '../shared/better-auth.DBYtR3Gh.cjs';
import '../shared/better-auth.CYegVoq1.cjs';
import 'zod';
import '../shared/better-auth._rXvQlMG.cjs';
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
