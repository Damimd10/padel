export interface CategoryProps {
  id: string;
  competitionId: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryCommand {
  competitionId: string;
  label: string;
}

export interface UpdateCategoryCommand {
  label: string;
}

export class Category {
  private constructor(private readonly props: CategoryProps) {}

  static create(input: CreateCategoryCommand, id: string, now: string) {
    const label = input.label.trim();

    if (label.length === 0) {
      throw new Error("Category label is required.");
    }

    if (input.competitionId.trim().length === 0) {
      throw new Error("Competition ID is required.");
    }

    return new Category({
      id,
      competitionId: input.competitionId,
      label,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: CategoryProps) {
    return new Category(props);
  }

  update(input: UpdateCategoryCommand, now: string) {
    const label = input.label.trim();

    if (label.length === 0) {
      throw new Error("Category label is required.");
    }

    return new Category({
      ...this.props,
      label,
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
