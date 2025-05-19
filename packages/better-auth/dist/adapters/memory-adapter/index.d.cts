import { f as BetterAuthOptions, g as Adapter } from '../../shared/better-auth.CpmhGkrr.cjs';
import { A as AdapterDebugLogs } from '../../shared/better-auth.DBYtR3Gh.cjs';
import '../../shared/better-auth.CYegVoq1.cjs';
import 'zod';
import '../../shared/better-auth._rXvQlMG.cjs';
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
