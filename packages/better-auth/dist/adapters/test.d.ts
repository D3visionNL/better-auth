import { B as BetterAuthOptions, A as Adapter } from '../auth-8UPh7J8A.js';
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
