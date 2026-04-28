import { describe, expect, it } from "vitest";

import {
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
        ownerId: "owner-1",
      }),
    ).toMatchObject({
      title: "Regional Open",
      format: "elimination",
      ownerId: "owner-1",
    });
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
});
