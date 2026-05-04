import type { RegistrationCollection } from "@padel/schemas";

import type { CompetitionRegistration } from "../../domain/competition-registration.js";
import type { RegistrationRepository } from "./registration-repository.js";

export interface FakeRegistrationRepositoryOptions {
  nextId?: string;
  registrationsByCompetition?: Record<string, RegistrationCollection>;
  findByIdResult?: CompetitionRegistration | null;
  findByParticipantAndCompetitionResult?: CompetitionRegistration | null;
  createError?: Error;
  updateError?: Error;
}

export class FakeRegistrationRepository implements RegistrationRepository {
  readonly created: unknown[] = [];
  readonly updated: unknown[] = [];
  private store = new Map<string, CompetitionRegistration>();
  private nextIdValue: string;
  private registrationsByCompetition: Record<string, RegistrationCollection>;
  private findByIdResult: CompetitionRegistration | null;
  private findByParticipantAndCompetitionResult: CompetitionRegistration | null;
  private createError?: Error;
  private updateError?: Error;

  constructor(options: FakeRegistrationRepositoryOptions = {}) {
    this.nextIdValue = options.nextId ?? "fake-registration-id";
    this.registrationsByCompetition = options.registrationsByCompetition ?? {};
    this.findByIdResult = options.findByIdResult ?? null;
    this.findByParticipantAndCompetitionResult =
      options.findByParticipantAndCompetitionResult ?? null;
    this.createError = options.createError;
    this.updateError = options.updateError;
  }

  seed(registration: CompetitionRegistration) {
    this.store.set(registration.toResponse().id, registration);
  }

  async nextId() {
    return this.nextIdValue;
  }

  async create(registration: CompetitionRegistration): Promise<void> {
    if (this.createError) throw this.createError;
    this.created.push(registration.toPersistence());
    this.store.set(registration.toResponse().id, registration);
  }

  async findByCompetitionId(
    competitionId: string,
  ): Promise<RegistrationCollection> {
    const stored = this.storeByCompetition(competitionId);
    if (stored.length > 0) return stored;
    return this.registrationsByCompetition[competitionId] ?? [];
  }

  async findById(id: string): Promise<CompetitionRegistration | null> {
    const fromStore = this.store.get(id);
    if (fromStore) return fromStore;
    return this.findByIdResult;
  }

  async findByParticipantAndCompetition(
    participantId: string,
    competitionId: string,
  ): Promise<CompetitionRegistration | null> {
    for (const registration of this.store.values()) {
      const response = registration.toResponse();
      if (
        response.participantId === participantId &&
        response.competitionId === competitionId
      ) {
        return registration;
      }
    }
    return this.findByParticipantAndCompetitionResult;
  }

  async update(registration: CompetitionRegistration): Promise<void> {
    if (this.updateError) throw this.updateError;
    this.updated.push(registration.toPersistence());
    this.store.set(registration.toResponse().id, registration);
  }

  private storeByCompetition(competitionId: string): RegistrationCollection {
    const registrations: RegistrationCollection = [];
    for (const registration of this.store.values()) {
      if (registration.toResponse().competitionId === competitionId) {
        registrations.push(registration.toResponse());
      }
    }
    return registrations;
  }
}
