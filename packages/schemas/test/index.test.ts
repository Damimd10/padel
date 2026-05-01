import { describe, expect, it } from "vitest";

import {
  competitionOverviewCollectionSchema,
  createCompetitionRequestSchema,
  createCompetitionResponseSchema,
} from "../src/index.js";

describe("competition schemas", () => {
  it("parses a valid create-competition request", () => {
    expect(
      createCompetitionRequestSchema.parse({
        title: "Regional Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
      }),
    ).toMatchObject({
      title: "Regional Open",
      format: "elimination",
    });
  });

  it("rejects a create-competition request that includes ownerId", () => {
    expect(() =>
      createCompetitionRequestSchema.parse({
        title: "Regional Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
      }),
    ).toThrow();
  });

  it("rejects a response with a non-draft status", () => {
    expect(() =>
      createCompetitionResponseSchema.parse({
        id: crypto.randomUUID(),
        title: "Regional Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "open",
      }),
    ).toThrow();
  });

  it("parses a valid competition overview collection", () => {
    expect(
      competitionOverviewCollectionSchema.parse([
        {
          id: crypto.randomUUID(),
          title: "Regional Open",
          format: "round-robin",
          status: "open",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
          owner: {
            id: "owner-1",
            name: "Operations User",
            email: "ops@example.com",
          },
        },
      ]),
    ).toHaveLength(1);
  });

  it("rejects a competition overview item without owner context", () => {
    expect(() =>
      competitionOverviewCollectionSchema.parse([
        {
          id: crypto.randomUUID(),
          title: "Regional Open",
          format: "round-robin",
          status: "open",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
        },
      ]),
    ).toThrow();
  });
});
