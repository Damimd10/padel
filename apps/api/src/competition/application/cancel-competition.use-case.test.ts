import { describe, expect, it } from "vitest";

import { Competition } from "../domain/competition.js";
import { CancelCompetitionUseCase } from "./cancel-competition.use-case.js";
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

describe("CancelCompetitionUseCase", () => {
  it("cancels a draft competition", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CancelCompetitionUseCase(repository);
    const competition = Competition.restore({
      id: "competition-1",
      title: "Spring Open",
      format: "elimination",
      startsAt: "2026-05-10T10:00:00.000Z",
      endsAt: "2026-05-12T18:00:00.000Z",
      ownerId: "owner-1",
      status: "draft",
    });
    repository.setFindResult(competition);

    const result = await useCase.execute({ competitionId: "competition-1" });

    expect(result).toEqual({ status: "cancelled" });
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0].toPersistence()).toMatchObject({
      status: "cancelled",
    });
  });

  it("cancels an open competition", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CancelCompetitionUseCase(repository);
    const competition = Competition.restore({
      id: "competition-1",
      title: "Spring Open",
      format: "elimination",
      startsAt: "2026-05-10T10:00:00.000Z",
      endsAt: "2026-05-12T18:00:00.000Z",
      ownerId: "owner-1",
      status: "open",
    });
    repository.setFindResult(competition);

    const result = await useCase.execute({ competitionId: "competition-1" });

    expect(result).toEqual({ status: "cancelled" });
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0].toPersistence()).toMatchObject({
      status: "cancelled",
    });
  });

  it("throws when competition is not found", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CancelCompetitionUseCase(repository);
    repository.setFindResult(null);

    await expect(useCase.execute({ competitionId: "missing" })).rejects.toThrow(
      "Competition not found.",
    );
  });

  it("throws when competition is already cancelled", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CancelCompetitionUseCase(repository);
    const competition = Competition.restore({
      id: "competition-1",
      title: "Spring Open",
      format: "elimination",
      startsAt: "2026-05-10T10:00:00.000Z",
      endsAt: "2026-05-12T18:00:00.000Z",
      ownerId: "owner-1",
      status: "cancelled",
    });
    repository.setFindResult(competition);

    await expect(
      useCase.execute({ competitionId: "competition-1" }),
    ).rejects.toThrow(/already cancelled/i);
  });
});
