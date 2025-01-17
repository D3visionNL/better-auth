import { getAuthTables, withApplyDefault } from '../chunk-WMXORMNQ.js';
import '../chunk-BO77WNCJ.js';
import { generateId } from '../chunk-KLDFBLYL.js';
import '../chunk-6YL5J5JY.js';
import '../chunk-SK6Y2YH6.js';
import '../chunk-3XTQSPPA.js';
import '../chunk-WN2RDYR6.js';
import '../chunk-FURNA6HY.js';
import '../chunk-TQQSPPNA.js';
import { BetterAuthError } from '../chunk-UNWCXKMP.js';
import { desc, asc, inArray, like, eq, and, or } from 'drizzle-orm';

var createTransform = (db, config, options) => {
  const schema = getAuthTables(options);
  function getField(model, field) {
    if (field === "id") {
      return field;
    }
    const f = schema[model].fields[field];
    return f.fieldName || field;
  }
  function getSchema(modelName) {
    const schema2 = config.schema || db._.fullSchema;
    if (!schema2) {
      throw new BetterAuthError(
        "Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object."
      );
    }
    const model = getModelName(modelName);
    const schemaModel = schema2[model];
    if (!schemaModel) {
      throw new BetterAuthError(
        `[# Drizzle Adapter]: The model "${model}" was not found in the schema object. Please pass the schema directly to the adapter options.`
      );
    }
    return schemaModel;
  }
  const getModelName = (model) => {
    return schema[model].modelName !== model ? schema[model].modelName : config.usePlural ? `${model}s` : model;
  };
  const useDatabaseGeneratedId = options?.advanced?.generateId === false;
  return {
    getSchema,
    transformInput(data, model, action) {
      const transformedData = useDatabaseGeneratedId || action === "update" ? {} : {
        id: options.advanced?.generateId ? options.advanced.generateId({
          model
        }) : data.id || generateId()
      };
      const fields = schema[model].fields;
      for (const field in fields) {
        const value = data[field];
        if (value === void 0 && !fields[field].defaultValue) {
          continue;
        }
        transformedData[fields[field].fieldName || field] = withApplyDefault(
          value,
          fields[field],
          action
        );
      }
      return transformedData;
    },
    transformOutput(data, model, select = []) {
      if (!data) return null;
      const transformedData = data.id || data._id ? select.length === 0 || select.includes("id") ? {
        id: data.id
      } : {} : {};
      const tableSchema = schema[model].fields;
      for (const key in tableSchema) {
        if (select.length && !select.includes(key)) {
          continue;
        }
        const field = tableSchema[key];
        if (field) {
          transformedData[key] = data[field.fieldName || key];
        }
      }
      return transformedData;
    },
    convertWhereClause(where, model) {
      const schemaModel = getSchema(model);
      if (!where) return [];
      if (where.length === 1) {
        const w = where[0];
        if (!w) {
          return [];
        }
        const field = getField(model, w.field);
        if (!schemaModel[field]) {
          throw new BetterAuthError(
            `The field "${w.field}" does not exist in the schema for the model "${model}". Please update your schema.`
          );
        }
        if (w.operator === "in") {
          if (!Array.isArray(w.value)) {
            throw new BetterAuthError(
              `The value for the field "${w.field}" must be an array when using the "in" operator.`
            );
          }
          return [inArray(schemaModel[field], w.value)];
        }
        if (w.operator === "contains") {
          return [like(schemaModel[field], `%${w.value}%`)];
        }
        if (w.operator === "starts_with") {
          return [like(schemaModel[field], `${w.value}%`)];
        }
        if (w.operator === "ends_with") {
          return [like(schemaModel[field], `%${w.value}`)];
        }
        return [eq(schemaModel[field], w.value)];
      }
      const andGroup = where.filter(
        (w) => w.connector === "AND" || !w.connector
      );
      const orGroup = where.filter((w) => w.connector === "OR");
      const andClause = and(
        ...andGroup.map((w) => {
          const field = getField(model, w.field);
          if (w.operator === "in") {
            if (!Array.isArray(w.value)) {
              throw new BetterAuthError(
                `The value for the field "${w.field}" must be an array when using the "in" operator.`
              );
            }
            return inArray(schemaModel[field], w.value);
          }
          return eq(schemaModel[field], w.value);
        })
      );
      const orClause = or(
        ...orGroup.map((w) => {
          const field = getField(model, w.field);
          return eq(schemaModel[field], w.value);
        })
      );
      const clause = [];
      if (andGroup.length) clause.push(andClause);
      if (orGroup.length) clause.push(orClause);
      return clause;
    },
    withReturning: async (model, builder, data) => {
      if (config.provider !== "mysql") {
        const c = await builder.returning();
        return c[0];
      }
      await builder;
      const schemaModel = getSchema(getModelName(model));
      const res = await db.select().from(schemaModel).where(eq(schemaModel.id, data.id));
      return res[0];
    },
    getField,
    getModelName
  };
};
function checkMissingFields(schema, model, values) {
  if (!schema) {
    throw new BetterAuthError(
      "Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object."
    );
  }
  for (const key in values) {
    if (!schema[key]) {
      throw new BetterAuthError(
        `The field "${key}" does not exist in the "${model}" schema. Please update your drizzle schema or re-generate using "npx @better-auth/cli generate".`
      );
    }
  }
}
var drizzleAdapter = (db, config) => (options) => {
  const {
    transformInput,
    transformOutput,
    convertWhereClause,
    getSchema,
    withReturning,
    getField,
    getModelName
  } = createTransform(db, config, options);
  return {
    id: "drizzle",
    async create(data) {
      const { model, data: values } = data;
      const transformed = transformInput(values, model, "create");
      const schemaModel = getSchema(model);
      checkMissingFields(schemaModel, getModelName(model), transformed);
      const builder = db.insert(schemaModel).values(transformed);
      const returned = await withReturning(model, builder, transformed);
      return transformOutput(returned, model);
    },
    async findOne(data) {
      const { model, where, select } = data;
      const schemaModel = getSchema(model);
      const clause = convertWhereClause(where, model);
      const res = await db.select().from(schemaModel).where(...clause);
      if (!res.length) return null;
      return transformOutput(res[0], model, select);
    },
    async findMany(data) {
      const { model, where, sortBy, limit, offset } = data;
      const schemaModel = getSchema(model);
      const clause = where ? convertWhereClause(where, model) : [];
      const sortFn = sortBy?.direction === "desc" ? desc : asc;
      const builder = db.select().from(schemaModel).limit(limit || 100).offset(offset || 0);
      if (sortBy?.field) {
        builder.orderBy(sortFn(schemaModel[getField(model, sortBy?.field)]));
      }
      const res = await builder.where(...clause);
      return res.map((r) => transformOutput(r, model));
    },
    async count(data) {
      const { model, where } = data;
      const schemaModel = getSchema(model);
      const clause = where ? convertWhereClause(where, model) : [];
      const res = await db.select().from(schemaModel).where(...clause);
      return res.length;
    },
    async update(data) {
      const { model, where, update: values } = data;
      const schemaModel = getSchema(model);
      const clause = convertWhereClause(where, model);
      const transformed = transformInput(values, model, "update");
      const builder = db.update(schemaModel).set(transformed).where(...clause);
      const returned = await withReturning(model, builder, transformed);
      return transformOutput(returned, model);
    },
    async updateMany(data) {
      const { model, where, update: values } = data;
      const schemaModel = getSchema(model);
      const clause = convertWhereClause(where, model);
      const transformed = transformInput(values, model, "update");
      const builder = db.update(schemaModel).set(transformed).where(...clause);
      const res = await builder;
      return res ? res.changes : 0;
    },
    async delete(data) {
      const { model, where } = data;
      const schemaModel = getSchema(model);
      const clause = convertWhereClause(where, model);
      const builder = db.delete(schemaModel).where(...clause);
      await builder;
    },
    async deleteMany(data) {
      const { model, where } = data;
      const schemaModel = getSchema(model);
      const clause = convertWhereClause(where, model);
      const builder = db.delete(schemaModel).where(...clause);
      const res = await builder;
      return res ? res.length : 0;
    },
    options: config
  };
};

export { drizzleAdapter };
