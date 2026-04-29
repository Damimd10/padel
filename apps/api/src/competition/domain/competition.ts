import type { CreateCompetitionCommand } from "../application/create-competition.command.js";
import {
  type CompetitionFormat,
  assertCompetitionFormat,
} from "./competition-format.js";
import { draftCompetitionStatus } from "./competition-status.js";

export interface CompetitionProps {
  id: string;
  title: string;
  format: CompetitionFormat;
  startsAt: string;
  endsAt: string;
  ownerId: string;
  status: typeof draftCompetitionStatus;
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

  toPersistence() {
    return { ...this.props };
  }

  toResponse() {
    return { ...this.props };
  }
}
