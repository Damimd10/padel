import "reflect-metadata";

import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PrismaService } from "../../../../../prisma/prisma.service.js";

const databaseUrl = process.env.DATABASE_URL;
const canRunDatabaseTests = Boolean(databaseUrl);
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../../../..",
);

function applyPrismaMigrations() {
  const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

  execFileSync(
    pnpmCommand,
    [
      "-w",
      "exec",
      "prisma",
      "migrate",
      "deploy",
      "--schema",
      "./apps/api/prisma/schema.prisma",
    ],
    {
      cwd: repositoryRoot,
      env: process.env,
      stdio: "inherit",
    },
  );
}

describe.skipIf(!canRunDatabaseTests)("AuthController integration", () => {
  let prisma: PrismaService;
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV ??= "test";
    process.env.BETTER_AUTH_SECRET ??= "test-secret";
    process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
    process.env.LOG_LEVEL ??= "error";
    process.env.LOG_JSON ??= "true";
    process.env.API_RATE_LIMIT_MAX ??= "100";
    process.env.API_RATE_LIMIT_TTL_MS ??= "60000";

    applyPrismaMigrations();

    prisma = new PrismaService();
    await prisma.$connect();

    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();

    const { createApp } = await import("../../../../../main.js");

    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it("creates a persisted auth session and reads it back through the app-owned auth contract", async () => {
    const agent = request.agent(app.getHttpServer());
    const email = `auth-${randomUUID()}@example.com`;

    const signUpResponse = await agent
      .post("/auth/sign-up")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Auth Test User",
        email,
        password: "password-1234",
      })
      .expect(201);

    expect(signUpResponse.body).toMatchObject({
      user: {
        email,
        name: "Auth Test User",
        emailVerified: false,
        image: null,
      },
    });
    expect(signUpResponse.headers["set-cookie"]).toBeDefined();

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      },
    });

    expect(user.accounts).toHaveLength(1);
    expect(user.accounts[0]).toMatchObject({
      providerId: "credential",
      accountId: user.id,
    });
    expect(user.sessions).toHaveLength(1);

    const sessionResponse = await agent.get("/auth/session").expect(200);

    expect(sessionResponse.body).toMatchObject({
      authenticated: true,
      user: {
        id: user.id,
        email,
        name: "Auth Test User",
        image: null,
      },
      session: {
        id: user.sessions[0].id,
        userId: user.id,
        expiresAt: user.sessions[0].expiresAt.toISOString(),
      },
    });
  });

  it("returns an explicit invalid-credentials error for a failed sign-in", async () => {
    const agent = request.agent(app.getHttpServer());
    const email = `auth-${randomUUID()}@example.com`;

    await agent
      .post("/auth/sign-up")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Auth Test User",
        email,
        password: "password-1234",
      })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/sign-in")
      .set("origin", "http://localhost:3000")
      .send({
        email,
        password: "wrong-password",
      })
      .expect(401)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toEqual({
          code: "invalid_credentials",
          message: "Email or password is incorrect.",
        });
      });
  });

  it("returns an explicit duplicate-account error for repeated sign-up", async () => {
    const email = `auth-${randomUUID()}@example.com`;

    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Auth Test User",
        email,
        password: "password-1234",
      })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Auth Test User",
        email,
        password: "password-1234",
      })
      .expect(409)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toEqual({
          code: "duplicate_email",
          message: "An account with that email already exists.",
        });
      });
  });

  it("clears the session and reports an anonymous state after sign-out", async () => {
    const agent = request.agent(app.getHttpServer());
    const email = `auth-${randomUUID()}@example.com`;

    await agent
      .post("/auth/sign-up")
      .set("origin", "http://localhost:3000")
      .send({
        name: "Auth Test User",
        email,
        password: "password-1234",
      })
      .expect(201);

    const signOutResponse = await agent.post("/auth/sign-out").expect(200);

    expect(signOutResponse.body).toEqual({
      success: true,
    });
    expect(signOutResponse.headers["set-cookie"]).toBeDefined();

    await agent.get("/auth/session").expect(200).expect({
      authenticated: false,
    });
  });
});
