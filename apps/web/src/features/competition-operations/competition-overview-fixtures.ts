import type { CompetitionOverviewCollection } from "@padel/schemas";

export const competitionOverviewFixture: CompetitionOverviewCollection = [
  {
    id: "fa222204-b855-4fb0-b507-e169249e588e",
    title: "North Circuit Masters",
    format: "round-robin",
    status: "open",
    startsAt: "2026-05-03T12:00:00.000Z",
    endsAt: "2026-05-05T21:00:00.000Z",
    owner: {
      id: "44e7eb17-a42b-4de8-bf34-2f8d78680d39",
      name: "Lucia Perez",
      email: "lucia@example.com",
    },
  },
  {
    id: "d3f0afb5-3206-4f8d-bf78-40adfdfcbb13",
    title: "Club League Apertura",
    format: "league",
    status: "draft",
    startsAt: "2026-05-08T15:00:00.000Z",
    endsAt: "2026-05-20T22:00:00.000Z",
    owner: {
      id: "fae8da22-b34f-4820-bab5-cf4a2e474d68",
      name: "Mateo Sosa",
      email: "mateo@example.com",
    },
  },
  {
    id: "8e948e4d-a326-42dd-89f9-e4afbfd84992",
    title: "Saturday Social Draw",
    format: "elimination",
    status: "closed",
    startsAt: "2026-05-10T16:00:00.000Z",
    endsAt: "2026-05-10T23:00:00.000Z",
    owner: {
      id: "bd1a2c2d-f4aa-4c9b-b3fe-4a35ea8cfe6f",
      name: "Ariana Lopez",
      email: "ariana@example.com",
    },
  },
];

export const emptyCompetitionOverviewFixture: CompetitionOverviewCollection = [];
