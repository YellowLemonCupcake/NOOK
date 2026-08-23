import { LoaderCircle } from "lucide-react";

export default function FallbackRow() {
   return (
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
   );
}
