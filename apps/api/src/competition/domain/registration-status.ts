export const registrationStatuses = [
  "registered",
  "pending_review",
  "approved",
  "rejected",
  "withdrawn",
] as const;

export type RegistrationStatus = (typeof registrationStatuses)[number];

export function assertRegistrationStatus(
  value: string,
): asserts value is RegistrationStatus {
  if (!registrationStatuses.includes(value as RegistrationStatus)) {
    throw new Error(`Invalid registration status: ${value}`);
  }
}
