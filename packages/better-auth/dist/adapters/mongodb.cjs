'use strict';

var chunkHH5YHQO2_cjs = require('../chunk-HH5YHQO2.cjs');
require('../chunk-ME4Q5ZEC.cjs');
require('../chunk-H74YRRNV.cjs');
require('../chunk-5E75URIA.cjs');
require('../chunk-NIMYOIVU.cjs');
require('../chunk-CCKQSGIR.cjs');
require('../chunk-G2LZ73E2.cjs');
require('../chunk-2HPSCSV7.cjs');
require('../chunk-VXYIYABQ.cjs');
require('../chunk-PEZRSDZS.cjs');
var mongodb = require('mongodb');

var createTransform = (options) => {
  const schema = chunkHH5YHQO2_cjs.getAuthTables(options);
  function serializeID(field, value, model) {
    if (field === "id" || field === "_id" || schema[model].fields[field].references?.field === "id") {
      if (typeof value !== "string") {
        if (value instanceof mongodb.ObjectId) {
          return value;
        }
        if (Array.isArray(value)) {
          return value.map((v) => {
            if (typeof v === "string") {
              try {
                return new mongodb.ObjectId(v);
              } catch (e) {
                return v;
              }
            }
            if (v instanceof mongodb.ObjectId) {
              return v;
            }
            throw new Error("Invalid id value");
          });
        }
        throw new Error("Invalid id value");
      }
      try {
        return new mongodb.ObjectId(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  }
  function deserializeID(field, value, model) {
    if (field === "id" || schema[model].fields[field].references?.field === "id") {
      if (value instanceof mongodb.ObjectId) {
        return value.toHexString();
      }
      if (Array.isArray(value)) {
        return value.map((v) => {
          if (v instanceof mongodb.ObjectId) {
            return v.toHexString();
          }
          return v;
        });
      }
      return value;
    }
    return value;
  }
  function getField(field, model) {
    if (field === "id") {
      return "_id";
    }
    const f = schema[model].fields[field];
    return f.fieldName || field;
  }
  return {
    transformInput(data, model, action) {
      const transformedData = action === "update" ? {} : {
        _id: new mongodb.ObjectId()
      };
      const fields = schema[model].fields;
      for (const field in fields) {
        const value = data[field];
        if (value === void 0 && (!fields[field].defaultValue || action === "update")) {
          continue;
        }
        transformedData[fields[field].fieldName || field] = chunkHH5YHQO2_cjs.withApplyDefault(
          serializeID(field, value, model),
          fields[field],
          action
        );
      }
      return transformedData;
    },
    transformOutput(data, model, select = []) {
      const transformedData = data.id || data._id ? select.length === 0 || select.includes("id") ? {
        id: data.id ? data.id.toString() : data._id.toString()
      } : {} : {};
      const tableSchema = schema[model].fields;
      for (const key in tableSchema) {
        if (select.length && !select.includes(key)) {
          continue;
        }
        const field = tableSchema[key];
        if (field) {
          transformedData[key] = deserializeID(
            key,
            data[field.fieldName || key],
            model
          );
        }
      }
      return transformedData;
    },
    convertWhereClause(where, model) {
      if (!where.length) return {};
      const conditions = where.map((w) => {
        const { field: _field, value, operator = "eq", connector = "AND" } = w;
        let condition;
        const field = getField(_field, model);
        switch (operator.toLowerCase()) {
          case "eq":
            condition = {
              [field]: serializeID(_field, value, model)
            };
            break;
          case "in":
            condition = {
              [field]: {
                $in: Array.isArray(value) ? serializeID(_field, value, model) : [serializeID(_field, value, model)]
              }
            };
            break;
          case "gt":
            condition = { [field]: { $gt: value } };
            break;
          case "gte":
            condition = { [field]: { $gte: value } };
            break;
          case "lt":
            condition = { [field]: { $lt: value } };
            break;
          case "lte":
            condition = { [field]: { $lte: value } };
            break;
          case "ne":
            condition = { [field]: { $ne: value } };
            break;
          case "contains":
            condition = { [field]: { $regex: `.*${value}.*` } };
            break;
          case "starts_with":
            condition = { [field]: { $regex: `${value}.*` } };
            break;
          case "ends_with":
            condition = { [field]: { $regex: `.*${value}` } };
            break;
          default:
            throw new Error(`Unsupported operator: ${operator}`);
        }
        return { condition, connector };
      });
      if (conditions.length === 1) {
        return conditions[0].condition;
      }
      const andConditions = conditions.filter((c) => c.connector === "AND").map((c) => c.condition);
      const orConditions = conditions.filter((c) => c.connector === "OR").map((c) => c.condition);
      let clause = {};
      if (andConditions.length) {
        clause = { ...clause, $and: andConditions };
      }
      if (orConditions.length) {
        clause = { ...clause, $or: orConditions };
      }
      return clause;
    },
    getModelName: (model) => {
      return schema[model].modelName;
    },
    getField
  };
};
var mongodbAdapter = (db) => (options) => {
  const transform = createTransform(options);
  return {
    id: "mongodb-adapter",
    async create(data) {
      const { model, data: values, select } = data;
      const transformedData = transform.transformInput(values, model, "create");
      if (transformedData.id) {
        delete transformedData.id;
      }
      const res = await db.collection(transform.getModelName(model)).insertOne(transformedData);
      const id = res.insertedId;
      const insertedData = { ...transformedData, id: id.toString() };
      const t = transform.transformOutput(insertedData, model, select);
      return t;
    },
    async findOne(data) {
      const { model, where, select } = data;
      const clause = transform.convertWhereClause(where, model);
      const res = await db.collection(transform.getModelName(model)).findOne(clause);
      if (!res) return null;
      const transformedData = transform.transformOutput(res, model, select);
      return transformedData;
    },
    async count(data) {
      const { model } = data;
      const res = await db.collection(transform.getModelName(model)).countDocuments();
      return res;
    },
    async findMany(data) {
      const { model, where, limit, offset, sortBy } = data;
      const clause = where ? transform.convertWhereClause(where, model) : {};
      const cursor = db.collection(transform.getModelName(model)).find(clause);
      if (limit) cursor.limit(limit);
      if (offset) cursor.skip(offset);
      if (sortBy)
        cursor.sort(
          transform.getField(sortBy.field, model),
          sortBy.direction === "desc" ? -1 : 1
        );
      const res = await cursor.toArray();
      return res.map((r) => transform.transformOutput(r, model));
    },
    async update(data) {
      const { model, where, update: values } = data;
      const clause = transform.convertWhereClause(where, model);
      const transformedData = transform.transformInput(values, model, "update");
      const res = await db.collection(transform.getModelName(model)).findOneAndUpdate(
        clause,
        { $set: transformedData },
        {
          returnDocument: "after"
        }
      );
      if (!res) return null;
      return transform.transformOutput(res, model);
    },
    async updateMany(data) {
      const { model, where, update: values } = data;
      const clause = transform.convertWhereClause(where, model);
      const transformedData = transform.transformInput(values, model, "update");
      const res = await db.collection(transform.getModelName(model)).updateMany(clause, { $set: transformedData });
      return res.modifiedCount;
    },
    async delete(data) {
      const { model, where } = data;
      const clause = transform.convertWhereClause(where, model);
      const res = await db.collection(transform.getModelName(model)).findOneAndDelete(clause);
      if (!res) return null;
      return transform.transformOutput(res, model);
    },
    async deleteMany(data) {
      const { model, where } = data;
      const clause = transform.convertWhereClause(where, model);
      const res = await db.collection(transform.getModelName(model)).deleteMany(clause);
      return res.deletedCount;
    }
  };
};

exports.mongodbAdapter = mongodbAdapter;
