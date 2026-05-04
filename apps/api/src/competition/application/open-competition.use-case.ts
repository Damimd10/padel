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

export interface OpenCompetitionCommand {
  competitionId: string;
}

@Injectable()
export class OpenCompetitionUseCase {
  constructor(
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  async execute(command: OpenCompetitionCommand): Promise<{ status: "open" }> {
    const competition = await this.competitionRepository.findByIdWithCounts(
      command.competitionId,
    );

    if (!competition) {
      throw new NotFoundException("Competition not found.");
    }

    try {
      competition.open();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    await this.competitionRepository.save(competition);

    return { status: "open" };
  }
}
