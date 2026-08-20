"use client";

import { BorrowerRecord } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";

function BorrowerRow({
   number,
   borrowerRecord,
}: {
   number: number;
   borrowerRecord: BorrowerRecord;
}) {
   return (
      <tr className="text-center">
         <td className="py-2">{number}</td>
         <td className="py-2">{borrowerRecord.idNumber}</td>
         <td className="py-2">{borrowerRecord.name}</td>
         <td className="py-2">{borrowerRecord.program}</td>
         <td className="py-2">{borrowerRecord.yearLevel}</td>
         <td className="py-2">{borrowerRecord.college}</td>
         <td className="py-2">
            <button>
               <Edit size={18} />
            </button>
         </td>
         <td className="py-2">
            <button>
               <Trash2 size={18} />
            </button>
         </td>
      </tr>
   );
}

export default function BorrowerRecords() {
   return <></>;
}
