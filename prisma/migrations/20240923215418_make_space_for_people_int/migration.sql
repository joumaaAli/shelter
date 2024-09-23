/*
  Warnings:

  - Changed the type of `spaceForPeople` on the `House` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "House" DROP COLUMN "spaceForPeople",
ADD COLUMN     "spaceForPeople" INTEGER NOT NULL;
