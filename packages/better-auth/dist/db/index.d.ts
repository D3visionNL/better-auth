import { a as Adapter, B as BetterAuthOptions, G as GenericEndpointContext, W as Where, a1 as FieldAttribute, a2 as FieldType, K as KyselyDatabaseType } from '../shared/better-auth.BNRr97iY.js';
export { ae as BetterAuthDbSchema, a5 as FieldAttributeConfig, ad as InferFieldsFromOptions, ac as InferFieldsFromPlugins, a9 as InferFieldsInput, aa as InferFieldsInputClient, a8 as InferFieldsOutput, a7 as InferValueType, a4 as InternalAdapter, ab as PluginFieldAttribute, ag as accountSchema, a6 as createFieldAttribute, a3 as createInternalAdapter, al as getAllFields, af as getAuthTables, au as mergeSchema, as as parseAccountInput, an as parseAccountOutput, ar as parseAdditionalUserInput, ap as parseInputData, ak as parseOutputData, at as parseSessionInput, ao as parseSessionOutput, aq as parseUserInput, am as parseUserOutput, ai as sessionSchema, ah as userSchema, aj as verificationSchema } from '../shared/better-auth.BNRr97iY.js';
import { z } from 'zod';
import '../shared/better-auth.Bi8FQwDD.js';
import '../shared/better-auth.ByC0y0O-.js';
import 'jose';
import 'kysely';
import 'better-call';
import 'better-sqlite3';
import 'bun:sqlite';

declare function getWithHooks(adapter: Adapter, ctx: {
    options: BetterAuthOptions;
    hooks: Exclude<BetterAuthOptions["databaseHooks"], undefined>[];
}): {
    createWithHooks: <T extends Record<string, any>>(data: T, model: "session" | "user" | "account" | "verification", customCreateFn?: {
        fn: (data: Record<string, any>) => void | Promise<any>;
        executeMainFn?: boolean;
    }, context?: GenericEndpointContext) => Promise<any>;
    updateWithHooks: <T extends Record<string, any>>(data: any, where: Where[], model: "session" | "user" | "account" | "verification", customUpdateFn?: {
        fn: (data: Record<string, any>) => void | Promise<any>;
        executeMainFn?: boolean;
    }, context?: GenericEndpointContext) => Promise<any>;
    updateManyWithHooks: <T extends Record<string, any>>(data: any, where: Where[], model: "session" | "user" | "account" | "verification", customUpdateFn?: {
        fn: (data: Record<string, any>) => void | Promise<any>;
        executeMainFn?: boolean;
    }, context?: GenericEndpointContext) => Promise<any>;
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
