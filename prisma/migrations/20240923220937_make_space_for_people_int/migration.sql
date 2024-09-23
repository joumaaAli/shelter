-- DropForeignKey
ALTER TABLE "House" DROP CONSTRAINT "House_userId_fkey";

-- AlterTable
ALTER TABLE "House" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
