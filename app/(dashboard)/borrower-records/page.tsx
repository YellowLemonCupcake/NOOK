import AddRecord from "./_components/AddRecord";
import { getBorrowerRecords } from "@/data-access-layer/BorrowerRecords";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DialogProvider } from "./_components/DialogProvider";
import BorrowerRows from "./_components/BorrowerRows";
import Table from "@/components/table/table";
import FallbackRow from "@/components/table/fallbackRow";
import { File } from "lucide-react";

async function Suspended() {
   const res = await getBorrowerRecords();
   if (!res.ok) {
      if (res.error === "AUTH") redirect(adminLoginPage);
      return <>Error</>;
   }
   if (res.data.length === 0)
      return (
         <tr>
            <td colSpan={10} className="py-4">
               <div className="mx-auto flex w-fit items-center gap-1 font-medium">
                  <span>
                     <File size={15} />
                  </span>
                  Empty
               </div>
            </td>
         </tr>
      );
   return <BorrowerRows records={res.data} />;
}

export default async function BorrowerRecordsPage() {
   return (
      <DialogProvider>
         <div className="overflow-x-auto">
            <Table
               headers={[
                  "No.",
                  "ID",
                  "Name",
                  "Program",
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
         </div>
         <AddRecord />
      </DialogProvider>
   );
}
