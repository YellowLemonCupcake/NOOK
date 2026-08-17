/*
  Warnings:

  - A unique constraint covering the columns `[collegeAbbreviation]` on the table `College` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "College_collegeAbbreviation_key" ON "College"("collegeAbbreviation");
