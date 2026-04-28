import "reflect-metadata";

import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { CreateCompetitionUseCase } from "../src/competition/application/create-competition.use-case.js";
import { CompetitionController } from "../src/competition/inbound/http/competition.controller.js";

describe("CompetitionController", () => {
  it("creates a competition through the HTTP boundary", async () => {
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
    }).compile();

    const app = moduleRef.createNestApplication(new ExpressAdapter());
    await app.init();

    await request(app.getHttpServer())
      .post("/competitions")
      .send({
        title: "Winter Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
      })
      .expect(201)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          id: "11111111-1111-4111-8111-111111111111",
          title: "Winter Open",
          format: "elimination",
          ownerId: "owner-1",
          status: "draft",
        });
      });

    await app.close();
  });
});
