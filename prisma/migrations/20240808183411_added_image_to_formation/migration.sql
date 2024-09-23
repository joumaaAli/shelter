/*
  Warnings:

  - Added the required column `profileImg` to the `Formation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "profileImg" TEXT NOT NULL;
