import type { CreateCompetitionResponse } from "@padel/schemas";
import type { CreateCompetitionCommand } from "../application/create-competition.command.js";
import {
  type CompetitionFormat,
  assertCompetitionFormat,
} from "./competition-format.js";
import {
  type CompetitionStatus,
  cancelledCompetitionStatus,
  closedCompetitionStatus,
  draftCompetitionStatus,
  openCompetitionStatus,
} from "./competition-status.js";

export interface CompetitionProps {
  id: string;
  title: string;
  format: CompetitionFormat;
  startsAt: string;
  endsAt: string;
  ownerId: string;
  status: CompetitionStatus;
  categoryCount?: number;
  divisionCount?: number;
}

export class Competition {
  private constructor(private readonly props: CompetitionProps) {}

  static createDraft(input: CreateCompetitionCommand, id: string) {
    const title = input.title.trim();
    const ownerId = input.ownerId.trim();

    if (title.length === 0) {
      throw new Error("Competition title is required.");
    }

    if (ownerId.length === 0) {
      throw new Error("Competition owner is required.");
    }

    assertCompetitionFormat(input.format);

    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new Error("Competition dates must be valid ISO datetimes.");
    }

    if (startsAt.getTime() > endsAt.getTime()) {
      throw new Error(
        "Competition end date must not be earlier than start date.",
      );
    }

    return new Competition({
      id,
      title,
      format: input.format,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      ownerId,
      status: draftCompetitionStatus,
    });
  }

  static restore(props: CompetitionProps) {
    return new Competition(props);
  }

  get id() {
    return this.props.id;
  }

  get status() {
    return this.props.status;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get categoryCount() {
    return this.props.categoryCount ?? 0;
  }

  get divisionCount() {
    return this.props.divisionCount ?? 0;
  }

  open() {
    if (this.props.status !== draftCompetitionStatus) {
      throw new Error(
        `Competition can only be opened from draft status. Current status: ${this.props.status}`,
      );
    }

    if (
      this.props.categoryCount !== undefined &&
      this.props.categoryCount === 0
    ) {
      throw new Error(
        "Competition must have at least one category before it can be opened.",
      );
    }

    if (
      this.props.divisionCount !== undefined &&
      this.props.divisionCount === 0
    ) {
      throw new Error(
        "Competition must have at least one division before it can be opened.",
      );
    }

    this.props.status = openCompetitionStatus;
  }

  close() {
    if (this.props.status !== openCompetitionStatus) {
      throw new Error(
        `Competition can only be closed from open status. Current status: ${this.props.status}`,
      );
    }

    this.props.status = closedCompetitionStatus;
  }

  cancel() {
    if (this.props.status === cancelledCompetitionStatus) {
      throw new Error("Competition is already cancelled.");
    }

    this.props.status = cancelledCompetitionStatus;
  }

  toPersistence(): CompetitionProps {
    return { ...this.props };
  }

  toResponse(): CreateCompetitionResponse {
    return {
      id: this.props.id,
      title: this.props.title,
      format: this.props.format,
      startsAt: this.props.startsAt,
      endsAt: this.props.endsAt,
      ownerId: this.props.ownerId,
      status: "draft",
    };
  }
}
