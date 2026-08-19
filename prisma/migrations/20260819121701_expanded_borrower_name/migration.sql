/*
  Warnings:

  - You are about to drop the column `name` on the `Borrower` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Borrower` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleInitial" TEXT,
ADD COLUMN     "suffix" TEXT;
