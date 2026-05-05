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

export interface CompetitionCourtProps {
  name: string;
  type: string;
}

export interface CompetitionPrizeProps {
  place: string;
  amount: number;
}

export interface CompetitionProps {
  id: string;
  title: string;
  description: string | null;
  format: CompetitionFormat;
  startsAt: string;
  endsAt: string;
  regStartsAt: string | null;
  regEndsAt: string | null;
  maxTeams: number | null;
  pricePerTeam: number;
  isPublic: boolean;
  requiresApproval: boolean;
  hasWaitlist: boolean;
  groupCount: number | null;
  teamsPerGroup: number | null;
  setsToWin: number;
  gamesPerSet: number;
  tiebreakPoints: number;
  goldenPoint: boolean;
  matchDurationMinutes: number;
  firstMatchTime: string | null;
  lastMatchTime: string | null;
  breakBetweenMatchesMinutes: number;
  autoGenerateSchedule: boolean;
  earlyBirdDiscount: number;
  isFreeEntry: boolean;
  ownerId: string;
  status: CompetitionStatus;
  courts: CompetitionCourtProps[];
  prizes: CompetitionPrizeProps[];
  categoryCount?: number;
  divisionCount?: number;
  createdAt?: string;
  updatedAt?: string;
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
      description: input.description?.trim() ?? null,
      format: input.format,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      regStartsAt: input.regStartsAt
        ? new Date(input.regStartsAt).toISOString()
        : null,
      regEndsAt: input.regEndsAt
        ? new Date(input.regEndsAt).toISOString()
        : null,
      maxTeams: input.maxTeams ?? null,
      pricePerTeam: input.pricePerTeam ?? 0,
      isPublic: input.isPublic ?? true,
      requiresApproval: input.requiresApproval ?? false,
      hasWaitlist: input.hasWaitlist ?? true,
      groupCount: input.groupCount ?? null,
      teamsPerGroup: input.teamsPerGroup ?? null,
      setsToWin: input.setsToWin ?? 2,
      gamesPerSet: input.gamesPerSet ?? 6,
      tiebreakPoints: input.tiebreakPoints ?? 7,
      goldenPoint: input.goldenPoint ?? false,
      matchDurationMinutes: input.matchDurationMinutes ?? 60,
      firstMatchTime: input.firstMatchTime ?? null,
      lastMatchTime: input.lastMatchTime ?? null,
      breakBetweenMatchesMinutes: input.breakBetweenMatchesMinutes ?? 15,
      autoGenerateSchedule: input.autoGenerateSchedule ?? true,
      earlyBirdDiscount: input.earlyBirdDiscount ?? 0,
      isFreeEntry: input.isFreeEntry ?? false,
      ownerId,
      status: draftCompetitionStatus,
      courts: input.courts ?? [],
      prizes: input.prizes ?? [],
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

  get courts() {
    return this.props.courts;
  }

  get prizes() {
    return this.props.prizes;
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
      description: this.props.description,
      format: this.props.format,
      startsAt: this.props.startsAt,
      endsAt: this.props.endsAt,
      regStartsAt: this.props.regStartsAt,
      regEndsAt: this.props.regEndsAt,
      maxTeams: this.props.maxTeams,
      pricePerTeam: this.props.pricePerTeam,
      isPublic: this.props.isPublic,
      requiresApproval: this.props.requiresApproval,
      hasWaitlist: this.props.hasWaitlist,
      groupCount: this.props.groupCount,
      teamsPerGroup: this.props.teamsPerGroup,
      setsToWin: this.props.setsToWin,
      gamesPerSet: this.props.gamesPerSet,
      tiebreakPoints: this.props.tiebreakPoints,
      goldenPoint: this.props.goldenPoint,
      matchDurationMinutes: this.props.matchDurationMinutes,
      firstMatchTime: this.props.firstMatchTime,
      lastMatchTime: this.props.lastMatchTime,
      breakBetweenMatchesMinutes: this.props.breakBetweenMatchesMinutes,
      autoGenerateSchedule: this.props.autoGenerateSchedule,
      earlyBirdDiscount: this.props.earlyBirdDiscount,
      isFreeEntry: this.props.isFreeEntry,
      ownerId: this.props.ownerId,
      status: "draft",
      createdAt: this.props.createdAt ?? new Date().toISOString(),
      updatedAt: this.props.updatedAt ?? new Date().toISOString(),
    };
  }
}
