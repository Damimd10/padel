import type { CreateCompetitionCommand } from "./application/create-competition.command.js";
import type { CompetitionProps } from "./domain/competition.js";

export function createTestCommand(
  overrides: Partial<CreateCompetitionCommand> = {},
): CreateCompetitionCommand {
  return {
    title: "Test Competition",
    format: "elimination",
    startsAt: "2024-01-01T00:00:00.000Z",
    endsAt: "2024-01-15T00:00:00.000Z",
    pricePerTeam: 0,
    isPublic: true,
    requiresApproval: false,
    hasWaitlist: true,
    setsToWin: 2,
    gamesPerSet: 6,
    tiebreakPoints: 7,
    goldenPoint: false,
    matchDurationMinutes: 60,
    breakBetweenMatchesMinutes: 15,
    autoGenerateSchedule: true,
    earlyBirdDiscount: 0,
    isFreeEntry: false,
    courts: [],
    prizes: [],
    ownerId: "test-owner-id",
    ...overrides,
  };
}

export function createTestCompetitionProps(
  overrides: Partial<CompetitionProps> = {},
): CompetitionProps {
  return {
    id: "test-competition-id",
    title: "Test Competition",
    description: null,
    format: "elimination",
    startsAt: "2024-01-01T00:00:00.000Z",
    endsAt: "2024-01-15T00:00:00.000Z",
    regStartsAt: null,
    regEndsAt: null,
    maxTeams: null,
    pricePerTeam: 0,
    isPublic: true,
    requiresApproval: false,
    hasWaitlist: true,
    groupCount: null,
    teamsPerGroup: null,
    setsToWin: 2,
    gamesPerSet: 6,
    tiebreakPoints: 7,
    goldenPoint: false,
    matchDurationMinutes: 60,
    firstMatchTime: null,
    lastMatchTime: null,
    breakBetweenMatchesMinutes: 15,
    autoGenerateSchedule: true,
    earlyBirdDiscount: 0,
    isFreeEntry: false,
    ownerId: "test-owner-id",
    status: "draft",
    courts: [],
    prizes: [],
    ...overrides,
  };
}
