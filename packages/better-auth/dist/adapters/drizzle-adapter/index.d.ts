import { f as BetterAuthOptions, g as Adapter } from '../../shared/better-auth.Cl6aee2s.js';
import { A as AdapterDebugLogs } from '../../shared/better-auth.DYUrg8Mx.js';
import '../../shared/better-auth.CYegVoq1.js';
import 'zod';
import '../../shared/better-auth.Bzjh9zg_.js';
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
