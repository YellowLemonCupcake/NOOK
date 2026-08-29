import FallbackRow from "@/components/table/fallbackRow";
import Table from "@/components/table/table";
import TableRow from "@/components/table/tableRow";
import { adminLoginPage } from "@/constants";
import getTopBorrowers from "@/data-access-layer/TopBorrowers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function SuspendedTopRows() {
   const top = await getTopBorrowers();
   if (!top.ok) {
      if (top.error === "AUTH") redirect(adminLoginPage);
      return <>Error</>;
   }
   return top.data.map((t, i) => (
      <TableRow
         index={i}
         key={t.idNumber}
         data={[i + 1, t.idNumber, t._count.bookBarcode]}
      />
   ));
}

export default function TopBorrowersPage() {
   return (
      <>
         <Table headers={["No.", "ID-Number", "Times Borrowed"]}>
            <Suspense fallback={<FallbackRow />}>
               <SuspendedTopRows />
            </Suspense>
         </Table>
      </>
   );
}
