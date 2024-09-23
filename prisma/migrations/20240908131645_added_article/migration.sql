-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "photo" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
