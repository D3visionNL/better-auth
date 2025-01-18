import { B as BetterAuthOptions, A as Adapter } from '../auth-BA0Kj1M6.js';
import 'kysely';
import 'better-call';
import 'zod';
import '../helper-Bi8FQwDD.js';
import '../index-l5SennZN.js';
import 'jose';
import 'better-sqlite3';

interface AdapterTestOptions {
    getAdapter: (customOptions?: Omit<BetterAuthOptions, "database">) => Promise<Adapter>;
    skipGenerateIdTest?: boolean;
}
declare function runAdapterTest(opts: AdapterTestOptions): Promise<void>;

export { runAdapterTest };
