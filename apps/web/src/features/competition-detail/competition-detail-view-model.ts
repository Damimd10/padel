import type { CategoryCollection, CategoryResponse } from "@padel/schemas";
import type { TableRowState } from "@padel/ui";

export interface CategoryRowViewModel {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  rowState: TableRowState;
}

export interface CompetitionDetailPageViewModel {
  competitionId: string;
  categories: CategoryRowViewModel[];
  hasCategories: boolean;
}

export function mapCategoriesToRowViewModel(
  categories: CategoryCollection,
): CategoryRowViewModel[] {
  return categories.map((category: CategoryResponse) => ({
    id: category.id,
    label: category.label,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    rowState: "default",
  }));
}

export function mapToCompetitionDetailPageModel(
  competitionId: string,
  categories: CategoryCollection,
): CompetitionDetailPageViewModel {
  return {
    competitionId,
    categories: mapCategoriesToRowViewModel(categories),
    hasCategories: categories.length > 0,
  };
}
