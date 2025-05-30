import { A as AdapterDebugLogs, B as BetterAuthOptions, a as Adapter } from '../../shared/better-auth.C67OuOdK.cjs';
import '../../shared/better-auth.Bi8FQwDD.cjs';
import 'zod';
import '../../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

interface DB {
    [key: string]: any;
}
interface DrizzleAdapterConfig {
    /**
     * The schema object that defines the tables and fields
     */
    schema?: Record<string, any>;
    /**
     * The database provider
     */
    provider: "pg" | "mysql" | "sqlite";
    /**
     * If the table names in the schema are plural
     * set this to true. For example, if the schema
     * has an object with a key "users" instead of "user"
     */
    usePlural?: boolean;
    /**
     * Enable debug logs for the adapter
     *
     * @default false
     */
    debugLogs?: AdapterDebugLogs;
}
declare const drizzleAdapter: (db: DB, config: DrizzleAdapterConfig) => (options: BetterAuthOptions) => Adapter;

export { type DB, type DrizzleAdapterConfig, drizzleAdapter };
