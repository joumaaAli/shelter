-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "Praticien" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
