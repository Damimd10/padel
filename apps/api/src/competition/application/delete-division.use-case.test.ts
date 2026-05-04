import { describe, expect, it } from "vitest";

import { Division } from "../domain/division.js";
import type { DeleteDivisionCommand } from "./delete-division.use-case.js";
import { DeleteDivisionUseCase } from "./delete-division.use-case.js";
import { FakeDivisionRepository } from "./ports/fake-division-repository.js";

describe("DeleteDivisionUseCase", () => {
  it("deletes an existing division", async () => {
    const repository = new FakeDivisionRepository();
    const division = Division.create(
      { competitionId: "comp-1", name: "Masculino" },
      "div-1",
      new Date().toISOString(),
    );
    repository.seed(division);

    const useCase = new DeleteDivisionUseCase(repository);

    await useCase.execute({
      divisionId: "div-1",
    } satisfies DeleteDivisionCommand);

    expect(repository.deleted).toEqual(["div-1"]);
  });

  it("throws NotFoundException when division does not exist", async () => {
    const repository = new FakeDivisionRepository();
    const useCase = new DeleteDivisionUseCase(repository);

    await expect(
      useCase.execute({
        divisionId: "non-existent",
      } satisfies DeleteDivisionCommand),
    ).rejects.toThrow("Division not found.");
  });
});
