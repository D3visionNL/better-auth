import { f as BetterAuthOptions, g as Adapter } from '../shared/better-auth.p1j7naQW.mjs';
import { a as AdapterConfig, C as CreateCustomAdapter } from '../shared/better-auth.BsYu_p5e.mjs';
export { A as AdapterDebugLogs, d as AdapterTestDebugLogs, c as CleanedWhere, b as CustomAdapter } from '../shared/better-auth.BsYu_p5e.mjs';
import '../shared/better-auth.CYegVoq1.mjs';
import 'zod';
import '../shared/better-auth.BTXFetzv.mjs';
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
