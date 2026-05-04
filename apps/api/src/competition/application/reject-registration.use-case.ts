import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { RegistrationResponse } from "@padel/schemas";

import {
  type RegistrationRepository,
  RegistrationRepositoryToken,
} from "../application/ports/registration-repository.js";

@Injectable()
export class RejectRegistrationUseCase {
  constructor(
    @Inject(RegistrationRepositoryToken)
    private readonly registrationRepository: RegistrationRepository,
  ) {}

  async execute(registrationId: string): Promise<RegistrationResponse> {
    const existing = await this.registrationRepository.findById(registrationId);

    if (!existing) {
      throw new NotFoundException("Registration not found.");
    }

    const rejected = existing.reject();

    await this.registrationRepository.update(rejected);

    return rejected.toResponse();
  }
}
