import { g as Adapter, f as BetterAuthOptions, G as GenericEndpointContext, W as Where, F as FieldAttribute, Z as FieldType, K as KyselyDatabaseType } from '../shared/better-auth.p1j7naQW.mjs';
export { h as BetterAuthDbSchema, a0 as FieldAttributeConfig, a8 as InferFieldsFromOptions, a7 as InferFieldsFromPlugins, a4 as InferFieldsInput, a5 as InferFieldsInputClient, a3 as InferFieldsOutput, a2 as InferValueType, $ as InternalAdapter, a6 as PluginFieldAttribute, aa as accountSchema, a1 as createFieldAttribute, _ as createInternalAdapter, af as getAllFields, a9 as getAuthTables, ao as mergeSchema, am as parseAccountInput, ah as parseAccountOutput, al as parseAdditionalUserInput, aj as parseInputData, ae as parseOutputData, an as parseSessionInput, ai as parseSessionOutput, ak as parseUserInput, ag as parseUserOutput, ac as sessionSchema, ab as userSchema, ad as verificationSchema } from '../shared/better-auth.p1j7naQW.mjs';
import { z } from 'zod';
import '../shared/better-auth.CYegVoq1.mjs';
import '../shared/better-auth.BTXFetzv.mjs';
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
