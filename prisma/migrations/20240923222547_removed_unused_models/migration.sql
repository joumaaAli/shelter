/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Formation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materiel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Praticien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MaterielToPraticien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PraticienToSpecialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecordToDoctor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Praticien" DROP CONSTRAINT "Praticien_cityId_fkey";

-- DropForeignKey
ALTER TABLE "_MaterielToPraticien" DROP CONSTRAINT "_MaterielToPraticien_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterielToPraticien" DROP CONSTRAINT "_MaterielToPraticien_B_fkey";

-- DropForeignKey
ALTER TABLE "_PraticienToSpecialty" DROP CONSTRAINT "_PraticienToSpecialty_A_fkey";

-- DropForeignKey
ALTER TABLE "_PraticienToSpecialty" DROP CONSTRAINT "_PraticienToSpecialty_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecordToDoctor" DROP CONSTRAINT "_RecordToDoctor_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecordToDoctor" DROP CONSTRAINT "_RecordToDoctor_B_fkey";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "Formation";

-- DropTable
DROP TABLE "Materiel";

-- DropTable
DROP TABLE "Praticien";

-- DropTable
DROP TABLE "Record";

-- DropTable
DROP TABLE "Specialty";

-- DropTable
DROP TABLE "_MaterielToPraticien";

-- DropTable
DROP TABLE "_PraticienToSpecialty";

-- DropTable
DROP TABLE "_RecordToDoctor";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
