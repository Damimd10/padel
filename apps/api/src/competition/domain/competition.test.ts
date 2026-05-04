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

  describe("status transitions", () => {
    it("opens a draft competition", () => {
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

      competition.open();

      expect(competition.toPersistence()).toMatchObject({
        status: "open",
      });
    });

    it("opens a draft competition when category and division counts are positive", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "draft",
        categoryCount: 2,
        divisionCount: 1,
      });

      competition.open();

      expect(competition.toPersistence()).toMatchObject({
        status: "open",
      });
    });

    it("rejects opening a competition without categories", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "draft",
        categoryCount: 0,
        divisionCount: 1,
      });

      expect(() => competition.open()).toThrow(/category/i);
    });

    it("rejects opening a competition without divisions", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "draft",
        categoryCount: 2,
        divisionCount: 0,
      });

      expect(() => competition.open()).toThrow(/division/i);
    });

    it("rejects opening a non-draft competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "open",
      });

      expect(() => competition.open()).toThrow(/only be opened from draft/i);
    });

    it("closes an open competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "open",
      });

      competition.close();

      expect(competition.toPersistence()).toMatchObject({
        status: "closed",
      });
    });

    it("rejects closing a non-open competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "draft",
      });

      expect(() => competition.close()).toThrow(/only be closed from open/i);
    });

    it("cancels a draft competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "draft",
      });

      competition.cancel();

      expect(competition.toPersistence()).toMatchObject({
        status: "cancelled",
      });
    });

    it("cancels an open competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "open",
      });

      competition.cancel();

      expect(competition.toPersistence()).toMatchObject({
        status: "cancelled",
      });
    });

    it("cancels a closed competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "closed",
      });

      competition.cancel();

      expect(competition.toPersistence()).toMatchObject({
        status: "cancelled",
      });
    });

    it("rejects cancelling an already cancelled competition", () => {
      const competition = Competition.restore({
        id: "competition-1",
        title: "Spring Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "cancelled",
      });

      expect(() => competition.cancel()).toThrow(/already cancelled/i);
    });
  });
});
