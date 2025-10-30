import { A as AdapterDebugLogs, B as BetterAuthOptions, a as Adapter } from '../../shared/better-auth.CDN3l_op.mjs';
import '../../shared/better-auth.DTtXpZYr.mjs';
import 'better-call';
import 'kysely';
import '@better-auth/core/db';
import 'zod';
import '../../shared/better-auth.BHPr8J54.mjs';
import 'better-sqlite3';
import 'bun:sqlite';
import 'node:sqlite';
import 'zod/v4/core';

interface MemoryDB {
    [key: string]: any[];
}
interface MemoryAdapterConfig {
    debugLogs?: AdapterDebugLogs;
}
declare const memoryAdapter: (db: MemoryDB, config?: MemoryAdapterConfig) => (options: BetterAuthOptions) => Adapter;

export { memoryAdapter };
export type { MemoryAdapterConfig, MemoryDB };
