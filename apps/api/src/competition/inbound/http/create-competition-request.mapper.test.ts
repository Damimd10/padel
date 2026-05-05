import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { mapCreateCompetitionRequestToCommand } from "./create-competition-request.mapper.js";

function createTestRequest(overrides: Record<string, unknown> = {}) {
  return {
    title: "Protected Open",
    format: "league" as const,
    startsAt: "2026-05-10T10:00:00.000Z",
    endsAt: "2026-05-12T18:00:00.000Z",
    pricePerTeam: 0,
    isPublic: true,
    requiresApproval: false,
    hasWaitlist: true,
    setsToWin: 2,
    gamesPerSet: 6,
    tiebreakPoints: 7,
    goldenPoint: false,
    matchDurationMinutes: 60,
    breakBetweenMatchesMinutes: 15,
    autoGenerateSchedule: true,
    earlyBirdDiscount: 0,
    isFreeEntry: false,
    courts: [],
    prizes: [],
    ...overrides,
  };
}

describe("mapCreateCompetitionRequestToCommand", () => {
  it("maps the authenticated user identity into the application command", () => {
    expect(
      mapCreateCompetitionRequestToCommand(
        createTestRequest({
          title: "Protected Open",
          format: "league",
        }),
        { id: "user-123" },
      ),
    ).toMatchObject({
      title: "Protected Open",
      format: "league",
      ownerId: "user-123",
    });
  });

  it("rejects mapping when the authenticated user identity is missing", () => {
    expect(() =>
      mapCreateCompetitionRequestToCommand(createTestRequest(), undefined),
    ).toThrow(UnauthorizedException);
  });
});
