import { describe, expect, it } from "vitest";

import { Competition } from "./competition.js";

describe("Competition", () => {
  it("creates a draft competition from valid input", () => {
    const competition = Competition.createDraft(
      {
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
      },
      "competition-1",
    );

    expect(competition.toResponse()).toMatchObject({
      id: "competition-1",
      title: "Spring Open",
      format: "elimination",
      ownerId: "owner-1",
      status: "draft",
    });
  });

  it("rejects a competition with end date before start date", () => {
    expect(() =>
      Competition.createDraft(
        {
          title: "Broken Open",
          format: "league",
          startsAt: "2026-05-12T18:00:00.000Z",
          endsAt: "2026-05-10T10:00:00.000Z",
          ownerId: "owner-1",
        },
        "competition-1",
      ),
    ).toThrow(/end date/i);
  });
});
