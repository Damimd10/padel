import { describe, expect, it } from "vitest";

import { mapCompetitionOverviewRow } from "./competition-overview.mapper.js";

describe("mapCompetitionOverviewRow", () => {
  it("maps persistence rows into the published overview contract", () => {
    expect(
      mapCompetitionOverviewRow({
        id: "11111111-1111-4111-8111-111111111111",
        title: "Regional Open",
        format: "round_robin",
        status: "open",
        startsAt: new Date("2026-05-10T10:00:00.000Z"),
        endsAt: new Date("2026-05-12T18:00:00.000Z"),
        owner: {
          id: "owner-1",
          name: "Operations User",
          email: "ops@example.com",
        },
      }),
    ).toEqual({
      id: "11111111-1111-4111-8111-111111111111",
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
    });
  });
});
