import { Kysely } from 'kysely';
import { B as BetterAuthOptions, K as KyselyDatabaseType, A as AdapterDebugLogs, a as Adapter } from '../../shared/better-auth.kHOzQ3TU.mjs';
import '../../shared/better-auth.Bi8FQwDD.mjs';
import 'zod';
import '../../shared/better-auth.CggyDr6H.mjs';
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
