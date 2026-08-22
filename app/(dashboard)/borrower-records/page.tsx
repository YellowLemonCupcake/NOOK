import AddRecord from "./_components/AddRecord";
import { getBorrowerRecords } from "@/data-access-layer/BorrowerRecords";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DialogProvider } from "./_components/DialogProvider";
import BorrowerRows from "./_components/BorrowerRows";
import { LoaderCircle } from "lucide-react";

async function Suspended() {
   const res = await getBorrowerRecords();
   if (!res.ok) {
      if (res.error === "AUTH") redirect(adminLoginPage);
      return <></>;
   }
   return <BorrowerRows records={res.data} />;
}

export default async function BorrowerRecordsPage() {
   return (
      <div className="p-3 pb-25">
         <DialogProvider>
            <div className="overflow-x-auto">
               <table className="font-inter w-full min-w-150 border-separate border-spacing-0">
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
                        <th className="border-b-green-primary rounded-tr-xl border-b py-3">
                           Action
                        </th>
                     </tr>
                  </thead>
                  <tbody className="text-sm text-gray-600">
                     <Suspense
                        fallback={
                           <tr>
                              <td colSpan={7}>
                                 <div className="mx-auto flex w-fit items-center gap-2 py-5 font-medium">
                                    <span>
                                       <LoaderCircle
                                          className="animate-spin"
                                          size={20}
                                       />
                                    </span>
                                    Loading...
                                 </div>
                              </td>
                           </tr>
                        }
                     >
                        <Suspended />
                     </Suspense>
                  </tbody>
               </table>
            </div>
            <AddRecord />
         </DialogProvider>
      </div>
   );
}
