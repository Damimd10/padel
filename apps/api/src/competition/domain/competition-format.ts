const competitionFormats = ["elimination", "round-robin", "league"] as const;

export type CompetitionFormat = (typeof competitionFormats)[number];

export function assertCompetitionFormat(
  format: string,
): asserts format is CompetitionFormat {
  if (!competitionFormats.includes(format as CompetitionFormat)) {
    throw new Error(`Unsupported competition format: ${format}`);
  }
}
