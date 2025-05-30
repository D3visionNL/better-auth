import { Kysely } from 'kysely';
import { B as BetterAuthOptions, K as KyselyDatabaseType, A as AdapterDebugLogs, a as Adapter } from '../../shared/better-auth.C67OuOdK.cjs';
import '../../shared/better-auth.Bi8FQwDD.cjs';
import 'zod';
import '../../shared/better-auth.BgtukYVC.cjs';
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
