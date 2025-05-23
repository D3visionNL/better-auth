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

interface PrismaConfig {
    /**
     * Database provider.
     */
    provider: "sqlite" | "cockroachdb" | "mysql" | "postgresql" | "sqlserver" | "mongodb";
    /**
     * Enable debug logs for the adapter
     *
     * @default false
     */
    debugLogs?: AdapterDebugLogs;
    /**
     * Use plural table names
     *
     * @default false
     */
    usePlural?: boolean;
}
interface PrismaClient {
}
declare const prismaAdapter: (prisma: PrismaClient, config: PrismaConfig) => (options: BetterAuthOptions) => Adapter;

export { type PrismaConfig, prismaAdapter };
