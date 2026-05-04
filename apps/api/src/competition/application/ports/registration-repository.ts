import type { RegistrationCollection } from "@padel/schemas";
import type { CompetitionRegistration } from "../../domain/competition-registration.js";

export const RegistrationRepositoryToken = Symbol("RegistrationRepository");

export interface RegistrationRepository {
  nextId(): Promise<string>;
  create(registration: CompetitionRegistration): Promise<void>;
  findByCompetitionId(competitionId: string): Promise<RegistrationCollection>;
  findById(id: string): Promise<CompetitionRegistration | null>;
  findByParticipantAndCompetition(
    participantId: string,
    competitionId: string,
  ): Promise<CompetitionRegistration | null>;
}
