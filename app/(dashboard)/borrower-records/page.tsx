import AddRecord from "./_components/AddRecord";
import { getBorrowerRecords } from "@/data-access-layer/BorrowerRecords";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DialogProvider } from "./_components/DialogProvider";
import BorrowerRows from "./_components/BorrowerRows";
import Table from "@/components/table/table";
import FallbackRow from "@/components/table/fallbackRow";

async function Suspended() {
   const res = await getBorrowerRecords();
   if (!res.ok) {
      if (res.error === "AUTH") redirect(adminLoginPage);
      return <>Error</>;
   }
   return <BorrowerRows records={res.data} />;
}

export default async function BorrowerRecordsPage() {
   return (
      <DialogProvider>
         <Table
            headers={[
               "No.",
               "ID-Number",
               "Name",
               "Course",
               "Year",
               "College",
               "Action",
            ]}
            extraStyling="min-w-150"
         >
            <Suspense fallback={<FallbackRow />}>
               <Suspended />
            </Suspense>
         </Table>
         <AddRecord />
      </DialogProvider>
   );
}
