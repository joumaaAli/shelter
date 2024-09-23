-- CreateTable
CREATE TABLE "Praticien" (
    "orderNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "RPPSNumber" TEXT,
    "cabinetNumber" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "materiels" TEXT[],

    CONSTRAINT "Praticien_pkey" PRIMARY KEY ("orderNumber")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PraticienToSpecialty" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Praticien_email_key" ON "Praticien"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PraticienToSpecialty_AB_unique" ON "_PraticienToSpecialty"("A", "B");

-- CreateIndex
CREATE INDEX "_PraticienToSpecialty_B_index" ON "_PraticienToSpecialty"("B");

-- AddForeignKey
ALTER TABLE "Praticien" ADD CONSTRAINT "Praticien_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PraticienToSpecialty" ADD CONSTRAINT "_PraticienToSpecialty_A_fkey" FOREIGN KEY ("A") REFERENCES "Praticien"("orderNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PraticienToSpecialty" ADD CONSTRAINT "_PraticienToSpecialty_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
