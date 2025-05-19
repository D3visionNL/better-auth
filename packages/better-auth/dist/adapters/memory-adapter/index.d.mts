import { f as BetterAuthOptions, g as Adapter } from '../../shared/better-auth.p1j7naQW.mjs';
import { A as AdapterDebugLogs } from '../../shared/better-auth.BsYu_p5e.mjs';
import '../../shared/better-auth.CYegVoq1.mjs';
import 'zod';
import '../../shared/better-auth.BTXFetzv.mjs';
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
