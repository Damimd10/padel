import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { RegistrationResponse } from "@padel/schemas";

import {
  type RegistrationRepository,
  RegistrationRepositoryToken,
} from "../application/ports/registration-repository.js";

export interface ApproveRegistrationCommand {
  registrationId: string;
  categoryId?: string;
  divisionId?: string;
}

@Injectable()
export class ApproveRegistrationUseCase {
  constructor(
    @Inject(RegistrationRepositoryToken)
    private readonly registrationRepository: RegistrationRepository,
  ) {}

  async execute(
    input: ApproveRegistrationCommand,
  ): Promise<RegistrationResponse> {
    const existing = await this.registrationRepository.findById(
      input.registrationId,
    );

    if (!existing) {
      throw new NotFoundException("Registration not found.");
    }

    const approved = existing.approve({
      categoryId: input.categoryId,
      divisionId: input.divisionId,
    });

    await this.registrationRepository.update(approved);

    return approved.toResponse();
  }
}
