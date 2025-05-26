import { A as AdapterDebugLogs, B as BetterAuthOptions, a as Adapter } from '../../shared/better-auth.8wNVcAAq.js';
import '../../shared/better-auth.Bi8FQwDD.js';
import 'zod';
import '../../shared/better-auth.ByC0y0O-.js';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

interface MemoryDB {
    [key: string]: any[];
}
interface MemoryAdapterConfig {
    debugLogs?: AdapterDebugLogs;
}
declare const memoryAdapter: (db: MemoryDB, config?: MemoryAdapterConfig) => (options: BetterAuthOptions) => Adapter;

export { type MemoryAdapterConfig, type MemoryDB, memoryAdapter };
