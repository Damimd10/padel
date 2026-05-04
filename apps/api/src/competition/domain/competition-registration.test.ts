import { describe, expect, it } from "vitest";

import { CompetitionRegistration } from "./competition-registration.js";

describe("CompetitionRegistration", () => {
  it("creates a registration in registered status", () => {
    const registration = CompetitionRegistration.create(
      {
        competitionId: "comp-1",
        participantId: "user-1",
        categoryId: "cat-1",
        divisionId: "div-1",
      },
      "reg-1",
      "2026-05-04T00:00:00.000Z",
    );

    const response = registration.toResponse();

    expect(response).toMatchObject({
      id: "reg-1",
      competitionId: "comp-1",
      participantId: "user-1",
      categoryId: "cat-1",
      divisionId: "div-1",
      status: "registered",
    });
  });

  it("throws when required fields are missing", () => {
    expect(() =>
      CompetitionRegistration.create(
        {
          competitionId: "",
          participantId: "user-1",
          categoryId: "cat-1",
          divisionId: "div-1",
        },
        "reg-1",
        "2026-05-04T00:00:00.000Z",
      ),
    ).toThrow("Competition ID is required.");

    expect(() =>
      CompetitionRegistration.create(
        {
          competitionId: "comp-1",
          participantId: "",
          categoryId: "cat-1",
          divisionId: "div-1",
        },
        "reg-1",
        "2026-05-04T00:00:00.000Z",
      ),
    ).toThrow("Participant ID is required.");

    expect(() =>
      CompetitionRegistration.create(
        {
          competitionId: "comp-1",
          participantId: "user-1",
          categoryId: "",
          divisionId: "div-1",
        },
        "reg-1",
        "2026-05-04T00:00:00.000Z",
      ),
    ).toThrow("Category ID is required.");

    expect(() =>
      CompetitionRegistration.create(
        {
          competitionId: "comp-1",
          participantId: "user-1",
          categoryId: "cat-1",
          divisionId: "",
        },
        "reg-1",
        "2026-05-04T00:00:00.000Z",
      ),
    ).toThrow("Division ID is required.");
  });

  it("restores a registration from persistence props", () => {
    const registration = CompetitionRegistration.restore({
      id: "reg-1",
      competitionId: "comp-1",
      participantId: "user-1",
      categoryId: "cat-1",
      divisionId: "div-1",
      status: "approved",
      createdAt: "2026-05-04T00:00:00.000Z",
      updatedAt: "2026-05-04T00:00:00.000Z",
    });

    expect(registration.toResponse()).toMatchObject({
      id: "reg-1",
      status: "approved",
    });
  });
});
