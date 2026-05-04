import { Inject, Injectable } from "@nestjs/common";
import { registrationCollectionSchema } from "@padel/schemas";

import { PrismaService } from "../../../prisma/prisma.service.js";
import type { RegistrationRepository } from "../../application/ports/registration-repository.js";
import { CompetitionRegistration } from "../../domain/competition-registration.js";

@Injectable()
export class PrismaRegistrationRepository implements RegistrationRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async nextId() {
    return crypto.randomUUID();
  }

  async create(registration: CompetitionRegistration) {
    const row = registration.toPersistence();

    await this.prisma.registration.create({
      data: {
        id: row.id,
        competitionId: row.competitionId,
        participantId: row.participantId,
        categoryId: row.categoryId,
        divisionId: row.divisionId,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    });
  }

  async findByCompetitionId(competitionId: string) {
    const registrations = await this.prisma.registration.findMany({
      where: { competitionId },
      orderBy: [{ createdAt: "asc" }],
    });

    return registrationCollectionSchema.parse(
      registrations.map((row) => ({
        id: row.id,
        competitionId: row.competitionId,
        participantId: row.participantId,
        categoryId: row.categoryId,
        divisionId: row.divisionId,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    );
  }

  async findById(id: string) {
    const row = await this.prisma.registration.findUnique({
      where: { id },
    });

    if (!row) {
      return null;
    }

    return CompetitionRegistration.restore({
      id: row.id,
      competitionId: row.competitionId,
      participantId: row.participantId,
      categoryId: row.categoryId,
      divisionId: row.divisionId,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  async findByParticipantAndCompetition(
    participantId: string,
    competitionId: string,
  ) {
    const row = await this.prisma.registration.findFirst({
      where: {
        participantId,
        competitionId,
      },
    });

    if (!row) {
      return null;
    }

    return CompetitionRegistration.restore({
      id: row.id,
      competitionId: row.competitionId,
      participantId: row.participantId,
      categoryId: row.categoryId,
      divisionId: row.divisionId,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }
}
