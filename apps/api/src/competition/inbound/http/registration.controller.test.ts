import "reflect-metadata/Reflect.js";

import { UnauthorizedException } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { ApproveRegistrationUseCase } from "../../application/approve-registration.use-case.js";
import { CreateRegistrationUseCase } from "../../application/create-registration.use-case.js";
import { ListRegistrationsUseCase } from "../../application/list-registrations.use-case.js";
import { RejectRegistrationUseCase } from "../../application/reject-registration.use-case.js";
import { RegistrationController } from "./registration.controller.js";

describe("RegistrationController", () => {
  const competitionId = "11111111-1111-4111-8111-111111111111";
  const categoryId = "22222222-2222-4222-8222-222222222222";
  const divisionId = "33333333-3333-4333-8333-333333333333";
  const registrationId = "44444444-4444-4444-8444-444444444444";

  it("lists registrations for a competition", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: CreateRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListRegistrationsUseCase,
          useValue: {
            execute: async () => [
              {
                id: "11111111-1111-4111-8111-111111111113",
                competitionId,
                participantId: "user-1",
                categoryId,
                divisionId,
                status: "pending_review",
                createdAt: "2026-05-04T00:00:00.000Z",
                updatedAt: "2026-05-04T00:00:00.000Z",
              },
            ],
          },
        },
        {
          provide: ApproveRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: RejectRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({
        canActivate(context: {
          switchToHttp(): { getRequest(): { user?: { id: string } } };
        }) {
          context.switchToHttp().getRequest().user = { id: "user-1" };
          return true;
        },
      })
      .compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .get(`/competitions/${competitionId}/registrations`)
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toHaveLength(1);
        expect((body as Array<Record<string, unknown>>)[0]).toMatchObject({
          participantId: "user-1",
        });
      });

    await app.close();
  });

  it("creates a registration with authenticated user", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: CreateRegistrationUseCase,
          useValue: {
            execute: async (input: {
              competitionId: string;
              participantId: string;
              categoryId: string;
              divisionId: string;
            }) => ({
              id: "11111111-1111-4111-8111-111111111112",
              competitionId: input.competitionId,
              participantId: input.participantId,
              categoryId: input.categoryId,
              divisionId: input.divisionId,
              status: "pending_review",
              createdAt: "2026-05-04T00:00:00.000Z",
              updatedAt: "2026-05-04T00:00:00.000Z",
            }),
          },
        },
        {
          provide: ListRegistrationsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: ApproveRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: RejectRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({
        canActivate(context: {
          switchToHttp(): { getRequest(): { user?: Record<string, unknown> } };
        }) {
          context.switchToHttp().getRequest().user = {
            id: "user-1",
            email: "test@example.com",
            name: "Test User",
            emailVerified: true,
            image: null,
          };
          return true;
        },
      })
      .compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .post(`/competitions/${competitionId}/registrations`)
      .send({ categoryId, divisionId })
      .expect(201)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111112",
          participantId: "user-1",
          categoryId,
          divisionId,
          status: "pending_review",
        });
      });

    await app.close();
  });

  it("approves a registration", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: CreateRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListRegistrationsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: ApproveRegistrationUseCase,
          useValue: {
            execute: async (input: { registrationId: string }) => ({
              id: input.registrationId,
              competitionId,
              participantId: "user-1",
              categoryId,
              divisionId,
              status: "approved",
              createdAt: "2026-05-04T00:00:00.000Z",
              updatedAt: "2026-05-04T00:00:00.000Z",
            }),
          },
        },
        {
          provide: RejectRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({
        canActivate(context: {
          switchToHttp(): { getRequest(): { user?: Record<string, unknown> } };
        }) {
          context.switchToHttp().getRequest().user = {
            id: "user-1",
            email: "test@example.com",
            name: "Test User",
            emailVerified: true,
            image: null,
          };
          return true;
        },
      })
      .compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .patch(
        `/competitions/${competitionId}/registrations/${registrationId}/approve`,
      )
      .send({})
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: registrationId,
          status: "approved",
        });
      });

    await app.close();
  });

  it("rejects a registration", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: CreateRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListRegistrationsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: ApproveRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: RejectRegistrationUseCase,
          useValue: {
            execute: async (regId: string) => ({
              id: regId,
              competitionId,
              participantId: "user-1",
              categoryId,
              divisionId,
              status: "rejected",
              createdAt: "2026-05-04T00:00:00.000Z",
              updatedAt: "2026-05-04T00:00:00.000Z",
            }),
          },
        },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({
        canActivate(context: {
          switchToHttp(): { getRequest(): { user?: Record<string, unknown> } };
        }) {
          context.switchToHttp().getRequest().user = {
            id: "user-1",
            email: "test@example.com",
            name: "Test User",
            emailVerified: true,
            image: null,
          };
          return true;
        },
      })
      .compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .patch(
        `/competitions/${competitionId}/registrations/${registrationId}/reject`,
      )
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: registrationId,
          status: "rejected",
        });
      });

    await app.close();
  });

  it("rejects unauthenticated requests", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: CreateRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListRegistrationsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: ApproveRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: RejectRegistrationUseCase,
          useValue: { execute: async () => ({}) },
        },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({
        canActivate() {
          throw new UnauthorizedException();
        },
      })
      .compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .get(`/competitions/${competitionId}/registrations`)
      .expect(401);

    await app.close();
  });
});
