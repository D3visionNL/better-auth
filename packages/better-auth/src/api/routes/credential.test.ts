import { describe, expect, it } from "vitest";
import { getTestInstance } from "../../test-utils/test-instance";

const { auth, client } = await getTestInstance();
const testCredential1 = {
	email: "test@test.com",
	password: "test123456",
	name: "test",
};

const testCredential2 = {
	email: "test2@test.com",
	password: "test123456",
	name: "test2",
};

describe("credential", async () => {
	it("should sign up with email and password", async () => {
		const res = await client.signUp.credential({
			email: testCredential1.email,
			password: testCredential1.password,
			name: testCredential1.name,
		});
		expect(res.data).toMatchObject({
			user: {
				id: expect.any(String),
				email: testCredential1.email,
				name: testCredential1.name,
				emailVerified: false,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			session: {
				id: expect.any(String),
				userId: expect.any(String),
				expiresAt: expect.any(String),
				ipAddress: expect.any(String),
				userAgent: expect.any(String),
			},
		});

		const res2 = await auth.api.signUpCredential({
			method: "POST",
			body: {
				email: testCredential2.email,
				password: testCredential2.password,
				name: testCredential2.name,
			},
		});
		expect(res2).toMatchObject({
			user: {
				id: expect.any(String),
				email: testCredential2.email,
				name: testCredential2.name,
				emailVerified: false,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			},
			session: {
				id: expect.any(String),
				userId: expect.any(String),
				expiresAt: expect.any(Date),
				ipAddress: expect.any(String),
				userAgent: expect.any(String),
			},
		});
	});
});

describe("sign-in credential", async () => {
	it("should sign in with email and password", async () => {
		const res = await client.signIn.credential({
			email: testCredential1.email,
			password: testCredential1.password,
		});
		expect(res.data).toMatchObject({
			user: {
				id: expect.any(String),
				email: testCredential1.email,
				name: testCredential1.name,
				emailVerified: false,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
			session: {
				id: expect.any(String),
				userId: expect.any(String),
				expiresAt: expect.any(String),
				ipAddress: expect.any(String),
				userAgent: expect.any(String),
			},
		});

		const res2 = await auth.api.signInCredential({
			method: "POST",
			body: {
				email: testCredential2.email,
				password: testCredential2.password,
			},
			//TODO: fix this shouldn't require a header
			headers: new Headers(),
		});

		expect(res2).toMatchObject({
			user: {
				id: expect.any(String),
				email: testCredential2.email,
				name: testCredential2.name,
				emailVerified: false,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			},
			session: {
				id: expect.any(String),
				userId: expect.any(String),
				expiresAt: expect.any(Date),
				ipAddress: expect.any(String),
				userAgent: expect.any(String),
			},
		});
	});
});