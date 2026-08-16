import { GOOGLE_SHEETS_API_CREDENTIALS } from "@/lib/googlesheetsapi";
import { AddSheetId } from "./_components/AddSheetId";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminLoginPage } from "@/constants";

async function Suspended() {
   const session = await auth();
   if (!session?.user) {
      redirect(adminLoginPage);
   }

   const account = await prisma.adminAccount.findUnique({
      where: { id: session.user.id },
      include: { configuration: true },
   });

   return (
      <>
         <div className="mx-auto p-7">
            <AddSheetId
               existingId={account?.configuration?.speadsheetId}
               serviceAccountEmail={GOOGLE_SHEETS_API_CREDENTIALS.client_email}
            />
         </div>
      </>
   );
}

export default function ConfigurationsPage() {
   return (
      <Suspense>
         <Suspended />
      </Suspense>
   );
}
