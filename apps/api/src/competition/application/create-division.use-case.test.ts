import { describe, expect, it } from "vitest";

import type { CreateDivisionCommand } from "./create-division.use-case.js";
import { CreateDivisionUseCase } from "./create-division.use-case.js";
import { FakeDivisionRepository } from "./ports/fake-division-repository.js";

describe("CreateDivisionUseCase", () => {
  it("creates and persists a division", async () => {
    const repository = new FakeDivisionRepository({ nextId: "division-123" });
    const useCase = new CreateDivisionUseCase(repository);

    const result = await useCase.execute({
      competitionId: "comp-1",
      name: "masculino",
    } satisfies CreateDivisionCommand);

    expect(result).toMatchObject({
      id: "division-123",
      competitionId: "comp-1",
      name: "masculino",
    });
    expect(repository.created).toHaveLength(1);
  });
});
