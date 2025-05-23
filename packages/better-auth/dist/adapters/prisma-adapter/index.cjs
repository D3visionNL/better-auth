'use strict';

const index = require('../../shared/better-auth.Be27qhjB.cjs');
const index$1 = require('../../shared/better-auth.ANpbi45u.cjs');
require('../../shared/better-auth.D3mtHEZg.cjs');
require('../../shared/better-auth.CUdxApHl.cjs');
require('../../shared/better-auth.BEphVDyL.cjs');
require('../../shared/better-auth.Bg6iw3ig.cjs');
require('@better-auth/utils/random');
require('zod');
require('better-call');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha');
require('@noble/ciphers/utils');
require('@noble/ciphers/webcrypto');
require('@better-auth/utils/base64');
require('jose');
require('@noble/hashes/scrypt');
require('@better-auth/utils');
require('@better-auth/utils/hex');
require('@noble/hashes/utils');
require('../../shared/better-auth.CYeOI8C-.cjs');
require('../../shared/better-auth.GpOOav9x.cjs');

const prismaAdapter = (prisma, config) => index.createAdapter({
  config: {
    adapterId: "prisma",
    adapterName: "Prisma Adapter",
    usePlural: config.usePlural ?? false,
    debugLogs: config.debugLogs ?? false
  },
  adapter: ({ getFieldName }) => {
    const db = prisma;
    const convertSelect = (select, model) => {
      if (!select || !model) return void 0;
      return select.reduce((prev, cur) => {
        return {
          ...prev,
          [getFieldName({ model, field: cur })]: true
        };
      }, {});
    };
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
    const convertWhereClause = (model, where) => {
      if (!where) return {};
      if (where.length === 1) {
        const w = where[0];
        if (!w) {
          return;
        }
        return {
          [getFieldName({ model, field: w.field })]: w.operator === "eq" || !w.operator ? w.value : {
            [operatorToPrismaOperator(w.operator)]: w.value
          }
        };
      }
      const and = where.filter((w) => w.connector === "AND" || !w.connector);
      const or = where.filter((w) => w.connector === "OR");
      const andClause = and.map((w) => {
        return {
          [getFieldName({ model, field: w.field })]: w.operator === "eq" || !w.operator ? w.value : {
            [operatorToPrismaOperator(w.operator)]: w.value
          }
        };
      });
      const orClause = or.map((w) => {
        return {
          [getFieldName({ model, field: w.field })]: {
            [w.operator || "eq"]: w.value
          }
        };
      });
      return {
        ...andClause.length ? { AND: andClause } : {},
        ...orClause.length ? { OR: orClause } : {}
      };
    };
    return {
      async create({ model, data: values, select }) {
        if (!db[model]) {
          throw new index$1.BetterAuthError(
            `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
          );
        }
        return await db[model].create({
          data: values,
          select: convertSelect(select, model)
        });
      },
      async findOne({ model, where, select }) {
        const whereClause = convertWhereClause(model, where);
        if (!db[model]) {
          throw new index$1.BetterAuthError(
            `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
          );
        }
        return await db[model].findFirst({
          where: whereClause,
          select: convertSelect(select, model)
        });
      },
      async findMany({ model, where, limit, offset, sortBy }) {
        const whereClause = convertWhereClause(model, where);
        if (!db[model]) {
          throw new index$1.BetterAuthError(
            `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
          );
        }
        return await db[model].findMany({
          where: whereClause,
          take: limit || 100,
          skip: offset || 0,
          ...sortBy?.field ? {
            orderBy: {
              [getFieldName({ model, field: sortBy.field })]: sortBy.direction === "desc" ? "desc" : "asc"
            }
          } : {}
        });
      },
      async count({ model, where }) {
        const whereClause = convertWhereClause(model, where);
        if (!db[model]) {
          throw new index$1.BetterAuthError(
            `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
          );
        }
        return await db[model].count({
          where: whereClause
        });
      },
      async update({ model, where, update }) {
        if (!db[model]) {
          throw new index$1.BetterAuthError(
            `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
          );
        }
        const whereClause = convertWhereClause(model, where);
        return await db[model].update({
          where: whereClause,
          data: update
        });
      },
      async updateMany({ model, where, update }) {
        const whereClause = convertWhereClause(model, where);
        const result = await db[model].updateMany({
          where: whereClause,
          data: update
        });
        return result ? result.count : 0;
      },
      async delete({ model, where }) {
        const whereClause = convertWhereClause(model, where);
        try {
          await db[model].delete({
            where: whereClause
          });
        } catch (e) {
        }
      },
      async deleteMany({ model, where }) {
        const whereClause = convertWhereClause(model, where);
        const result = await db[model].deleteMany({
          where: whereClause
        });
        return result ? result.count : 0;
      },
      options: config
    };
  }
});

exports.prismaAdapter = prismaAdapter;
