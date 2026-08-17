/*
  Warnings:

  - The primary key for the `College` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `College` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Program` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Program` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `programId` on the `Borrower` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `collegeId` on the `Borrower` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `collegeId` on the `Program` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_programId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_collegeId_fkey";

-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "programId",
ADD COLUMN     "programId" INTEGER NOT NULL,
DROP COLUMN "collegeId",
ADD COLUMN     "collegeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "College" DROP CONSTRAINT "College_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "College_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Program" DROP CONSTRAINT "Program_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "collegeId",
ADD COLUMN     "collegeId" INTEGER NOT NULL,
ADD CONSTRAINT "Program_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PendingRegistration" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "tableRanges" TEXT[],

    CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_collegeId_key" ON "Program"("collegeId");

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
