import type {
  CategoryCollection,
  CategoryResponse,
  DivisionCollection,
  DivisionResponse,
  RegistrationCollection,
  RegistrationResponse,
} from "@padel/schemas";
import type { TableRowState } from "@padel/ui";

export interface CategoryRowViewModel {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  rowState: TableRowState;
}

export interface DivisionRowViewModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  rowState: TableRowState;
}

export interface RegistrationRowViewModel {
  id: string;
  participantId: string;
  categoryId: string;
  divisionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  rowState: TableRowState;
}

export interface CompetitionDetailPageViewModel {
  competitionId: string;
  status: string;
  categories: CategoryRowViewModel[];
  hasCategories: boolean;
  divisions: DivisionRowViewModel[];
  hasDivisions: boolean;
  registrations: RegistrationRowViewModel[];
  hasRegistrations: boolean;
  pendingRegistrations: RegistrationRowViewModel[];
  hasPendingRegistrations: boolean;
  canOpen: boolean;
  canClose: boolean;
  canCancel: boolean;
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

const DIVISION_LABELS: Record<string, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  mixto: "Mixto",
};

export function mapDivisionsToRowViewModel(
  divisions: DivisionCollection,
): DivisionRowViewModel[] {
  return divisions.map((division: DivisionResponse) => ({
    id: division.id,
    name: DIVISION_LABELS[division.name] ?? division.name,
    createdAt: division.createdAt,
    updatedAt: division.updatedAt,
    rowState: "default",
  }));
}

export function mapRegistrationsToRowViewModel(
  registrations: RegistrationCollection,
): RegistrationRowViewModel[] {
  return registrations.map((registration: RegistrationResponse) => ({
    id: registration.id,
    participantId: registration.participantId,
    categoryId: registration.categoryId,
    divisionId: registration.divisionId,
    status: registration.status,
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt,
    rowState: "default",
  }));
}

export function mapToCompetitionDetailPageModel(
  competitionId: string,
  status: string,
  categories: CategoryCollection,
  divisions: DivisionCollection,
  registrations: RegistrationCollection,
): CompetitionDetailPageViewModel {
  const registrationRows = mapRegistrationsToRowViewModel(registrations);
  const pendingRegistrations = registrationRows.filter(
    (r) => r.status === "pending_review",
  );

  return {
    competitionId,
    status,
    categories: mapCategoriesToRowViewModel(categories),
    hasCategories: categories.length > 0,
    divisions: mapDivisionsToRowViewModel(divisions),
    hasDivisions: divisions.length > 0,
    registrations: registrationRows,
    hasRegistrations: registrations.length > 0,
    pendingRegistrations,
    hasPendingRegistrations: pendingRegistrations.length > 0,
    canOpen: status === "draft",
    canClose: status === "open",
    canCancel: status !== "cancelled" && status !== "completed",
  };
}
