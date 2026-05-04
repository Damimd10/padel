import { NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";
import { Competition } from "../domain/competition.js";
import { Match } from "../domain/match.js";
import { GenerateMatchesUseCase } from "./generate-matches.use-case.js";
import { FakeCompetitionRepository } from "./ports/fake-competition-repository.js";
import { FakeMatchRepository } from "./ports/fake-match-repository.js";
import { FakeRegistrationRepository } from "./ports/fake-registration-repository.js";

describe("GenerateMatchesUseCase", () => {
  let useCase: GenerateMatchesUseCase;
  let competitionRepository: FakeCompetitionRepository;
  let matchRepository: FakeMatchRepository;
  let registrationRepository: FakeRegistrationRepository;

  beforeEach(() => {
    competitionRepository = new FakeCompetitionRepository();
    matchRepository = new FakeMatchRepository();
    registrationRepository = new FakeRegistrationRepository();

    useCase = new GenerateMatchesUseCase(
      competitionRepository,
      matchRepository,
      registrationRepository,
    );
  });

  it("throws if competition not found", async () => {
    await expect(
      useCase.execute({ competitionId: "non-existent" }),
    ).rejects.toThrow(NotFoundException);
  });

  it("throws if competition is not closed", async () => {
    const competition = Competition.createDraft(
      {
        title: "Test",
        format: "round-robin",
        startsAt: "2026-06-01T10:00:00Z",
        endsAt: "2026-06-01T18:00:00Z",
        ownerId: "owner-1",
      },
      "comp-1",
    );
    await competitionRepository.create(competition);

    await expect(useCase.execute({ competitionId: "comp-1" })).rejects.toThrow(
      "Competition must be in closed status",
    );
  });

  it("throws if less than two approved registrations", async () => {
    const competition = Competition.createDraft(
      {
        title: "Test",
        format: "round-robin",
        startsAt: "2026-06-01T10:00:00Z",
        endsAt: "2026-06-01T18:00:00Z",
        ownerId: "owner-1",
      },
      "comp-1",
    );
    competition.open();
    competition.close();
    await competitionRepository.create(competition);

    await expect(useCase.execute({ competitionId: "comp-1" })).rejects.toThrow(
      "Competition must have at least two approved registrations",
    );
  });

  it("generates round-robin matches for approved registrations", async () => {
    const competition = Competition.createDraft(
      {
        title: "Test",
        format: "round-robin",
        startsAt: "2026-06-01T10:00:00Z",
        endsAt: "2026-06-01T18:00:00Z",
        ownerId: "owner-1",
      },
      "comp-1",
    );
    competition.open();
    competition.close();
    await competitionRepository.create(competition);

    const now = new Date().toISOString();
    registrationRepository.setRegistrations([
      {
        id: "reg-1",
        competitionId: "comp-1",
        participantId: "p1",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-2",
        competitionId: "comp-1",
        participantId: "p2",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-3",
        competitionId: "comp-1",
        participantId: "p3",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const result = await useCase.execute({ competitionId: "comp-1" });

    expect(result.matchCount).toBe(3);
    const matches = await matchRepository.findByCompetition("comp-1");
    expect(matches).toHaveLength(3);
  });

  it("generates elimination matches for approved registrations", async () => {
    const competition = Competition.createDraft(
      {
        title: "Test",
        format: "elimination",
        startsAt: "2026-06-01T10:00:00Z",
        endsAt: "2026-06-01T18:00:00Z",
        ownerId: "owner-1",
      },
      "comp-1",
    );
    competition.open();
    competition.close();
    await competitionRepository.create(competition);

    const now = new Date().toISOString();
    registrationRepository.setRegistrations([
      {
        id: "reg-1",
        competitionId: "comp-1",
        participantId: "p1",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-2",
        competitionId: "comp-1",
        participantId: "p2",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-3",
        competitionId: "comp-1",
        participantId: "p3",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-4",
        competitionId: "comp-1",
        participantId: "p4",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const result = await useCase.execute({ competitionId: "comp-1" });

    expect(result.matchCount).toBe(2);
  });

  it("generates league matches (double round-robin) for approved registrations", async () => {
    const competition = Competition.createDraft(
      {
        title: "Test",
        format: "league",
        startsAt: "2026-06-01T10:00:00Z",
        endsAt: "2026-06-01T18:00:00Z",
        ownerId: "owner-1",
      },
      "comp-1",
    );
    competition.open();
    competition.close();
    await competitionRepository.create(competition);

    const now = new Date().toISOString();
    registrationRepository.setRegistrations([
      {
        id: "reg-1",
        competitionId: "comp-1",
        participantId: "p1",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-2",
        competitionId: "comp-1",
        participantId: "p2",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-3",
        competitionId: "comp-1",
        participantId: "p3",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const result = await useCase.execute({ competitionId: "comp-1" });

    expect(result.matchCount).toBe(6);
  });

  it("groups registrations by category and division", async () => {
    const competition = Competition.createDraft(
      {
        title: "Test",
        format: "round-robin",
        startsAt: "2026-06-01T10:00:00Z",
        endsAt: "2026-06-01T18:00:00Z",
        ownerId: "owner-1",
      },
      "comp-1",
    );
    competition.open();
    competition.close();
    await competitionRepository.create(competition);

    const now = new Date().toISOString();
    registrationRepository.setRegistrations([
      {
        id: "reg-1",
        competitionId: "comp-1",
        participantId: "p1",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-2",
        competitionId: "comp-1",
        participantId: "p2",
        categoryId: "cat-1",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-3",
        competitionId: "comp-1",
        participantId: "p3",
        categoryId: "cat-2",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "reg-4",
        competitionId: "comp-1",
        participantId: "p4",
        categoryId: "cat-2",
        divisionId: "div-1",
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const result = await useCase.execute({ competitionId: "comp-1" });

    expect(result.matchCount).toBe(2);
  });
});
