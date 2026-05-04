import { describe, expect, it } from "vitest";

import type { CompetitionRegistration } from "../domain/competition-registration.js";
import { CreateRegistrationUseCase } from "./create-registration.use-case.js";
import { FakeRegistrationRepository } from "./ports/fake-registration-repository.js";

describe("CreateRegistrationUseCase", () => {
  it("creates a registration for a participant", async () => {
    const repository = new FakeRegistrationRepository({
      nextId: "reg-1",
    });
    const useCase = new CreateRegistrationUseCase(repository);

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
      status: "registered",
    });
  });

  it("throws when participant is already registered", async () => {
    const repository = new FakeRegistrationRepository({
      findByParticipantAndCompetitionResult:
        {} as unknown as CompetitionRegistration,
    });
    const useCase = new CreateRegistrationUseCase(repository);

    await expect(
      useCase.execute({
        competitionId: "comp-1",
        participantId: "user-1",
        categoryId: "cat-1",
        divisionId: "div-1",
      }),
    ).rejects.toThrow("You are already registered for this competition.");
  });
});
