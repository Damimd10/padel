import { describe, expect, it } from "vitest";

import { Division } from "../domain/division.js";
import { FakeDivisionRepository } from "./ports/fake-division-repository.js";
import type { UpdateDivisionCommand } from "./update-division.use-case.js";
import { UpdateDivisionUseCase } from "./update-division.use-case.js";

describe("UpdateDivisionUseCase", () => {
  it("updates an existing division", async () => {
    const repository = new FakeDivisionRepository();
    const division = Division.create(
      { competitionId: "comp-1", name: "Masculino" },
      "div-1",
      new Date().toISOString(),
    );
    repository.seed(division);

    const useCase = new UpdateDivisionUseCase(repository);

    const result = await useCase.execute({
      divisionId: "div-1",
      name: "Femenino",
    } satisfies UpdateDivisionCommand);

    expect(result).toMatchObject({
      id: "div-1",
      name: "Femenino",
    });
    expect(repository.updated).toHaveLength(1);
  });

  it("throws NotFoundException when division does not exist", async () => {
    const repository = new FakeDivisionRepository();
    const useCase = new UpdateDivisionUseCase(repository);

    await expect(
      useCase.execute({
        divisionId: "non-existent",
        name: "Femenino",
      } satisfies UpdateDivisionCommand),
    ).rejects.toThrow("Division not found.");
  });
});
