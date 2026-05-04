import { describe, expect, it } from "vitest";

import { ListDivisionsUseCase } from "./list-divisions.use-case.js";
import { FakeDivisionRepository } from "./ports/fake-division-repository.js";

describe("ListDivisionsUseCase", () => {
  it("returns divisions for a competition", async () => {
    const repository = new FakeDivisionRepository({
      divisionsByCompetition: {
        "comp-1": [
          {
            id: "div-1",
            competitionId: "comp-1",
            name: "Masculino",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });
    const useCase = new ListDivisionsUseCase(repository);

    const result = await useCase.execute("comp-1");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "div-1",
      name: "Masculino",
    });
  });

  it("returns empty array when no divisions exist", async () => {
    const repository = new FakeDivisionRepository();
    const useCase = new ListDivisionsUseCase(repository);

    const result = await useCase.execute("comp-1");

    expect(result).toEqual([]);
  });
});
