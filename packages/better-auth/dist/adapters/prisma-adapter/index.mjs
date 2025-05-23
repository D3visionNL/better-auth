import { c as createAdapter } from '../../shared/better-auth.Dpv9J4ny.mjs';
import { B as BetterAuthError } from '../../shared/better-auth.DdzSJf-n.mjs';
import '../../shared/better-auth.tB5eU6EY.mjs';
import '../../shared/better-auth.0TC26uRi.mjs';
import '../../shared/better-auth.DORkW_Ge.mjs';
import '../../shared/better-auth.BUPPRXfK.mjs';
import '@better-auth/utils/random';
import 'zod';
import 'better-call';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha';
import '@noble/ciphers/utils';
import '@noble/ciphers/webcrypto';
import '@better-auth/utils/base64';
import 'jose';
import '@noble/hashes/scrypt';
import '@better-auth/utils';
import '@better-auth/utils/hex';
import '@noble/hashes/utils';
import '../../shared/better-auth.B4Qoxdgc.mjs';
import '../../shared/better-auth.Cqykj82J.mjs';

const prismaAdapter = (prisma, config) => createAdapter({
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
          throw new BetterAuthError(
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
          throw new BetterAuthError(
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
          throw new BetterAuthError(
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
          throw new BetterAuthError(
            `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`
          );
        }
        return await db[model].count({
          where: whereClause
        });
      },
      async update({ model, where, update }) {
        if (!db[model]) {
          throw new BetterAuthError(
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

export { prismaAdapter };
