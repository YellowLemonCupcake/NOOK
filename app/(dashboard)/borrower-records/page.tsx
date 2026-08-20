import { Edit, Trash2 } from "lucide-react";
import AddRecord from "./_components/AddRecord";
import { BorrowerRecord } from "@/lib/types";

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
         <td className="py-2">{borrowerRecord.program.programAbbreviation}</td>
         <td className="py-2">{borrowerRecord.yearLevel}</td>
         <td className="py-2">
            {borrowerRecord.program.college.collegeAbbreviation}
         </td>
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

export default function StudentRecordsPage() {
   return (
      <div className="min-w-150 p-5">
         <table className="font-inter w-full border-separate border-spacing-0">
            <thead className="bg-[#E8F5E9] text-sm font-bold select-none">
               <tr className="text-black/70">
                  <th className="border-b-green-primary rounded-tl-xl border-b pl-2">
                     No.
                  </th>
                  <th className="border-b-green-primary border-b py-3">
                     ID-Number
                  </th>
                  <th className="border-b-green-primary border-b py-3">Name</th>
                  <th className="border-b-green-primary border-b py-3">
                     Course
                  </th>
                  <th className="border-b-green-primary border-b py-3">Year</th>
                  <th className="border-b-green-primary border-b py-3">
                     College
                  </th>
                  <th
                     className="border-b-green-primary rounded-tr-xl border-b py-3"
                     colSpan={2}
                  >
                     Action
                  </th>
               </tr>
            </thead>
            <tbody className="text-sm text-gray-600"></tbody>
         </table>
         <AddRecord />
      </div>
   );
}
