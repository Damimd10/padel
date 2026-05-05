import { describe, expect, it } from "vitest";

import type { Competition } from "../domain/competition.js";
import { createTestCommand } from "../test-helpers.js";
import { CreateCompetitionUseCase } from "./create-competition.use-case.js";
import type { CompetitionRepository } from "./ports/competition-repository.js";

class FakeCompetitionRepository implements CompetitionRepository {
  created: unknown[] = [];
  private findResult: Competition | null = null;

  async nextId() {
    return "competition-123";
  }

  async create(competition: {
    toPersistence(): unknown;
  }): Promise<void> {
    this.created.push(competition.toPersistence());
  }

  async save(): Promise<void> {}

  async listOverview() {
    return [];
  }

  async findById(): Promise<Competition | null> {
    return this.findResult;
  }

  async findByIdWithCounts(): Promise<Competition | null> {
    return this.findResult;
  }
}

describe("CreateCompetitionUseCase", () => {
  it("creates and persists a draft competition", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CreateCompetitionUseCase(repository);

    const result = await useCase.execute(
      createTestCommand({
        title: "Autumn Cup",
        format: "round-robin",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-99",
      }),
    );

    expect(result).toMatchObject({
      id: "competition-123",
      title: "Autumn Cup",
      format: "round-robin",
      ownerId: "owner-99",
      status: "draft",
    });
    expect(repository.created).toHaveLength(1);
  });
});
