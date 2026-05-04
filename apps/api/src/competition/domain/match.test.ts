import { describe, expect, it } from "vitest";

import { Match } from "./match.js";

describe("Match", () => {
  describe("create", () => {
    it("creates a match in scheduled status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");

      expect(match.id).toBe("match-1");
      expect(match.competitionId).toBe("comp-1");
      expect(match.registrationAId).toBe("reg-a");
      expect(match.registrationBId).toBe("reg-b");
      expect(match.status).toBe("scheduled");
      expect(match.scheduledAt).toBeUndefined();
      expect(match.scoreA).toBeUndefined();
      expect(match.scoreB).toBeUndefined();
    });

    it("throws if competition ID is empty", () => {
      expect(() => Match.create("", "reg-a", "reg-b", "match-1")).toThrow(
        "Competition ID is required.",
      );
    });

    it("throws if registration A ID is empty", () => {
      expect(() => Match.create("comp-1", "", "reg-b", "match-1")).toThrow(
        "Registration A ID is required.",
      );
    });

    it("throws if registration B ID is empty", () => {
      expect(() => Match.create("comp-1", "reg-a", "", "match-1")).toThrow(
        "Registration B ID is required.",
      );
    });

    it("throws if registration A and B are the same", () => {
      expect(() =>
        Match.create("comp-1", "reg-same", "reg-same", "match-1"),
      ).toThrow("Registration A and Registration B must be different.");
    });
  });

  describe("restore", () => {
    it("restores a match with all properties", () => {
      const match = Match.restore({
        id: "match-1",
        competitionId: "comp-1",
        registrationAId: "reg-a",
        registrationBId: "reg-b",
        status: "in_progress",
        scheduledAt: "2026-05-10T10:00:00Z",
        scoreA: 6,
        scoreB: 4,
      });

      expect(match.id).toBe("match-1");
      expect(match.status).toBe("in_progress");
      expect(match.scheduledAt).toBe("2026-05-10T10:00:00Z");
      expect(match.scoreA).toBe(6);
      expect(match.scoreB).toBe(4);
    });
  });

  describe("schedule", () => {
    it("schedules a match from scheduled status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");

      match.schedule("2026-05-10T10:00:00Z");

      expect(match.scheduledAt).toBe("2026-05-10T10:00:00Z");
    });

    it("throws if match is not in scheduled status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      expect(() => match.schedule("2026-05-10T10:00:00Z")).toThrow(
        "Match can only be scheduled from scheduled status.",
      );
    });

    it("throws if scheduled date is invalid", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");

      expect(() => match.schedule("invalid-date")).toThrow(
        "Scheduled date must be a valid ISO datetime.",
      );
    });
  });

  describe("start", () => {
    it("starts a match from scheduled status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");

      match.start();

      expect(match.status).toBe("in_progress");
    });

    it("throws if match is not in scheduled status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();
      match.complete(6, 4);

      expect(() => match.start()).toThrow(
        "Match can only be started from scheduled status.",
      );
    });
  });

  describe("complete", () => {
    it("completes a match from in_progress status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      match.complete(6, 4);

      expect(match.status).toBe("completed");
      expect(match.scoreA).toBe(6);
      expect(match.scoreB).toBe(4);
    });

    it("allows a draw score", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      match.complete(5, 5);

      expect(match.status).toBe("completed");
      expect(match.scoreA).toBe(5);
      expect(match.scoreB).toBe(5);
    });

    it("throws if match is not in in_progress status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");

      expect(() => match.complete(6, 4)).toThrow(
        "Match can only be completed from in_progress status.",
      );
    });

    it("throws if score A is negative", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      expect(() => match.complete(-1, 4)).toThrow(
        "Score A must be a non-negative integer.",
      );
    });

    it("throws if score B is negative", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      expect(() => match.complete(6, -1)).toThrow(
        "Score B must be a non-negative integer.",
      );
    });

    it("throws if score A is not an integer", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      expect(() => match.complete(6.5, 4)).toThrow(
        "Score A must be a non-negative integer.",
      );
    });
  });

  describe("cancel", () => {
    it("cancels a match from scheduled status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");

      match.cancel();

      expect(match.status).toBe("cancelled");
    });

    it("cancels a match from in_progress status", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();

      match.cancel();

      expect(match.status).toBe("cancelled");
    });

    it("throws if match is already completed", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.start();
      match.complete(6, 4);

      expect(() => match.cancel()).toThrow(
        "Completed match cannot be cancelled.",
      );
    });

    it("throws if match is already cancelled", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.cancel();

      expect(() => match.cancel()).toThrow("Match is already cancelled.");
    });
  });

  describe("toPersistence", () => {
    it("returns all properties", () => {
      const match = Match.create("comp-1", "reg-a", "reg-b", "match-1");
      match.schedule("2026-05-10T10:00:00Z");
      match.start();
      match.complete(6, 4);

      const persistence = match.toPersistence();

      expect(persistence).toEqual({
        id: "match-1",
        competitionId: "comp-1",
        registrationAId: "reg-a",
        registrationBId: "reg-b",
        status: "completed",
        scheduledAt: "2026-05-10T10:00:00Z",
        scoreA: 6,
        scoreB: 4,
      });
    });
  });
});
