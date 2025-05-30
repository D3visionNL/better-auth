import { B as BetterAuthOptions, a as Adapter } from '../shared/better-auth.C67OuOdK.cjs';
import '../shared/better-auth.Bi8FQwDD.cjs';
import 'zod';
import '../shared/better-auth.BgtukYVC.cjs';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

interface AdapterTestOptions {
    getAdapter: (customOptions?: Omit<BetterAuthOptions, "database">) => Promise<Adapter>;
    disableTests?: Partial<Record<keyof typeof adapterTests, boolean>>;
    testPrefix?: string;
}
interface NumberIdAdapterTestOptions {
    getAdapter: (customOptions?: Omit<BetterAuthOptions, "database">) => Promise<Adapter>;
    disableTests?: Partial<Record<keyof typeof numberIdAdapterTests, boolean>>;
    testPrefix?: string;
}
declare const adapterTests: {
    readonly CREATE_MODEL: "create model";
    readonly CREATE_MODEL_SHOULD_ALWAYS_RETURN_AN_ID: "create model should always return an id";
    readonly FIND_MODEL: "find model";
    readonly FIND_MODEL_WITHOUT_ID: "find model without id";
    readonly FIND_MODEL_WITH_SELECT: "find model with select";
    readonly FIND_MODEL_WITH_MODIFIED_FIELD_NAME: "find model with modified field name";
    readonly UPDATE_MODEL: "update model";
    readonly SHOULD_FIND_MANY: "should find many";
    readonly SHOULD_FIND_MANY_WITH_WHERE: "should find many with where";
    readonly SHOULD_FIND_MANY_WITH_OPERATORS: "should find many with operators";
    readonly SHOULD_WORK_WITH_REFERENCE_FIELDS: "should work with reference fields";
    readonly SHOULD_FIND_MANY_WITH_SORT_BY: "should find many with sortBy";
    readonly SHOULD_FIND_MANY_WITH_LIMIT: "should find many with limit";
    readonly SHOULD_FIND_MANY_WITH_OFFSET: "should find many with offset";
    readonly SHOULD_UPDATE_WITH_MULTIPLE_WHERE: "should update with multiple where";
    readonly DELETE_MODEL: "delete model";
    readonly SHOULD_DELETE_MANY: "should delete many";
    readonly SHOULD_NOT_THROW_ON_DELETE_RECORD_NOT_FOUND: "shouldn't throw on delete record not found";
    readonly SHOULD_NOT_THROW_ON_RECORD_NOT_FOUND: "shouldn't throw on record not found";
    readonly SHOULD_FIND_MANY_WITH_CONTAINS_OPERATOR: "should find many with contains operator";
    readonly SHOULD_SEARCH_USERS_WITH_STARTS_WITH: "should search users with startsWith";
    readonly SHOULD_SEARCH_USERS_WITH_ENDS_WITH: "should search users with endsWith";
    readonly SHOULD_PREFER_GENERATE_ID_IF_PROVIDED: "should prefer generateId if provided";
};
declare const numberIdAdapterTests: {
    readonly SHOULD_RETURN_A_NUMBER_ID_AS_A_RESULT: "Should return a number id as a result";
    readonly SHOULD_INCREMENT_THE_ID_BY_1: "Should increment the id by 1";
    readonly CREATE_MODEL: "create model";
    readonly CREATE_MODEL_SHOULD_ALWAYS_RETURN_AN_ID: "create model should always return an id";
    readonly FIND_MODEL: "find model";
    readonly FIND_MODEL_WITHOUT_ID: "find model without id";
    readonly FIND_MODEL_WITH_SELECT: "find model with select";
    readonly FIND_MODEL_WITH_MODIFIED_FIELD_NAME: "find model with modified field name";
    readonly UPDATE_MODEL: "update model";
    readonly SHOULD_FIND_MANY: "should find many";
    readonly SHOULD_FIND_MANY_WITH_WHERE: "should find many with where";
    readonly SHOULD_FIND_MANY_WITH_OPERATORS: "should find many with operators";
    readonly SHOULD_WORK_WITH_REFERENCE_FIELDS: "should work with reference fields";
    readonly SHOULD_FIND_MANY_WITH_SORT_BY: "should find many with sortBy";
    readonly SHOULD_FIND_MANY_WITH_LIMIT: "should find many with limit";
    readonly SHOULD_FIND_MANY_WITH_OFFSET: "should find many with offset";
    readonly SHOULD_UPDATE_WITH_MULTIPLE_WHERE: "should update with multiple where";
    readonly DELETE_MODEL: "delete model";
    readonly SHOULD_DELETE_MANY: "should delete many";
    readonly SHOULD_NOT_THROW_ON_DELETE_RECORD_NOT_FOUND: "shouldn't throw on delete record not found";
    readonly SHOULD_NOT_THROW_ON_RECORD_NOT_FOUND: "shouldn't throw on record not found";
    readonly SHOULD_FIND_MANY_WITH_CONTAINS_OPERATOR: "should find many with contains operator";
    readonly SHOULD_SEARCH_USERS_WITH_STARTS_WITH: "should search users with startsWith";
    readonly SHOULD_SEARCH_USERS_WITH_ENDS_WITH: "should search users with endsWith";
    readonly SHOULD_PREFER_GENERATE_ID_IF_PROVIDED: "should prefer generateId if provided";
};
declare function runAdapterTest(opts: AdapterTestOptions): Promise<void>;
declare function runNumberIdAdapterTest(opts: NumberIdAdapterTestOptions): Promise<void>;

export { runAdapterTest, runNumberIdAdapterTest };
