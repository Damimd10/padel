import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { mapCreateCompetitionRequestToCommand } from "./create-competition-request.mapper.js";

describe("mapCreateCompetitionRequestToCommand", () => {
  it("maps the authenticated user identity into the application command", () => {
    expect(
      mapCreateCompetitionRequestToCommand(
        {
          title: "Protected Open",
          format: "league",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
        },
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
      mapCreateCompetitionRequestToCommand(
        {
          title: "Protected Open",
          format: "league",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
        },
        undefined,
      ),
    ).toThrow(UnauthorizedException);
  });
});
