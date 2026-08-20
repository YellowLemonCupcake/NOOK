/*
  Warnings:

  - You are about to drop the column `programId` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `college` to the `Borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program` to the `Borrower` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_programId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_collegeId_fkey";

-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "programId",
ADD COLUMN     "college" TEXT NOT NULL,
ADD COLUMN     "program" TEXT NOT NULL;

-- DropTable
DROP TABLE "College";

-- DropTable
DROP TABLE "Program";
