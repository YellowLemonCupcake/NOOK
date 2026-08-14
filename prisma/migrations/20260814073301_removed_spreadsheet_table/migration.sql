/*
  Warnings:

  - You are about to drop the column `departmendId` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `departmentsId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `Configurations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spreadsheet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[collegeId]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collegeId` to the `Borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programAbbreviation` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_departmendId_fkey";

-- DropForeignKey
ALTER TABLE "Configurations" DROP CONSTRAINT "Configurations_adminAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_departmentsId_fkey";

-- DropForeignKey
ALTER TABLE "Spreadsheet" DROP CONSTRAINT "Spreadsheet_configurationId_fkey";

-- DropIndex
DROP INDEX "Program_departmentsId_key";

-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "departmendId",
ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "departmentsId",
ADD COLUMN     "collegeId" TEXT NOT NULL,
ADD COLUMN     "programAbbreviation" TEXT NOT NULL;

-- DropTable
DROP TABLE "Configurations";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "Spreadsheet";

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "speadsheetId" TEXT NOT NULL,
    "adminAccountId" TEXT NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "collegeAbbreviation" TEXT NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_adminAccountId_key" ON "Configuration"("adminAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_collegeId_key" ON "Program"("collegeId");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
