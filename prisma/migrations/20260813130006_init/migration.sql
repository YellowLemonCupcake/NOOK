-- CreateTable
CREATE TABLE "AdminAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configurations" (
    "id" TEXT NOT NULL,
    "adminAccountId" TEXT NOT NULL,

    CONSTRAINT "Configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spreadsheet" (
    "id" TEXT NOT NULL,
    "spreadsheetId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "configurationId" TEXT NOT NULL,

    CONSTRAINT "Spreadsheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BorrowLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookBarcode" TEXT NOT NULL,
    "bookTitle" TEXT NOT NULL,
    "bookAuthor" TEXT[],
    "callNumber" TEXT NOT NULL,
    "copies" INTEGER NOT NULL,
    "borrowerId" TEXT NOT NULL,

    CONSTRAINT "BorrowLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borrower" (
    "id" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yearLevel" INTEGER NOT NULL,
    "programId" TEXT NOT NULL,
    "departmendId" TEXT NOT NULL,

    CONSTRAINT "Borrower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "departmentsId" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_username_key" ON "AdminAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_email_key" ON "AdminAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Configurations_adminAccountId_key" ON "Configurations"("adminAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Spreadsheet_configurationId_key" ON "Spreadsheet"("configurationId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_departmentsId_key" ON "Program"("departmentsId");

-- AddForeignKey
ALTER TABLE "Configurations" ADD CONSTRAINT "Configurations_adminAccountId_fkey" FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spreadsheet" ADD CONSTRAINT "Spreadsheet_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configurations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowLog" ADD CONSTRAINT "BorrowLog_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Borrower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_departmendId_fkey" FOREIGN KEY ("departmendId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_departmentsId_fkey" FOREIGN KEY ("departmentsId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
