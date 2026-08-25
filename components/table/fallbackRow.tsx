import { LoaderCircle } from "lucide-react";
import Table from "./table";

export default function FallbackRow() {
   return (
      <Table
         headers={[
            "Date",
            "ID-Number",
            "Name",
            "Course",
            "Year",
            "College",
            "Book Barcode",
            "Title",
            "Author",
         ]}
         extraStyling="min-w-250"
      >
         <tr>
            <td colSpan={9}>
               <div className="mx-auto flex w-fit items-center gap-2 py-5 font-medium">
                  <span>
                     <LoaderCircle className="animate-spin" size={20} />
                  </span>
                  Loading...
               </div>
            </td>
         </tr>
      </Table>
   );
}
