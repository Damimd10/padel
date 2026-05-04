export interface DivisionProps {
  id: string;
  competitionId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDivisionCommand {
  competitionId: string;
  name: string;
}

export interface UpdateDivisionCommand {
  name: string;
}

export class Division {
  private constructor(private readonly props: DivisionProps) {}

  static create(input: CreateDivisionCommand, id: string, now: string) {
    const name = input.name.trim();

    if (name.length === 0) {
      throw new Error("Division name is required.");
    }

    if (input.competitionId.trim().length === 0) {
      throw new Error("Competition ID is required.");
    }

    return new Division({
      id,
      competitionId: input.competitionId,
      name,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: DivisionProps) {
    return new Division(props);
  }

  update(input: UpdateDivisionCommand, now: string) {
    const name = input.name.trim();

    if (name.length === 0) {
      throw new Error("Division name is required.");
    }

    return new Division({
      ...this.props,
      name,
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
