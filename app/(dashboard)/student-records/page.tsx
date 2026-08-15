import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { Suspense } from "react";

async function Suspended() {
   const res = await prisma.adminAccount.findMany();
   const header = await headers();
   return <>{JSON.stringify(res)}</>;
}

export default function StudentRecordsPage() {
   return (
      <Suspense>
         <Suspended />
      </Suspense>
   );
}
