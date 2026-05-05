import { describe, expect, it } from "vitest";

import { Competition } from "../domain/competition.js";
import { createTestCompetitionProps } from "../test-helpers.js";
import { CloseCompetitionUseCase } from "./close-competition.use-case.js";
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

describe("CloseCompetitionUseCase", () => {
  it("closes an open competition", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CloseCompetitionUseCase(repository);
    const competition = Competition.restore(
      createTestCompetitionProps({
        id: "competition-1",
        title: "Spring Open",
        status: "open",
      }),
    );
    repository.setFindResult(competition);

    const result = await useCase.execute({ competitionId: "competition-1" });

    expect(result).toEqual({ status: "closed" });
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0].toPersistence()).toMatchObject({
      status: "closed",
    });
  });

  it("throws when competition is not found", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CloseCompetitionUseCase(repository);
    repository.setFindResult(null);

    await expect(useCase.execute({ competitionId: "missing" })).rejects.toThrow(
      "Competition not found.",
    );
  });

  it("throws when competition is not open", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CloseCompetitionUseCase(repository);
    const competition = Competition.restore(
      createTestCompetitionProps({
        id: "competition-1",
        title: "Spring Open",
        status: "draft",
      }),
    );
    repository.setFindResult(competition);

    await expect(
      useCase.execute({ competitionId: "competition-1" }),
    ).rejects.toThrow(/only be closed from open/i);
  });
});
