import "reflect-metadata/Reflect.js";

import { UnauthorizedException } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateCategoryUseCase } from "../../application/create-category.use-case.js";
import { DeleteCategoryUseCase } from "../../application/delete-category.use-case.js";
import { ListCategoriesUseCase } from "../../application/list-categories.use-case.js";
import { UpdateCategoryUseCase } from "../../application/update-category.use-case.js";
import { CategoryController } from "./category.controller.js";

describe("CategoryController", () => {
  const competitionId = "11111111-1111-4111-8111-111111111111";

  it("lists categories for a competition", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListCategoriesUseCase,
          useValue: {
            execute: async () => [
              {
                id: "11111111-1111-4111-8111-111111111113",
                competitionId,
                label: "Segunda",
                createdAt: "2026-05-03T10:00:00.000Z",
                updatedAt: "2026-05-03T10:00:00.000Z",
              },
            ],
          },
        },
        {
          provide: UpdateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteCategoryUseCase,
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
      .get(`/competitions/${competitionId}/categories`)
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toHaveLength(1);
        expect((body as Array<Record<string, unknown>>)[0]).toMatchObject({
          label: "Segunda",
        });
      });

    await app.close();
  });

  it("creates a category for a competition", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: {
            execute: async (input: {
              competitionId: string;
              label: string;
            }) => ({
              id: "11111111-1111-4111-8111-111111111112",
              competitionId: input.competitionId,
              label: input.label,
              createdAt: "2026-05-03T10:00:00.000Z",
              updatedAt: "2026-05-03T10:00:00.000Z",
            }),
          },
        },
        {
          provide: ListCategoriesUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteCategoryUseCase,
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
      .post(`/competitions/${competitionId}/categories`)
      .send({ label: "Tercera" })
      .expect(201)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111112",
          competitionId,
          label: "Tercera",
        });
      });

    await app.close();
  });

  it("updates a category", async () => {
    const categoryId = "11111111-1111-4111-8111-111111111114";
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListCategoriesUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateCategoryUseCase,
          useValue: {
            execute: async (input: { categoryId: string; label: string }) => ({
              id: input.categoryId,
              competitionId,
              label: input.label,
              createdAt: "2026-05-03T10:00:00.000Z",
              updatedAt: "2026-05-03T12:00:00.000Z",
            }),
          },
        },
        {
          provide: DeleteCategoryUseCase,
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
      .patch(`/competitions/${competitionId}/categories/${categoryId}`)
      .send({ label: "Segunda A" })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111114",
          label: "Segunda A",
        });
      });

    await app.close();
  });

  it("deletes a category", async () => {
    const categoryId = "11111111-1111-4111-8111-111111111115";
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListCategoriesUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteCategoryUseCase,
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
      .delete(`/competitions/${competitionId}/categories/${categoryId}`)
      .expect(204);

    await app.close();
  });

  it("rejects unauthenticated requests", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: ListCategoriesUseCase,
          useValue: { execute: async () => [] },
        },
        {
          provide: UpdateCategoryUseCase,
          useValue: { execute: async () => ({}) },
        },
        {
          provide: DeleteCategoryUseCase,
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
      .get(`/competitions/${competitionId}/categories`)
      .expect(401);

    await app.close();
  });
});
