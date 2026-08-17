/*
  Warnings:

  - A unique constraint covering the columns `[programAbbreviation]` on the table `Program` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Program_programAbbreviation_key" ON "Program"("programAbbreviation");
