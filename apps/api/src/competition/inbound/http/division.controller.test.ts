import "reflect-metadata/Reflect.js";

import { UnauthorizedException } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateDivisionUseCase } from "../../application/create-division.use-case.js";
import { DeleteDivisionUseCase } from "../../application/delete-division.use-case.js";
import { ListDivisionsUseCase } from "../../application/list-divisions.use-case.js";
import { UpdateDivisionUseCase } from "../../application/update-division.use-case.js";
import { DivisionController } from "./division.controller.js";

describe("DivisionController", () => {
  const competitionId = "11111111-1111-4111-8111-111111111111";

  it("lists divisions for a competition", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DivisionController],
      providers: [
        {
          provide: CreateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListDivisionsUseCase,
          useValue: {
            execute: async () => [
              {
                id: "11111111-1111-4111-8111-111111111113",
                competitionId,
                name: "masculino",
                createdAt: "2026-05-03T10:00:00.000Z",
                updatedAt: "2026-05-03T10:00:00.000Z",
              },
            ],
          },
        },
        {
          provide: UpdateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteDivisionUseCase,
          useValue: { execute: async () => {} },
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
      .get(`/competitions/${competitionId}/divisions`)
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toHaveLength(1);
        expect((body as Array<Record<string, unknown>>)[0]).toMatchObject({
          name: "masculino",
        });
      });

    await app.close();
  });

  it("creates a division for a competition", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DivisionController],
      providers: [
        {
          provide: CreateDivisionUseCase,
          useValue: {
            execute: async (input: {
              competitionId: string;
              name: string;
            }) => ({
              id: "11111111-1111-4111-8111-111111111112",
              competitionId: input.competitionId,
              name: input.name,
              createdAt: "2026-05-03T10:00:00.000Z",
              updatedAt: "2026-05-03T10:00:00.000Z",
            }),
          },
        },
        {
          provide: ListDivisionsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteDivisionUseCase,
          useValue: { execute: async () => {} },
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
      .post(`/competitions/${competitionId}/divisions`)
      .send({ name: "femenino" })
      .expect(201)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111112",
          competitionId,
          name: "femenino",
        });
      });

    await app.close();
  });

  it("updates a division", async () => {
    const divisionId = "11111111-1111-4111-8111-111111111114";
    const moduleRef = await Test.createTestingModule({
      controllers: [DivisionController],
      providers: [
        {
          provide: CreateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListDivisionsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateDivisionUseCase,
          useValue: {
            execute: async (input: { divisionId: string; name: string }) => ({
              id: input.divisionId,
              competitionId,
              name: input.name,
              createdAt: "2026-05-03T10:00:00.000Z",
              updatedAt: "2026-05-03T12:00:00.000Z",
            }),
          },
        },
        {
          provide: DeleteDivisionUseCase,
          useValue: { execute: async () => {} },
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
      .patch(`/competitions/${competitionId}/divisions/${divisionId}`)
      .send({ name: "mixto" })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111114",
          name: "mixto",
        });
      });

    await app.close();
  });

  it("deletes a division", async () => {
    const divisionId = "11111111-1111-4111-8111-111111111115";
    const moduleRef = await Test.createTestingModule({
      controllers: [DivisionController],
      providers: [
        {
          provide: CreateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListDivisionsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteDivisionUseCase,
          useValue: { execute: async () => {} },
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
      .delete(`/competitions/${competitionId}/divisions/${divisionId}`)
      .expect(204);

    await app.close();
  });

  it("rejects unauthenticated requests", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DivisionController],
      providers: [
        {
          provide: CreateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListDivisionsUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateDivisionUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteDivisionUseCase,
          useValue: { execute: async () => {} },
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
      .get(`/competitions/${competitionId}/divisions`)
      .expect(401);

    await app.close();
  });
});
