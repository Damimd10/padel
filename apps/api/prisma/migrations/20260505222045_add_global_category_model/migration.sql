-- CreateTable
CREATE TABLE "GlobalCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "description" TEXT,
    "skillLevel" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "divisions" "DivisionName"[],
    "minRanking" INTEGER,
    "maxRanking" INTEGER,
    "requiresOfficialRanking" BOOLEAN NOT NULL DEFAULT false,
    "allowCategoryChange" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GlobalCategory_isActive_idx" ON "GlobalCategory"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalCategory_shortCode_key" ON "GlobalCategory"("shortCode");
