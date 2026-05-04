/*
  Warnings:

  - Changed the type of `name` on the `Division` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DivisionName" AS ENUM ('masculino', 'femenino', 'mixto');

-- Add temporary column
ALTER TABLE "Division" ADD COLUMN "name_new" "DivisionName";

-- Map existing values to enum with explicit cast
UPDATE "Division" SET "name_new" = (CASE
  WHEN LOWER("name") IN ('masculino', 'men', 'male', 'm') THEN 'masculino'
  WHEN LOWER("name") IN ('femenino', 'women', 'female', 'f') THEN 'femenino'
  WHEN LOWER("name") IN ('mixto', 'mixed', 'x') THEN 'mixto'
  ELSE 'masculino'
END)::"DivisionName";

-- Make sure all rows have a value
UPDATE "Division" SET "name_new" = 'masculino'::"DivisionName" WHERE "name_new" IS NULL;

-- Drop old column and rename new one
ALTER TABLE "Division" DROP COLUMN "name";
ALTER TABLE "Division" RENAME COLUMN "name_new" TO "name";

-- Make column NOT NULL
ALTER TABLE "Division" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Division_competitionId_name_key" ON "Division"("competitionId", "name");
