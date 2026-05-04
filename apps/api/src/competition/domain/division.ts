export type DivisionName = "masculino" | "femenino" | "mixto";

export interface DivisionProps {
  id: string;
  competitionId: string;
  name: DivisionName;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDivisionCommand {
  competitionId: string;
  name: DivisionName;
}

export interface UpdateDivisionCommand {
  name: DivisionName;
}

const VALID_DIVISION_NAMES: DivisionName[] = ["masculino", "femenino", "mixto"];

export class Division {
  private constructor(private readonly props: DivisionProps) {}

  static create(input: CreateDivisionCommand, id: string, now: string) {
    if (!VALID_DIVISION_NAMES.includes(input.name)) {
      throw new Error(
        `Invalid division name. Must be one of: ${VALID_DIVISION_NAMES.join(", ")}.`,
      );
    }

    if (input.competitionId.trim().length === 0) {
      throw new Error("Competition ID is required.");
    }

    return new Division({
      id,
      competitionId: input.competitionId,
      name: input.name,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: DivisionProps) {
    return new Division(props);
  }

  update(input: UpdateDivisionCommand, now: string) {
    if (!VALID_DIVISION_NAMES.includes(input.name)) {
      throw new Error(
        `Invalid division name. Must be one of: ${VALID_DIVISION_NAMES.join(", ")}.`,
      );
    }

    return new Division({
      ...this.props,
      name: input.name,
      updatedAt: now,
    });
  }

  toPersistence() {
    return { ...this.props };
  }

  toResponse() {
    return { ...this.props };
  }
}
