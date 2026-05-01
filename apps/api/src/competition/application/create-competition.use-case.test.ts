import { describe, expect, it } from "vitest";

import type { CreateCompetitionCommand } from "./create-competition.command.js";
import { CreateCompetitionUseCase } from "./create-competition.use-case.js";
import type { CompetitionRepository } from "./ports/competition-repository.js";

class FakeCompetitionRepository implements CompetitionRepository {
  created: unknown[] = [];

  async nextId() {
    return "competition-123";
  }

  async create(competition: {
    toPersistence(): unknown;
  }): Promise<void> {
    this.created.push(competition.toPersistence());
  }

  async listOverview() {
    return [];
  }
}

describe("CreateCompetitionUseCase", () => {
  it("creates and persists a draft competition", async () => {
    const repository = new FakeCompetitionRepository();
    const useCase = new CreateCompetitionUseCase(repository);

    const result = await useCase.execute({
      title: "Autumn Cup",
      format: "round-robin",
      startsAt: "2026-05-10T10:00:00.000Z",
      endsAt: "2026-05-12T18:00:00.000Z",
      ownerId: "owner-99",
    } satisfies CreateCompetitionCommand);

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
