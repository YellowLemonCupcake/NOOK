import Table from "@/components/table/table";
import TableRow from "@/components/table/tableRow";
import { adminLoginPage } from "@/constants";
import getLogsWithBorrower from "@/data-access-layer/BorrowLogsWithBorrower";
import toPHDateString from "@/lib/toPHDateString";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Suspended() {
   const logsWithBorrower = await getLogsWithBorrower();
   if (!logsWithBorrower.ok) {
      if (logsWithBorrower.error === "AUTH") redirect(adminLoginPage);
      return <>Error</>;
   }

   return logsWithBorrower.data.map((row, i) => (
      <TableRow
         key={i}
         index={i}
         data={[
            toPHDateString(row.date),
            row.idNumber,
            row.borrower?.name ?? "PENDING",
            row.borrower?.program ?? "PENDING",
            row.borrower?.yearLevel ?? "PENDING",
            row.borrower?.college ?? "PENDING",
            row.bookBarcode,
            row.bookTitle,
            row.bookAuthor,
         ]}
      />
   ));
}

export default async function Logs() {
   return (
      <div className="p-3 pb-25">
         <div className="overflow-x-auto">
            <Table
               headers={[
                  "Date",
                  "ID-Number",
                  "Name",
                  "Course",
                  "Year",
                  "College",
                  "Book Barcode",
                  "Title",
                  "Author",
               ]}
            >
               <Suspense>
                  <Suspended />
               </Suspense>
            </Table>
         </div>
      </div>
   );
}
