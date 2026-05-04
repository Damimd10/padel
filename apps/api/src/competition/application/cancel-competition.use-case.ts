import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  type CompetitionRepository,
  CompetitionRepositoryToken,
} from "./ports/competition-repository.js";

export interface CancelCompetitionCommand {
  competitionId: string;
}

@Injectable()
export class CancelCompetitionUseCase {
  constructor(
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  async execute(
    command: CancelCompetitionCommand,
  ): Promise<{ status: "cancelled" }> {
    const competition = await this.competitionRepository.findById(
      command.competitionId,
    );

    if (!competition) {
      throw new NotFoundException("Competition not found.");
    }

    try {
      competition.cancel();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    await this.competitionRepository.save(competition);

    return { status: "cancelled" };
  }
}
