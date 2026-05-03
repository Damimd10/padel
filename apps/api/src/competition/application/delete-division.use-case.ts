import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import {
  type DivisionRepository,
  DivisionRepositoryToken,
} from "./ports/division-repository.js";

export interface DeleteDivisionCommand {
  divisionId: string;
}

@Injectable()
export class DeleteDivisionUseCase {
  constructor(
    @Inject(DivisionRepositoryToken)
    private readonly divisionRepository: DivisionRepository,
  ) {}

  async execute(input: DeleteDivisionCommand): Promise<void> {
    const existing = await this.divisionRepository.findById(input.divisionId);

    if (!existing) {
      throw new NotFoundException("Division not found.");
    }

    await this.divisionRepository.delete(input.divisionId);
  }
}
