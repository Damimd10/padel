import type { AuthUser } from "@padel/schemas";

export interface AdminPageViewModel {
  userName: string;
  userEmail: string;
  userInitials: string;
}

export function mapToAdminPageViewModel(
  user: AuthUser | null,
): AdminPageViewModel {
  const name = user?.name ?? "User";
  const email = user?.email ?? "user@example.com";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    userName: name,
    userEmail: email,
    userInitials: initials,
  };
}
