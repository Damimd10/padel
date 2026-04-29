import "reflect-metadata";

import { UnauthorizedException } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateCompetitionUseCase } from "../../application/create-competition.use-case.js";
import { CompetitionController } from "./competition.controller.js";

describe("CompetitionController", () => {
  it("creates a competition through the authenticated HTTP boundary", async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompetitionController],
      providers: [
        {
          provide: CreateCompetitionUseCase,
          useValue: {
            execute: async (input: {
              title: string;
              format: string;
              startsAt: string;
              endsAt: string;
              ownerId: string;
            }) => ({
              id: "11111111-1111-4111-8111-111111111111",
              ...input,
              status: "draft",
            }),
          },
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
      .post("/competitions")
      .send({
        title: "Winter Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
      })
      .expect(201)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111111",
          title: "Winter Open",
          format: "elimination",
          ownerId: "user-1",
          status: "draft",
        });
      });

    await app.close();
  });

  it("rejects unauthenticated requests before the use case runs", async () => {
    const execute = () => {
      throw new Error("should not be called");
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [CompetitionController],
      providers: [
        {
          provide: CreateCompetitionUseCase,
          useValue: { execute },
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
      .post("/competitions")
      .send({
        title: "Winter Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
      })
      .expect(401);

    await app.close();
  });
});
