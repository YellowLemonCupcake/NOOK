import { Suspense } from "react";
import { getBorrowerRecordsCount } from "@/data-access-layer/BorrowerRecords";
import { redirect } from "next/navigation";
import {
   adminLoginPage,
   borrowerRecordsPage,
   pendingBorrowerRecordPage,
} from "@/constants";
import { getPendingBorrowerRecordsCount } from "@/data-access-layer/PendingBorrowerRecords";
import { PillTabContainer } from "@/components/pill-tab/container";
import { Pill } from "@/components/pill-tab/pill";

async function AllStudentsCount() {
   const studentCount = await getBorrowerRecordsCount();
   if (!studentCount.ok) {
      if (studentCount.error === "AUTH") redirect(adminLoginPage);
      return null;
   }
   return <span className="opacity-80">{studentCount.data}</span>;
}
async function PendingStudentsCount() {
   const pendingStudentCount = await getPendingBorrowerRecordsCount();
   if (!pendingStudentCount.ok) {
      if (pendingStudentCount.error === "AUTH") redirect(adminLoginPage);
      return null;
   }
   if (pendingStudentCount.data === 0) return null;
   return (
      <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-red-700 text-xs text-white">
         {pendingStudentCount.data}
      </span>
   );
}

export default function Nav() {
   return (
      <PillTabContainer>
         <Pill label="All" targetRoute={borrowerRecordsPage}>
            <Suspense>
               <AllStudentsCount />
            </Suspense>
         </Pill>
         <Pill label="Pending" targetRoute={pendingBorrowerRecordPage}>
            <Suspense>
               <PendingStudentsCount />
            </Suspense>
         </Pill>
      </PillTabContainer>
   );
}
