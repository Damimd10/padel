import type { RegistrationStatus } from "./registration-status.js";
import { assertRegistrationStatus } from "./registration-status.js";

export interface RegistrationProps {
  id: string;
  competitionId: string;
  participantId: string;
  categoryId: string;
  divisionId: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegistrationCommand {
  competitionId: string;
  participantId: string;
  categoryId: string;
  divisionId: string;
}

export class CompetitionRegistration {
  private constructor(private readonly props: RegistrationProps) {}

  static create(input: CreateRegistrationCommand, id: string, now: string) {
    if (input.competitionId.trim().length === 0) {
      throw new Error("Competition ID is required.");
    }

    if (input.participantId.trim().length === 0) {
      throw new Error("Participant ID is required.");
    }

    if (input.categoryId.trim().length === 0) {
      throw new Error("Category ID is required.");
    }

    if (input.divisionId.trim().length === 0) {
      throw new Error("Division ID is required.");
    }

    return new CompetitionRegistration({
      id,
      competitionId: input.competitionId,
      participantId: input.participantId,
      categoryId: input.categoryId,
      divisionId: input.divisionId,
      status: "registered",
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RegistrationProps) {
    assertRegistrationStatus(props.status);

    return new CompetitionRegistration(props);
  }

  toPersistence() {
    return { ...this.props };
  }

  toResponse() {
    return { ...this.props };
  }
}
