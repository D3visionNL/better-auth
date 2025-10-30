import { A as AdapterDebugLogs, B as BetterAuthOptions, a as Adapter } from '../../shared/better-auth.CfNvkNu2.js';
import '../../shared/better-auth.DTtXpZYr.js';
import 'better-call';
import 'kysely';
import '@better-auth/core/db';
import 'zod';
import '../../shared/better-auth.C6qXK08w.js';
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
