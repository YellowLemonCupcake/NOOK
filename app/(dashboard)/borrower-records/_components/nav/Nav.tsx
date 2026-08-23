import { Suspense } from "react";
import { AllStudents, Container, PendingStudents } from "./components";
import { getBorrowerRecordsCount } from "@/data-access-layer/BorrowerRecords";
import { redirect } from "next/navigation";
import { adminLoginPage } from "@/constants";
import { getPendingBorrowerRecordsCount } from "@/data-access-layer/PendingBorrowerRecords";

async function AllStudentsCount() {
   const studentCount = await getBorrowerRecordsCount();
   if (!studentCount.ok) {
      if (studentCount.error === "AUTH") redirect(adminLoginPage);
      return null;
   }
   return <span className="opacity-70">{studentCount.data}</span>;
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
      <Container>
         <AllStudents>
            <Suspense>
               <AllStudentsCount />
            </Suspense>
         </AllStudents>
         <PendingStudents>
            <Suspense>
               <PendingStudentsCount />
            </Suspense>
         </PendingStudents>
      </Container>
   );
}
