/*
  Warnings:

  - You are about to drop the column `collegeId` on the `Borrower` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_collegeId_fkey";

-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "collegeId";
