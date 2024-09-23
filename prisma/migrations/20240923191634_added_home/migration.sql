-- CreateTable
CREATE TABLE "House" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "spaceForPeople" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "additionnalInformation" TEXT,
    "name" TEXT,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);
