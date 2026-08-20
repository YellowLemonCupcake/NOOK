/*
  Warnings:

  - You are about to drop the column `firstName` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `middleInitial` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `suffix` on the `Borrower` table. All the data in the column will be lost.
  - Added the required column `name` to the `Borrower` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "middleInitial",
DROP COLUMN "suffix",
ADD COLUMN     "name" TEXT NOT NULL;
