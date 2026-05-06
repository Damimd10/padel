import type { DivisionName as DivisionNameType } from "@padel/schemas";

export type DivisionName = DivisionNameType;

const validDivisionNames: DivisionNameType[] = [
  "masculino",
  "femenino",
  "mixto",
];

export function assertDivisionName(
  value: string,
): asserts value is DivisionNameType {
  if (!validDivisionNames.includes(value as DivisionNameType)) {
    throw new Error(
      `Invalid division name: ${value}. Must be one of: ${validDivisionNames.join(", ")}`,
    );
  }
}
