import AddRecord from "./_components/AddRecord";
import { getBorrowerRecords } from "@/data-access-layer/BorrowerRecords";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DialogProvider } from "./_components/DialogProvider";
import BorrowerRows from "./_components/BorrowerRows";

async function Suspended() {
   const res = await getBorrowerRecords();
   if (!res.ok) {
      if (res.error === "AUTH") redirect(adminLoginPage);
      else <></>;
      return;
   }
   return <BorrowerRows />;
}

export default async function BorrowerRecordsPage() {
   return (
      <div className="min-w-150 p-3">
         <DialogProvider>
            <table className="font-inter w-full border-separate border-spacing-0">
               <thead className="bg-[#E8F5E9] text-sm font-bold select-none">
                  <tr className="text-black/70">
                     <th className="border-b-green-primary rounded-tl-xl border-b pl-2">
                        No.
                     </th>
                     <th className="border-b-green-primary border-b py-3">
                        ID-Number
                     </th>
                     <th className="border-b-green-primary border-b py-3">
                        Name
                     </th>
                     <th className="border-b-green-primary border-b py-3">
                        Course
                     </th>
                     <th className="border-b-green-primary border-b py-3">
                        Year
                     </th>
                     <th className="border-b-green-primary border-b py-3">
                        College
                     </th>
                     <th
                        className="border-b-green-primary rounded-tr-xl border-b py-3"
                        colSpan={2}
                     >
                        Action
                     </th>
                  </tr>
               </thead>
               <tbody className="text-sm text-gray-600">
                  <Suspense>
                     <Suspended />
                  </Suspense>
               </tbody>
            </table>
            <AddRecord />
         </DialogProvider>
      </div>
   );
}
