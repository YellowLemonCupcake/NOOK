import { GOOGLE_SHEETS_API_CREDENTIALS } from "@/lib/googlesheetsapi";
import { AddSheetId } from "./_components/AddSheetId";

export default async function ConfigurationsPage() {
   return (
      <>
         <div className="mx-auto p-7">
            <AddSheetId
               serviceAccountEmail={GOOGLE_SHEETS_API_CREDENTIALS.client_email}
            />
         </div>
      </>
   );
}
