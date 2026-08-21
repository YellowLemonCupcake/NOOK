/*
  Warnings:

  - You are about to drop the column `speadsheetId` on the `Configuration` table. All the data in the column will be lost.
  - Added the required column `spreadsheetId` to the `Configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "speadsheetId",
ADD COLUMN     "spreadsheetId" TEXT NOT NULL;
