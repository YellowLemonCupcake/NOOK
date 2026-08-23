import FallbackRow from "@/components/table/fallbackRow";
import Table from "@/components/table/table";
import { adminLoginPage } from "@/constants";
import { getPendingBorrowerRecords } from "@/data-access-layer/PendingBorrowerRecords";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PendingBorrowerRows from "./PendingBorrowerRows";

async function Suspended() {
   const pendingRecords = await getPendingBorrowerRecords();
   if (!pendingRecords.ok) {
      if (pendingRecords.error === "AUTH") redirect(adminLoginPage);
      return <>Error</>;
   }
   return <PendingBorrowerRows pendingRecords={pendingRecords.data} />;
}

export default function PendingRegistrationPage() {
   return (
      <>
         <Table
            headers={[
               "ID-Number",
               "Times borrowed",
               "Last borrow date",
               "Action",
            ]}
         >
            <Suspense fallback={<FallbackRow />}>
               <Suspended />
            </Suspense>
         </Table>
      </>
   );
}
