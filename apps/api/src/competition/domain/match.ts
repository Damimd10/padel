import type { MatchResponse } from "@padel/schemas";
import {
  type MatchStatus,
  cancelledMatchStatus,
  completedMatchStatus,
  inProgressMatchStatus,
  scheduledMatchStatus,
} from "./match-status.js";

export interface MatchProps {
  id: string;
  competitionId: string;
  registrationAId: string;
  registrationBId: string;
  status: MatchStatus;
  scheduledAt?: string;
  scoreA?: number;
  scoreB?: number;
}

export class Match {
  private constructor(private readonly props: MatchProps) {}

  static create(
    competitionId: string,
    registrationAId: string,
    registrationBId: string,
    id: string,
  ) {
    if (competitionId.trim().length === 0) {
      throw new Error("Competition ID is required.");
    }

    if (registrationAId.trim().length === 0) {
      throw new Error("Registration A ID is required.");
    }

    if (registrationBId.trim().length === 0) {
      throw new Error("Registration B ID is required.");
    }

    if (registrationAId === registrationBId) {
      throw new Error("Registration A and Registration B must be different.");
    }

    return new Match({
      id,
      competitionId,
      registrationAId,
      registrationBId,
      status: scheduledMatchStatus,
    });
  }

  static restore(props: MatchProps) {
    return new Match(props);
  }

  get id() {
    return this.props.id;
  }

  get competitionId() {
    return this.props.competitionId;
  }

  get registrationAId() {
    return this.props.registrationAId;
  }

  get registrationBId() {
    return this.props.registrationBId;
  }

  get status() {
    return this.props.status;
  }

  get scheduledAt() {
    return this.props.scheduledAt;
  }

  get scoreA() {
    return this.props.scoreA;
  }

  get scoreB() {
    return this.props.scoreB;
  }

  schedule(scheduledAt: string) {
    if (this.props.status !== scheduledMatchStatus) {
      throw new Error(
        `Match can only be scheduled from scheduled status. Current status: ${this.props.status}`,
      );
    }

    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Scheduled date must be a valid ISO datetime.");
    }

    this.props.scheduledAt = scheduledAt;
  }

  start() {
    if (this.props.status !== scheduledMatchStatus) {
      throw new Error(
        `Match can only be started from scheduled status. Current status: ${this.props.status}`,
      );
    }

    this.props.status = inProgressMatchStatus;
  }

  complete(scoreA: number, scoreB: number) {
    if (this.props.status !== inProgressMatchStatus) {
      throw new Error(
        `Match can only be completed from in_progress status. Current status: ${this.props.status}`,
      );
    }

    if (!Number.isInteger(scoreA) || scoreA < 0) {
      throw new Error("Score A must be a non-negative integer.");
    }

    if (!Number.isInteger(scoreB) || scoreB < 0) {
      throw new Error("Score B must be a non-negative integer.");
    }

    this.props.scoreA = scoreA;
    this.props.scoreB = scoreB;
    this.props.status = completedMatchStatus;
  }

  cancel() {
    if (this.props.status === completedMatchStatus) {
      throw new Error("Completed match cannot be cancelled.");
    }

    if (this.props.status === cancelledMatchStatus) {
      throw new Error("Match is already cancelled.");
    }

    this.props.status = cancelledMatchStatus;
  }

  toPersistence(): MatchProps {
    return { ...this.props };
  }

  toResponse(): MatchResponse {
    return {
      id: this.props.id,
      competitionId: this.props.competitionId,
      registrationAId: this.props.registrationAId,
      registrationBId: this.props.registrationBId,
      status: this.props.status,
      scheduledAt: this.props.scheduledAt ?? null,
      scoreA: this.props.scoreA ?? null,
      scoreB: this.props.scoreB ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
