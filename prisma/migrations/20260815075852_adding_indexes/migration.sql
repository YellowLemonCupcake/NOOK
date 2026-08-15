/*
  Warnings:

  - A unique constraint covering the columns `[idNumber]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "BorrowLog_date_idx" ON "BorrowLog"("date");

-- CreateIndex
CREATE INDEX "BorrowLog_borrowerId_date_idx" ON "BorrowLog"("borrowerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_idNumber_key" ON "Borrower"("idNumber");
