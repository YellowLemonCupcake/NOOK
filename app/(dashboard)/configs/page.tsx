import { GOOGLE_SHEETS_API_CREDENTIALS } from "@/lib/googlesheetsapi";
import { AddSheetId } from "./_components/AddSheetId";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import getSpreadsheetId from "@/lib/getSpreadsheetId";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminLoginPage } from "@/constants";
import { ChevronRight, LoaderCircle } from "lucide-react";

async function Suspended() {
   const session = await auth();
   if (!session?.user) redirect(adminLoginPage);
   const currentSpreadsheetId = await getSpreadsheetId(session.user.id);

   return (
      <div className="mx-auto p-7">
         <AddSheetId
            currentId={currentSpreadsheetId}
            serviceAccountEmail={GOOGLE_SHEETS_API_CREDENTIALS.client_email}
         />
         {currentSpreadsheetId && (
            <Link
               href={`https://docs.google.com/spreadsheets/d/${currentSpreadsheetId}/edit`}
               target="_blank"
               className="font-inter mt-5 flex w-fit items-center gap-2 font-medium underline"
            >
               <Image
                  src={"/Google_Sheets_Logo.svg"}
                  alt=""
                  width={17}
                  height={20}
                  draggable={false}
               />
               Go to Google Sheets
               <span>
                  <ChevronRight size={20} />
               </span>
            </Link>
         )}
      </div>
   );
}

export default async function ConfigurationsPage() {
   return (
      <Suspense
         fallback={
            <div className="flex items-center gap-2 p-7 text-lg text-gray-700">
               <LoaderCircle className="animate-spin" size={20} /> Loading . . .
            </div>
         }
      >
         <Suspended />
      </Suspense>
   );
}
