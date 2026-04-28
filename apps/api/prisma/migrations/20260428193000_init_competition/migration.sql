-- CreateEnum
CREATE TYPE "CompetitionFormat" AS ENUM ('elimination', 'round_robin', 'league');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('draft', 'open', 'closed');

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "format" "CompetitionFormat" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "CompetitionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);
