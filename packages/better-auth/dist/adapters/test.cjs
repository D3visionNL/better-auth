'use strict';

var chunkH74YRRNV_cjs = require('../chunk-H74YRRNV.cjs');
require('../chunk-5E75URIA.cjs');
require('../chunk-CCKQSGIR.cjs');
require('../chunk-G2LZ73E2.cjs');
var vitest = require('vitest');

async function runAdapterTest(opts) {
  const adapter = await opts.getAdapter();
  const user = {
    id: "1",
    name: "user",
    email: "user@email.com",
    emailVerified: true,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  };
  vitest.test("create model", async () => {
    const res = await adapter.create({
      model: "user",
      data: user
    });
    vitest.expect({
      name: res.name,
      email: res.email
    }).toEqual({
      name: user.name,
      email: user.email
    });
    user.id = res.id;
  });
  vitest.test("find model", async () => {
    const res = await adapter.findOne({
      model: "user",
      where: [
        {
          field: "id",
          value: user.id
        }
      ]
    });
    vitest.expect({
      name: res?.name,
      email: res?.email
    }).toEqual({
      name: user.name,
      email: user.email
    });
  });
  vitest.test("find model without id", async () => {
    const res = await adapter.findOne({
      model: "user",
      where: [
        {
          field: "email",
          value: user.email
        }
      ]
    });
    vitest.expect({
      name: res?.name,
      email: res?.email
    }).toEqual({
      name: user.name,
      email: user.email
    });
  });
  vitest.test("find model with select", async () => {
    const res = await adapter.findOne({
      model: "user",
      where: [
        {
          field: "id",
          value: user.id
        }
      ],
      select: ["email"]
    });
    vitest.expect(res).toEqual({ email: user.email });
  });
  vitest.test("update model", async () => {
    const newEmail = "updated@email.com";
    const res = await adapter.update({
      model: "user",
      where: [
        {
          field: "id",
          value: user.id
        }
      ],
      update: {
        email: newEmail
      }
    });
    vitest.expect(res).toMatchObject({
      email: newEmail,
      name: user.name
    });
  });
  vitest.test("should find many", async () => {
    const res = await adapter.findMany({
      model: "user"
    });
    vitest.expect(res.length).toBe(1);
  });
  vitest.test("should find many with where", async () => {
    const user2 = await adapter.create({
      model: "user",
      data: {
        id: "2",
        name: "user2",
        email: "test@email.com",
        emailVerified: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    const res = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "id",
          value: user2.id
        }
      ]
    });
    vitest.expect(res.length).toBe(1);
  });
  vitest.test("should find many with operators", async () => {
    const newUser = await adapter.create({
      model: "user",
      data: {
        id: "3",
        name: "user",
        email: "test-email2@email.com",
        emailVerified: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    const res = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "id",
          operator: "in",
          value: [user.id, newUser.id]
        }
      ]
    });
    vitest.expect(res.length).toBe(2);
  });
  vitest.test("should work with reference fields", async () => {
    const user2 = await adapter.create({
      model: "user",
      data: {
        id: "4",
        name: "user",
        email: "my-email@email.com",
        emailVerified: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    await adapter.create({
      model: "session",
      data: {
        id: "1",
        token: chunkH74YRRNV_cjs.generateId(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        userId: user2.id,
        expiresAt: /* @__PURE__ */ new Date()
      }
    });
    const res = await adapter.findOne({
      model: "session",
      where: [
        {
          field: "userId",
          value: user2.id
        }
      ]
    });
    vitest.expect(res).toMatchObject({
      userId: user2.id
    });
  });
  vitest.test("should find many with sortBy", async () => {
    await adapter.create({
      model: "user",
      data: {
        id: "5",
        name: "a",
        email: "a@email.com",
        emailVerified: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    const res = await adapter.findMany({
      model: "user",
      sortBy: {
        field: "name",
        direction: "asc"
      }
    });
    vitest.expect(res[0].name).toBe("a");
    const res2 = await adapter.findMany({
      model: "user",
      sortBy: {
        field: "name",
        direction: "desc"
      }
    });
    vitest.expect(res2[res2.length - 1].name).toBe("a");
  });
  vitest.test("should find many with limit", async () => {
    const res = await adapter.findMany({
      model: "user",
      limit: 1
    });
    vitest.expect(res.length).toBe(1);
  });
  vitest.test("should find many with offset", async () => {
    const res = await adapter.findMany({
      model: "user",
      offset: 2
    });
    vitest.expect(res.length).toBe(3);
  });
  vitest.test("should update with multiple where", async () => {
    await adapter.updateMany({
      model: "user",
      where: [
        {
          field: "name",
          value: user.name
        },
        {
          field: "email",
          value: user.email
        }
      ],
      update: {
        email: "updated@email.com"
      }
    });
    const updatedUser = await adapter.findOne({
      model: "user",
      where: [
        {
          field: "email",
          value: "updated@email.com"
        }
      ]
    });
    vitest.expect(updatedUser).toMatchObject({
      name: user.name,
      email: "updated@email.com"
    });
  });
  vitest.test("delete model", async () => {
    await adapter.delete({
      model: "user",
      where: [
        {
          field: "id",
          value: user.id
        }
      ]
    });
    const findRes = await adapter.findOne({
      model: "user",
      where: [
        {
          field: "id",
          value: user.id
        }
      ]
    });
    vitest.expect(findRes).toBeNull();
  });
  vitest.test("should delete many", async () => {
    for (const id of ["to-be-delete1", "to-be-delete2", "to-be-delete3"]) {
      await adapter.create({
        model: "user",
        data: {
          id,
          name: "to-be-deleted",
          email: `email@test-${id}.com`,
          emailVerified: true,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    const findResFirst = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "name",
          value: "to-be-deleted"
        }
      ]
    });
    vitest.expect(findResFirst.length).toBe(3);
    await adapter.deleteMany({
      model: "user",
      where: [
        {
          field: "name",
          value: "to-be-deleted"
        }
      ]
    });
    const findRes = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "name",
          value: "to-be-deleted"
        }
      ]
    });
    vitest.expect(findRes.length).toBe(0);
  });
  vitest.test("shouldn't throw on delete record not found", async () => {
    await adapter.delete({
      model: "user",
      where: [
        {
          field: "id",
          value: "5"
        }
      ]
    });
  });
  vitest.test("shouldn't throw on record not found", async () => {
    const res = await adapter.findOne({
      model: "user",
      where: [
        {
          field: "id",
          value: "5"
        }
      ]
    });
    vitest.expect(res).toBeNull();
  });
  vitest.test("should find many with contains operator", async () => {
    const res = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "name",
          operator: "contains",
          value: "user2"
        }
      ]
    });
    vitest.expect(res.length).toBe(1);
  });
  vitest.test("should search users with startsWith", async () => {
    const res = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "name",
          operator: "starts_with",
          value: "us"
        }
      ]
    });
    vitest.expect(res.length).toBe(3);
  });
  vitest.test("should search users with endsWith", async () => {
    const res = await adapter.findMany({
      model: "user",
      where: [
        {
          field: "name",
          operator: "ends_with",
          value: "er2"
        }
      ]
    });
    vitest.expect(res.length).toBe(1);
  });
  vitest.test.skipIf(opts.skipGenerateIdTest)(
    "should prefer generateId if provided",
    async () => {
      const customAdapter = await opts.getAdapter({
        advanced: {
          generateId: () => "mocked-id"
        }
      });
      const res = await customAdapter.create({
        model: "user",
        data: {
          id: "1",
          name: "user4",
          email: "user4@email.com",
          emailVerified: true,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      vitest.expect(res.id).toBe("mocked-id");
    }
  );
}

exports.runAdapterTest = runAdapterTest;
