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

export interface ReviewRegistrationCommand {
  categoryId?: string;
  divisionId?: string;
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
      status: "pending_review",
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: RegistrationProps) {
    assertRegistrationStatus(props.status);

    return new CompetitionRegistration(props);
  }

  approve(command?: ReviewRegistrationCommand) {
    if (this.props.status !== "pending_review") {
      throw new Error(
        "Only registrations in pending_review status can be approved.",
      );
    }

    const now = new Date().toISOString();

    return new CompetitionRegistration({
      ...this.props,
      categoryId: command?.categoryId ?? this.props.categoryId,
      divisionId: command?.divisionId ?? this.props.divisionId,
      status: "approved",
      updatedAt: now,
    });
  }

  reject() {
    if (this.props.status !== "pending_review") {
      throw new Error(
        "Only registrations in pending_review status can be rejected.",
      );
    }

    const now = new Date().toISOString();

    return new CompetitionRegistration({
      ...this.props,
      status: "rejected",
      updatedAt: now,
    });
  }

  withdraw() {
    if (
      this.props.status !== "pending_review" &&
      this.props.status !== "registered"
    ) {
      throw new Error(
        "Only registrations in pending_review or registered status can be withdrawn.",
      );
    }

    const now = new Date().toISOString();

    return new CompetitionRegistration({
      ...this.props,
      status: "withdrawn",
      updatedAt: now,
    });
  }

  toPersistence() {
    return { ...this.props };
  }

  toResponse() {
    return { ...this.props };
  }
}
