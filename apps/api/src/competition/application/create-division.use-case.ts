import { Inject, Injectable } from "@nestjs/common";
import type { DivisionResponse } from "@padel/schemas";

import { Division, type DivisionName } from "../domain/division.js";
import {
  type DivisionRepository,
  DivisionRepositoryToken,
} from "./ports/division-repository.js";

export interface CreateDivisionCommand {
  competitionId: string;
  name: DivisionName;
}

@Injectable()
export class CreateDivisionUseCase {
  constructor(
    @Inject(DivisionRepositoryToken)
    private readonly divisionRepository: DivisionRepository,
  ) {}

  async execute(input: CreateDivisionCommand): Promise<DivisionResponse> {
    const id = await this.divisionRepository.nextId();
    const now = new Date().toISOString();
    const division = Division.create(input, id, now);

    await this.divisionRepository.create(division);

    return division.toResponse();
  }
}
