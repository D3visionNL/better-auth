'use strict';

const getMigration = require('../shared/better-auth.BnnLmpgJ.cjs');
const getTables = require('../shared/better-auth.BEphVDyL.cjs');
const zod = require('zod');
const schema = require('../shared/better-auth.DcWKCjjf.cjs');
require('../shared/better-auth.C1hdVENX.cjs');
require('../shared/better-auth.B7cZ2juS.cjs');
require('../shared/better-auth.DiSjtgs9.cjs');
require('../shared/better-auth.D3mtHEZg.cjs');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('@better-auth/utils/random');
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
require('../shared/better-auth.CYeOI8C-.cjs');
require('../shared/better-auth.GpOOav9x.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('../shared/better-auth.xK-w0Rah.cjs');
require('kysely');
require('../shared/better-auth.Be27qhjB.cjs');
require('../shared/better-auth.CUdxApHl.cjs');
require('../shared/better-auth.CPnVs39B.cjs');

const createFieldAttribute = (type, config) => {
  return {
    type,
    ...config
  };
};

function toZodSchema(fields) {
  const schema = zod.z.object({
    ...Object.keys(fields).reduce((acc, key) => {
      const field = fields[key];
      if (!field) {
        return acc;
      }
      if (field.type === "string[]" || field.type === "number[]") {
        return {
          ...acc,
          [key]: zod.z.array(field.type === "string[]" ? zod.z.string() : zod.z.number())
        };
      }
      if (Array.isArray(field.type)) {
        return {
          ...acc,
          [key]: zod.z.any()
        };
      }
      let schema2 = zod.z[field.type]();
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

exports.convertFromDB = getMigration.convertFromDB;
exports.convertToDB = getMigration.convertToDB;
exports.createInternalAdapter = getMigration.createInternalAdapter;
exports.getAdapter = getMigration.getAdapter;
exports.getMigrations = getMigration.getMigrations;
exports.getSchema = getMigration.getSchema;
exports.getWithHooks = getMigration.getWithHooks;
exports.matchType = getMigration.matchType;
exports.getAuthTables = getTables.getAuthTables;
exports.accountSchema = schema.accountSchema;
exports.getAllFields = schema.getAllFields;
exports.mergeSchema = schema.mergeSchema;
exports.parseAccountInput = schema.parseAccountInput;
exports.parseAccountOutput = schema.parseAccountOutput;
exports.parseAdditionalUserInput = schema.parseAdditionalUserInput;
exports.parseInputData = schema.parseInputData;
exports.parseOutputData = schema.parseOutputData;
exports.parseSessionInput = schema.parseSessionInput;
exports.parseSessionOutput = schema.parseSessionOutput;
exports.parseUserInput = schema.parseUserInput;
exports.parseUserOutput = schema.parseUserOutput;
exports.sessionSchema = schema.sessionSchema;
exports.userSchema = schema.userSchema;
exports.verificationSchema = schema.verificationSchema;
exports.createFieldAttribute = createFieldAttribute;
exports.toZodSchema = toZodSchema;
