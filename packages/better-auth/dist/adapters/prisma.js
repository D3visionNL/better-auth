import { getAuthTables, withApplyDefault } from '../chunk-ZWDZCJSN.js';
import '../chunk-MEZ6VLJL.js';
import { generateId } from '../chunk-KLDFBLYL.js';
import '../chunk-NPO64SVN.js';
import '../chunk-SK6Y2YH6.js';
import '../chunk-3XTQSPPA.js';
import '../chunk-DBPOZRMS.js';
import '../chunk-FURNA6HY.js';
import '../chunk-TQQSPPNA.js';
import { BetterAuthError } from '../chunk-UNWCXKMP.js';

// src/adapters/prisma-adapter/prisma-adapter.ts
var createTransform = (config, options) => {
  const schema = getAuthTables(options);
  function getField(model, field) {
    if (field === "id") {
      return field;
    }
    const f = schema[model].fields[field];
    return f.fieldName || field;
  }
  function operatorToPrismaOperator(operator) {
    switch (operator) {
      case "starts_with":
        return "startsWith";
      case "ends_with":
        return "endsWith";
      default:
        return operator;
    }
  }
  function getModelName(model) {
    return schema[model].modelName;
  }
  const useDatabaseGeneratedId = options?.advanced?.generateId === false;
  return {
    transformInput(data, model, action) {
      const transformedData = useDatabaseGeneratedId || action === "update" ? {} : {
        id: options.advanced?.generateId ? options.advanced.generateId({
          model
        }) : data.id || generateId()
      };
      const fields = schema[model].fields;
      for (const field in fields) {
        const value = data[field];
        if (value === void 0 && (!fields[field].defaultValue || action === "update")) {
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
    convertWhereClause(model, where) {
      if (!where) return {};
      if (where.length === 1) {
        const w = where[0];
        if (!w) {
          return;
        }
        return {
          [getField(model, w.field)]: w.operator === "eq" || !w.operator ? w.value : {
            [operatorToPrismaOperator(w.operator)]: w.value
          }
        };
      }
      const and = where.filter((w) => w.connector === "AND" || !w.connector);
      const or = where.filter((w) => w.connector === "OR");
      const andClause = and.map((w) => {
        return {
          [getField(model, w.field)]: w.operator === "eq" || !w.operator ? w.value : {
            [operatorToPrismaOperator(w.operator)]: w.value
          }
        };
      });
      const orClause = or.map((w) => {
        return {
          [getField(model, w.field)]: {
            [w.operator || "eq"]: w.value
          }
        };
      });
      return {
        ...andClause.length ? { AND: andClause } : {},
        ...orClause.length ? { OR: orClause } : {}
      };
    },
    convertSelect: (select, model) => {
      if (!select || !model) return void 0;
      return select.reduce((prev, cur) => {
        return {
          ...prev,
          [getField(model, cur)]: true
        };
      }, {});
    },
    getModelName,
    getField
  };
};
var prismaAdapter = (prisma, config) => (options) => {
  const db = prisma;
  const {
    transformInput,
    transformOutput,
    convertWhereClause,
    convertSelect,
    getModelName,
    getField
  } = createTransform(config, options);
  return {
    id: "prisma",
    async create(data) {
      const { model, data: values, select } = data;
      const transformed = transformInput(values, model, "create");
      if (!db[getModelName(model)]) {
        throw new BetterAuthError(
          `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
        );
      }
      const result = await db[getModelName(model)].create({
        data: transformed,
        select: convertSelect(select, model)
      });
      return transformOutput(result, model, select);
    },
    async findOne(data) {
      const { model, where, select } = data;
      const whereClause = convertWhereClause(model, where);
      if (!db[getModelName(model)]) {
        throw new BetterAuthError(
          `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
        );
      }
      const result = await db[getModelName(model)].findFirst({
        where: whereClause,
        select: convertSelect(select, model)
      });
      return transformOutput(result, model, select);
    },
    async count(data) {
      const { model, where } = data;
      const whereClause = convertWhereClause(model, where);
      if (!db[getModelName(model)]) {
        throw new BetterAuthError(
          `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
        );
      }
      const result = await db[getModelName(model)].findMany({
        where: whereClause,
        select: {
          id: true
        }
      });
      return result.length;
    },
    async findMany(data) {
      const { model, where, limit, offset, sortBy } = data;
      const whereClause = convertWhereClause(model, where);
      if (!db[getModelName(model)]) {
        throw new BetterAuthError(
          `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
        );
      }
      const result = await db[getModelName(model)].findMany({
        where: whereClause,
        take: limit || 100,
        skip: offset || 0,
        ...sortBy?.field ? {
          orderBy: {
            [getField(model, sortBy.field)]: sortBy.direction === "desc" ? "desc" : "asc"
          }
        } : {}
      });
      return result.map((r) => transformOutput(r, model));
    },
    async update(data) {
      const { model, where, update } = data;
      if (!db[getModelName(model)]) {
        throw new BetterAuthError(
          `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
        );
      }
      const whereClause = convertWhereClause(model, where);
      const transformed = transformInput(update, model, "update");
      const result = await db[getModelName(model)].update({
        where: whereClause,
        data: transformed
      });
      return transformOutput(result, model);
    },
    async updateMany(data) {
      const { model, where, update } = data;
      const whereClause = convertWhereClause(model, where);
      const transformed = transformInput(update, model, "update");
      const result = await db[getModelName(model)].updateMany({
        where: whereClause,
        data: transformed
      });
      return result ? result.count : 0;
    },
    async delete(data) {
      const { model, where } = data;
      const whereClause = convertWhereClause(model, where);
      try {
        await db[getModelName(model)].delete({
          where: whereClause
        });
      } catch (e) {
      }
    },
    async deleteMany(data) {
      const { model, where } = data;
      const whereClause = convertWhereClause(model, where);
      const result = await db[getModelName(model)].deleteMany({
        where: whereClause
      });
      return result ? result.count : 0;
    },
    options: config
  };
};

export { prismaAdapter };
