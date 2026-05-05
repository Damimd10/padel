-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "autoGenerateSchedule" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "breakBetweenMatchesMinutes" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "earlyBirdDiscount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "firstMatchTime" TEXT,
ADD COLUMN     "gamesPerSet" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "goldenPoint" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "groupCount" INTEGER,
ADD COLUMN     "hasWaitlist" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFreeEntry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastMatchTime" TEXT,
ADD COLUMN     "matchDurationMinutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "maxTeams" INTEGER,
ADD COLUMN     "pricePerTeam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "regEndsAt" TIMESTAMP(3),
ADD COLUMN     "regStartsAt" TIMESTAMP(3),
ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "setsToWin" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "teamsPerGroup" INTEGER,
ADD COLUMN     "tiebreakPoints" INTEGER NOT NULL DEFAULT 7;

-- CreateTable
CREATE TABLE "Court" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prize" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Court_competitionId_idx" ON "Court"("competitionId");

-- CreateIndex
CREATE INDEX "Prize_competitionId_idx" ON "Prize"("competitionId");

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prize" ADD CONSTRAINT "Prize_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
