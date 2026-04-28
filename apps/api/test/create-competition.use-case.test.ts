import { describe, expect, it } from "vitest";

import { CreateCompetitionUseCase } from "../src/competition/application/create-competition.use-case.js";
import type { CompetitionRepository } from "../src/competition/application/ports/competition-repository.js";

class FakeCompetitionRepository implements CompetitionRepository {
  created: ReturnType<
    InstanceType<typeof CreateCompetitionUseCase>["execute"]
  > extends Promise<infer _>
    ? unknown[]
    : never = [];

  async nextId() {
    return "competition-123";
  }

  async create(competition: {
    toPersistence(): unknown;
  }): Promise<void> {
    this.created.push(competition.toPersistence());
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
    });

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
