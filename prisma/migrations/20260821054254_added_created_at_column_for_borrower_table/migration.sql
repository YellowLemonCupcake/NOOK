/*
  Warnings:

  - You are about to drop the column `borrowerId` on the `BorrowLog` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `PendingRegistration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idNumber]` on the table `PendingRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idNumber` to the `BorrowLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BorrowLog" DROP CONSTRAINT "BorrowLog_borrowerId_fkey";

-- DropIndex
DROP INDEX "BorrowLog_borrowerId_date_idx";

-- AlterTable
ALTER TABLE "BorrowLog" DROP COLUMN "borrowerId",
ADD COLUMN     "idNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Borrower" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "studentId",
ADD COLUMN     "idNumber" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "BorrowLog_idNumber_date_idx" ON "BorrowLog"("idNumber", "date");

-- CreateIndex
CREATE INDEX "Borrower_createdAt_idx" ON "Borrower"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_idNumber_key" ON "PendingRegistration"("idNumber");

-- AddForeignKey
ALTER TABLE "BorrowLog" ADD CONSTRAINT "BorrowLog_idNumber_fkey" FOREIGN KEY ("idNumber") REFERENCES "Borrower"("idNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
