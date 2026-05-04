import { describe, expect, it } from "vitest";

import type { CompetitionRegistration } from "../domain/competition-registration.js";
import { CreateRegistrationUseCase } from "./create-registration.use-case.js";
import type { CategoryRepository } from "./ports/category-repository.js";
import type { CompetitionRepository } from "./ports/competition-repository.js";
import type { DivisionRepository } from "./ports/division-repository.js";
import { FakeRegistrationRepository } from "./ports/fake-registration-repository.js";

function makeFakeCompetitionRepository(overrides = {}): CompetitionRepository {
  return {
    nextId: async () => "comp-1",
    create: async () => undefined,
    listOverview: async () => [],
    findById: async () =>
      ({
        toResponse: () => ({ id: "comp-1", status: "open" }),
      }) as unknown as import("../domain/competition.js").Competition,
    ...overrides,
  };
}

function makeFakeCategoryRepository(overrides = {}): CategoryRepository {
  return {
    nextId: async () => "cat-1",
    create: async () => undefined,
    listByCompetitionId: async () => [],
    findById: async () =>
      ({
        toResponse: () => ({ id: "cat-1", competitionId: "comp-1" }),
      }) as unknown as import("../domain/category.js").Category,
    update: async () => undefined,
    delete: async () => undefined,
    ...overrides,
  };
}

function makeFakeDivisionRepository(overrides = {}): DivisionRepository {
  return {
    nextId: async () => "div-1",
    create: async () => undefined,
    listByCompetitionId: async () => [],
    findById: async () =>
      ({
        toResponse: () => ({ id: "div-1", competitionId: "comp-1" }),
      }) as unknown as import("../domain/division.js").Division,
    update: async () => undefined,
    delete: async () => undefined,
    ...overrides,
  };
}

describe("CreateRegistrationUseCase", () => {
  it("creates a registration for a participant", async () => {
    const registrationRepo = new FakeRegistrationRepository({
      nextId: "reg-1",
    });
    const useCase = new CreateRegistrationUseCase(
      registrationRepo,
      makeFakeCompetitionRepository(),
      makeFakeCategoryRepository(),
      makeFakeDivisionRepository(),
    );

    const result = await useCase.execute({
      competitionId: "comp-1",
      participantId: "user-1",
      categoryId: "cat-1",
      divisionId: "div-1",
    });

    expect(result).toMatchObject({
      id: "reg-1",
      competitionId: "comp-1",
      participantId: "user-1",
      categoryId: "cat-1",
      divisionId: "div-1",
      status: "pending_review",
    });
  });

  it("throws when participant is already registered", async () => {
    const registrationRepo = new FakeRegistrationRepository({
      findByParticipantAndCompetitionResult:
        {} as unknown as CompetitionRegistration,
    });
    const useCase = new CreateRegistrationUseCase(
      registrationRepo,
      makeFakeCompetitionRepository(),
      makeFakeCategoryRepository(),
      makeFakeDivisionRepository(),
    );

    await expect(
      useCase.execute({
        competitionId: "comp-1",
        participantId: "user-1",
        categoryId: "cat-1",
        divisionId: "div-1",
      }),
    ).rejects.toThrow("You are already registered for this competition.");
  });

  it("throws when competition is not open", async () => {
    const registrationRepo = new FakeRegistrationRepository();
    const useCase = new CreateRegistrationUseCase(
      registrationRepo,
      makeFakeCompetitionRepository({
        findById: async () =>
          ({
            toResponse: () => ({ id: "comp-1", status: "draft" }),
          }) as unknown as import("../domain/competition.js").Competition,
      }),
      makeFakeCategoryRepository(),
      makeFakeDivisionRepository(),
    );

    await expect(
      useCase.execute({
        competitionId: "comp-1",
        participantId: "user-1",
        categoryId: "cat-1",
        divisionId: "div-1",
      }),
    ).rejects.toThrow(
      "Registration is only allowed for competitions in open status.",
    );
  });
});
