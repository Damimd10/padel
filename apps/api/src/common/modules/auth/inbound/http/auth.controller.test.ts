import "reflect-metadata";

import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { AuthGatewayError } from "../../application/auth-gateway.error.js";
import { ForgetPasswordUseCase } from "../../application/forget-password.use-case.js";
import { GetAuthSessionUseCase } from "../../application/get-auth-session.use-case.js";
import { ResetPasswordUseCase } from "../../application/reset-password.use-case.js";
import { SignInWithEmailUseCase } from "../../application/sign-in-with-email.use-case.js";
import { SignOutUseCase } from "../../application/sign-out.use-case.js";
import { SignUpWithEmailUseCase } from "../../application/sign-up-with-email.use-case.js";
import { AuthController } from "./auth.controller.js";

const forgetPasswordUseCaseMock = {
  execute: async () => ({
    data: { success: true },
    headers: { setCookie: [] },
  }),
};

const resetPasswordUseCaseMock = {
  execute: async () => ({
    data: { success: true },
    headers: { setCookie: [] },
  }),
};

describe("AuthController", () => {
  it("creates an app-owned sign-up response", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: GetAuthSessionUseCase,
          useValue: {
            execute: async () => ({ data: null, headers: { setCookie: [] } }),
          },
        },
        {
          provide: SignUpWithEmailUseCase,
          useValue: {
            execute: async () => ({
              data: {
                user: {
                  id: "user-1",
                  email: "ops@example.com",
                  name: "Operations User",
                  emailVerified: false,
                  image: null,
                },
              },
              headers: {
                setCookie: ["session=test; Path=/; HttpOnly"],
              },
            }),
          },
        },
        {
          provide: SignInWithEmailUseCase,
          useValue: {
            execute: async () => ({ data: null, headers: { setCookie: [] } }),
          },
        },
        {
          provide: SignOutUseCase,
          useValue: {
            execute: async () => ({
              data: { success: true },
              headers: { setCookie: [] },
            }),
          },
        },
        {
          provide: ForgetPasswordUseCase,
          useValue: forgetPasswordUseCaseMock,
        },
        {
          provide: ResetPasswordUseCase,
          useValue: resetPasswordUseCaseMock,
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        name: "Operations User",
        email: "ops@example.com",
        password: "password-1234",
      })
      .expect(201)
      .expect(
        ({
          body,
          headers,
        }: { body: unknown; headers: Record<string, unknown> }) => {
          expect(body).toEqual({
            user: {
              id: "user-1",
              email: "ops@example.com",
              name: "Operations User",
              emailVerified: false,
              image: null,
            },
          });
          expect(headers["set-cookie"]).toBeDefined();
        },
      );

    await app.close();
  });

  it("maps invalid credentials into an explicit auth error payload", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: GetAuthSessionUseCase,
          useValue: {
            execute: async () => ({ data: null, headers: { setCookie: [] } }),
          },
        },
        {
          provide: SignUpWithEmailUseCase,
          useValue: {
            execute: async () => ({ data: null, headers: { setCookie: [] } }),
          },
        },
        {
          provide: SignInWithEmailUseCase,
          useValue: {
            execute: async () => {
              throw new AuthGatewayError(
                "invalid_credentials",
                401,
                "Email or password is incorrect.",
              );
            },
          },
        },
        {
          provide: SignOutUseCase,
          useValue: {
            execute: async () => ({
              data: { success: true },
              headers: { setCookie: [] },
            }),
          },
        },
        {
          provide: ForgetPasswordUseCase,
          useValue: forgetPasswordUseCaseMock,
        },
        {
          provide: ResetPasswordUseCase,
          useValue: resetPasswordUseCaseMock,
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({
        email: "ops@example.com",
        password: "password-1234",
      })
      .expect(401)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toEqual({
          code: "invalid_credentials",
          message: "Email or password is incorrect.",
        });
      });

    await app.close();
  });

  it("returns an explicit anonymous session state", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: GetAuthSessionUseCase,
          useValue: {
            execute: async () => ({
              data: null,
              headers: { setCookie: [] },
            }),
          },
        },
        {
          provide: SignUpWithEmailUseCase,
          useValue: {
            execute: async () => ({ data: null, headers: { setCookie: [] } }),
          },
        },
        {
          provide: SignInWithEmailUseCase,
          useValue: {
            execute: async () => ({ data: null, headers: { setCookie: [] } }),
          },
        },
        {
          provide: SignOutUseCase,
          useValue: {
            execute: async () => ({
              data: { success: true },
              headers: { setCookie: [] },
            }),
          },
        },
        {
          provide: ForgetPasswordUseCase,
          useValue: forgetPasswordUseCaseMock,
        },
        {
          provide: ResetPasswordUseCase,
          useValue: resetPasswordUseCaseMock,
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .get("/auth/session")
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toEqual({
          authenticated: false,
        });
      });

    await app.close();
  });
});
