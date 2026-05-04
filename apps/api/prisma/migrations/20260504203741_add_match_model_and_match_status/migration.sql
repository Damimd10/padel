-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "registrationAId" TEXT NOT NULL,
    "registrationBId" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "scoreA" INTEGER,
    "scoreB" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Match_competitionId_idx" ON "Match"("competitionId");

-- CreateIndex
CREATE INDEX "Match_competitionId_status_idx" ON "Match"("competitionId", "status");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_registrationAId_fkey" FOREIGN KEY ("registrationAId") REFERENCES "Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_registrationBId_fkey" FOREIGN KEY ("registrationBId") REFERENCES "Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
