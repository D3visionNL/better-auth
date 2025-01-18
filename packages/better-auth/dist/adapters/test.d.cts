import { B as BetterAuthOptions, A as Adapter } from '../auth-xST9BYWZ.cjs';
import 'kysely';
import 'better-call';
import 'zod';
import '../helper-Bi8FQwDD.cjs';
import '../index-D0tmmb_V.cjs';
import 'jose';
import 'better-sqlite3';

interface AdapterTestOptions {
    getAdapter: (customOptions?: Omit<BetterAuthOptions, "database">) => Promise<Adapter>;
    skipGenerateIdTest?: boolean;
}
declare function runAdapterTest(opts: AdapterTestOptions): Promise<void>;

export { runAdapterTest };
