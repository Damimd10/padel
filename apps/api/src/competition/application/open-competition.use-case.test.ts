import { describe, expect, it } from "vitest";

import { Competition } from "../domain/competition.js";
import { createTestCompetitionProps } from "../test-helpers.js";
import { OpenCompetitionUseCase } from "./open-competition.use-case.js";
import type { CompetitionRepository } from "./ports/competition-repository.js";

class FakeCompetitionRepository implements CompetitionRepository {
  saved: Competition[] = [];
  private findResult: Competition | null = null;

  async nextId() {
    return "competition-123";
  }

  async create(): Promise<void> {}

  async save(competition: Competition): Promise<void> {
    this.saved.push(competition);
  }

  async listOverview() {
    return [];
  }

  async findById(): Promise<Competition | null> {
    return this.findResult;
  }

  async findByIdWithCounts(): Promise<Competition | null> {
    return this.findResult;
  }

  setFindResult(result: Competition | null) {
    this.findResult = result;
  }
}

describe("OpenCompetitionUseCase", () => {
  it("opens a draft competition", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new OpenCompetitionUseCase(repository);
    const competition = Competition.restore(
      createTestCompetitionProps({
        id: "competition-1",
        title: "Spring Open",
        status: "draft",
        categoryCount: 2,
        divisionCount: 1,
      }),
    );
    repository.setFindResult(competition);

    const result = await useCase.execute({ competitionId: "competition-1" });

    expect(result).toEqual({ status: "open" });
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0].toPersistence()).toMatchObject({
      status: "open",
    });
  });

  it("throws when competition is not found", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new OpenCompetitionUseCase(repository);
    repository.setFindResult(null);

    await expect(useCase.execute({ competitionId: "missing" })).rejects.toThrow(
      "Competition not found.",
    );
  });

  it("throws when competition has no categories", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new OpenCompetitionUseCase(repository);
    const competition = Competition.restore(
      createTestCompetitionProps({
        id: "competition-1",
        title: "Spring Open",
        status: "draft",
        categoryCount: 0,
        divisionCount: 1,
      }),
    );
    repository.setFindResult(competition);

    await expect(
      useCase.execute({ competitionId: "competition-1" }),
    ).rejects.toThrow(/category/i);
  });

  it("throws when competition has no divisions", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new OpenCompetitionUseCase(repository);
    const competition = Competition.restore(
      createTestCompetitionProps({
        id: "competition-1",
        title: "Spring Open",
        status: "draft",
        categoryCount: 2,
        divisionCount: 0,
      }),
    );
    repository.setFindResult(competition);

    await expect(
      useCase.execute({ competitionId: "competition-1" }),
    ).rejects.toThrow(/division/i);
  });
});
