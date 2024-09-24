-- AlterTable
ALTER TABLE "Shelter" ADD COLUMN     "regionId" INTEGER;

-- CreateIndex
CREATE INDEX "Shelter_regionId_idx" ON "Shelter"("regionId");

-- AddForeignKey
ALTER TABLE "Shelter" ADD CONSTRAINT "Shelter_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
