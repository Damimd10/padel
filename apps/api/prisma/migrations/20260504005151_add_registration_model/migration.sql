-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('registered', 'pending_review', 'approved', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Registration_competitionId_idx" ON "Registration"("competitionId");

-- CreateIndex
CREATE INDEX "Registration_participantId_competitionId_idx" ON "Registration"("participantId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_participantId_competitionId_key" ON "Registration"("participantId", "competitionId");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
