import { x as Adapter, B as BetterAuthOptions, W as Where, a5 as FieldAttribute, a6 as FieldType, K as KyselyDatabaseType } from './auth-Wqh-EswE.cjs';
export { ai as BetterAuthDbSchema, a9 as FieldAttributeConfig, ah as InferFieldsFromOptions, ag as InferFieldsFromPlugins, ad as InferFieldsInput, ae as InferFieldsInputClient, ac as InferFieldsOutput, ab as InferValueType, a8 as InternalAdapter, af as PluginFieldAttribute, aa as createFieldAttribute, a7 as createInternalAdapter, aj as getAuthTables } from './auth-Wqh-EswE.cjs';
import { z } from 'zod';
import 'kysely';
import 'better-call';
import './helper-Bi8FQwDD.cjs';
import './index-q7pIlaCQ.cjs';
import 'jose';
import 'better-sqlite3';

declare function getWithHooks(adapter: Adapter, ctx: {
    options: BetterAuthOptions;
    hooks: Exclude<BetterAuthOptions["databaseHooks"], undefined>[];
}): {
    createWithHooks: <T extends Record<string, any>>(data: T, model: "user" | "account" | "session" | "verification", customCreateFn?: {
        fn: (data: Record<string, any>) => void | Promise<any>;
        executeMainFn?: boolean;
    }) => Promise<any>;
    updateWithHooks: <T extends Record<string, any>>(data: any, where: Where[], model: "user" | "account" | "session" | "verification", customUpdateFn?: {
        fn: (data: Record<string, any>) => void | Promise<any>;
        executeMainFn?: boolean;
    }) => Promise<any>;
    updateManyWithHooks: <T extends Record<string, any>>(data: any, where: Where[], model: "user" | "account" | "session" | "verification", customUpdateFn?: {
        fn: (data: Record<string, any>) => void | Promise<any>;
        executeMainFn?: boolean;
    }) => Promise<any>;
};

declare function toZodSchema(fields: Record<string, FieldAttribute>): z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;

declare function getAdapter(options: BetterAuthOptions): Promise<Adapter>;
declare function convertToDB<T extends Record<string, any>>(fields: Record<string, FieldAttribute>, values: T): T;
declare function convertFromDB<T extends Record<string, any>>(fields: Record<string, FieldAttribute>, values: T | null): T | null;

declare function matchType(columnDataType: string, fieldType: FieldType, dbType: KyselyDatabaseType): boolean;
declare function getMigrations(config: BetterAuthOptions): Promise<{
    toBeCreated: {
        table: string;
        fields: Record<string, FieldAttribute>;
        order: number;
    }[];
    toBeAdded: {
        table: string;
        fields: Record<string, FieldAttribute>;
        order: number;
    }[];
    runMigrations: () => Promise<void>;
    compileMigrations: () => Promise<string>;
}>;

declare function getSchema(config: BetterAuthOptions): Record<string, {
    fields: Record<string, FieldAttribute>;
    order: number;
}>;

export { FieldAttribute, FieldType, convertFromDB, convertToDB, getAdapter, getMigrations, getSchema, getWithHooks, matchType, toZodSchema };
