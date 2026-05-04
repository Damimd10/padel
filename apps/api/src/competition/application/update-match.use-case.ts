import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { MatchRepository } from "./ports/match-repository.js";
import { MatchRepositoryToken } from "./ports/match-repository.js";

export interface ScheduleMatchCommand {
  matchId: string;
  scheduledAt: string;
}

export interface StartMatchCommand {
  matchId: string;
}

export interface CompleteMatchCommand {
  matchId: string;
  scoreA: number;
  scoreB: number;
}

export interface CancelMatchCommand {
  matchId: string;
}

@Injectable()
export class UpdateMatchUseCase {
  constructor(
    @Inject(MatchRepositoryToken)
    private readonly matchRepository: MatchRepository,
  ) {}

  async schedule(
    command: ScheduleMatchCommand,
  ): Promise<{ status: "scheduled" }> {
    const match = await this.matchRepository.findById(command.matchId);

    if (!match) {
      throw new NotFoundException("Match not found.");
    }

    match.schedule(command.scheduledAt);

    await this.matchRepository.save(match);

    return { status: "scheduled" };
  }

  async start(command: StartMatchCommand): Promise<{ status: "in_progress" }> {
    const match = await this.matchRepository.findById(command.matchId);

    if (!match) {
      throw new NotFoundException("Match not found.");
    }

    match.start();

    await this.matchRepository.save(match);

    return { status: "in_progress" };
  }

  async complete(
    command: CompleteMatchCommand,
  ): Promise<{ status: "completed" }> {
    const match = await this.matchRepository.findById(command.matchId);

    if (!match) {
      throw new NotFoundException("Match not found.");
    }

    match.complete(command.scoreA, command.scoreB);

    await this.matchRepository.save(match);

    return { status: "completed" };
  }

  async cancel(command: CancelMatchCommand): Promise<{ status: "cancelled" }> {
    const match = await this.matchRepository.findById(command.matchId);

    if (!match) {
      throw new NotFoundException("Match not found.");
    }

    match.cancel();

    await this.matchRepository.save(match);

    return { status: "cancelled" };
  }
}
