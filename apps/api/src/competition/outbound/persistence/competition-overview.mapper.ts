import type { CompetitionOverviewItem } from "@padel/schemas";

interface CompetitionOverviewRow {
  id: string;
  title: string;
  format: "elimination" | "round_robin" | "league";
  status: "draft" | "open" | "closed";
  startsAt: Date;
  endsAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export function mapCompetitionOverviewRow(
  row: CompetitionOverviewRow,
): CompetitionOverviewItem {
  return {
    id: row.id,
    title: row.title,
    format: row.format === "round_robin" ? "round-robin" : row.format,
    status: row.status,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    owner: {
      id: row.owner.id,
      name: row.owner.name,
      email: row.owner.email,
    },
  };
}
