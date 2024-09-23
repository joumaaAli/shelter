/*
  Warnings:

  - You are about to drop the column `materiels` on the `Praticien` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Praticien" DROP COLUMN "materiels",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Materiel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Materiel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterielToPraticien" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MaterielToPraticien_AB_unique" ON "_MaterielToPraticien"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterielToPraticien_B_index" ON "_MaterielToPraticien"("B");

-- AddForeignKey
ALTER TABLE "_MaterielToPraticien" ADD CONSTRAINT "_MaterielToPraticien_A_fkey" FOREIGN KEY ("A") REFERENCES "Materiel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterielToPraticien" ADD CONSTRAINT "_MaterielToPraticien_B_fkey" FOREIGN KEY ("B") REFERENCES "Praticien"("orderNumber") ON DELETE CASCADE ON UPDATE CASCADE;
