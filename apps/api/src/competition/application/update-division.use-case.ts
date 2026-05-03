import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { DivisionResponse } from "@padel/schemas";

import {
  type DivisionRepository,
  DivisionRepositoryToken,
} from "./ports/division-repository.js";

export interface UpdateDivisionCommand {
  divisionId: string;
  name: string;
}

@Injectable()
export class UpdateDivisionUseCase {
  constructor(
    @Inject(DivisionRepositoryToken)
    private readonly divisionRepository: DivisionRepository,
  ) {}

  async execute(input: UpdateDivisionCommand): Promise<DivisionResponse> {
    const existing = await this.divisionRepository.findById(input.divisionId);

    if (!existing) {
      throw new NotFoundException("Division not found.");
    }

    const now = new Date().toISOString();
    const updated = existing.update({ name: input.name }, now);

    await this.divisionRepository.update(updated);

    return updated.toResponse();
  }
}
