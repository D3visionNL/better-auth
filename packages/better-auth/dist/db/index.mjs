export { d as convertFromDB, b as convertToDB, c as createInternalAdapter, a as getAdapter, e as getMigrations, f as getSchema, g as getWithHooks, m as matchType } from '../shared/better-auth.DCB35LVD.mjs';
export { g as getAuthTables } from '../shared/better-auth.DORkW_Ge.mjs';
import { z } from 'zod';
export { a as accountSchema, g as getAllFields, m as mergeSchema, i as parseAccountInput, c as parseAccountOutput, h as parseAdditionalUserInput, e as parseInputData, p as parseOutputData, j as parseSessionInput, d as parseSessionOutput, f as parseUserInput, b as parseUserOutput, s as sessionSchema, u as userSchema, v as verificationSchema } from '../shared/better-auth.Cc72UxUH.mjs';
import '../shared/better-auth.CW6D9eSx.mjs';
import '../shared/better-auth.iKoUsdFE.mjs';
import '../shared/better-auth.8zoxzg-F.mjs';
import '../shared/better-auth.tB5eU6EY.mjs';
import '../shared/better-auth.BUPPRXfK.mjs';
import '@better-auth/utils/random';
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
import '../shared/better-auth.B4Qoxdgc.mjs';
import '../shared/better-auth.Cqykj82J.mjs';
import '../shared/better-auth.DdzSJf-n.mjs';
import '../shared/better-auth.B-orlLFy.mjs';
import 'kysely';
import '../shared/better-auth.Dpv9J4ny.mjs';
import '../shared/better-auth.0TC26uRi.mjs';
import '../shared/better-auth.Bdaq9Lqn.mjs';

const createFieldAttribute = (type, config) => {
  return {
    type,
    ...config
  };
};

function toZodSchema(fields) {
  const schema = z.object({
    ...Object.keys(fields).reduce((acc, key) => {
      const field = fields[key];
      if (!field) {
        return acc;
      }
      if (field.type === "string[]" || field.type === "number[]") {
        return {
          ...acc,
          [key]: z.array(field.type === "string[]" ? z.string() : z.number())
        };
      }
      if (Array.isArray(field.type)) {
        return {
          ...acc,
          [key]: z.any()
        };
      }
      let schema2 = z[field.type]();
      if (field?.required === false) {
        schema2 = schema2.optional();
      }
      if (field?.returned === false) {
        return acc;
      }
      return {
        ...acc,
        [key]: schema2
      };
    }, {})
  });
  return schema;
}

export { createFieldAttribute, toZodSchema };
