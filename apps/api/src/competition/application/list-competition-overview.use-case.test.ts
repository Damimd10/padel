import { describe, expect, it } from "vitest";

import { ListCompetitionOverviewUseCase } from "./list-competition-overview.use-case.js";
import type { CompetitionRepository } from "./ports/competition-repository.js";

describe("ListCompetitionOverviewUseCase", () => {
  it("returns the overview collection from the repository boundary", async () => {
    const expected = [
      {
        id: "11111111-1111-4111-8111-111111111111",
        title: "Operations Open",
        format: "league" as const,
        status: "open" as const,
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        owner: {
          id: "owner-1",
          name: "Ops User",
          email: "ops@example.com",
        },
      },
    ] as const;

    const repository: CompetitionRepository = {
      nextId: async () => crypto.randomUUID(),
      create: async () => undefined,
      listOverview: async () => expected,
    };

    const useCase = new ListCompetitionOverviewUseCase(repository);

    await expect(useCase.execute()).resolves.toEqual(expected);
  });
});
