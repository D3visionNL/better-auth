import { Kysely } from 'kysely';
import { f as BetterAuthOptions, K as KyselyDatabaseType, g as Adapter } from '../../shared/better-auth.p1j7naQW.mjs';
import { A as AdapterDebugLogs } from '../../shared/better-auth.BsYu_p5e.mjs';
import '../../shared/better-auth.CYegVoq1.mjs';
import 'zod';
import '../../shared/better-auth.BTXFetzv.mjs';
import 'jose';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

declare const createKyselyAdapter: (config: BetterAuthOptions) => Promise<{
    kysely: Kysely<any> | null;
    databaseType: KyselyDatabaseType | null;
}>;

interface KyselyAdapterConfig {
    /**
     * Database type.
     */
    type?: KyselyDatabaseType;
    /**
     * Enable debug logs for the adapter
     *
     * @default false
     */
    debugLogs?: AdapterDebugLogs;
    /**
     * Use plural for table names.
     *
     * @default false
     */
    usePlural?: boolean;
}
declare const kyselyAdapter: (db: Kysely<any>, config?: KyselyAdapterConfig) => (options: BetterAuthOptions) => Adapter;

export { KyselyDatabaseType, createKyselyAdapter, kyselyAdapter };
