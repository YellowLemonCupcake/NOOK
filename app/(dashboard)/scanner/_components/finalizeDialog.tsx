"use client";

import { RefObject, useState } from "react";
import { type BorrowData } from "../page";
import { Barcode, BookOpen, IdCard } from "lucide-react";

type BookInfo =
   | {
        status: "noisbn" | "pending" | "not-found" | "error";
     }
   | {
        status: "found";
        data: { title: string; author: string };
     };

type StudentInfo =
   | {
        status: "pending" | "not-found" | "error";
     }
   | {
        status: "found";
        data: {
           idNumber: string;
           name: string;
           yearLevel: number;
           program: string;
           college: string;
        };
     };

export default function FinalizeDialog({
   infos,
   ref,
   toggle,
}: {
   infos: BorrowData;
   ref: RefObject<HTMLDialogElement | null>;
   toggle: () => void;
}) {
   const { bookCode, bookISBN, borrowerId } = infos;

   const [bookInfo, setBookInfo] = useState<BookInfo>({ status: "pending" });
   const [studentInfo, setStudentInfo] = useState<StudentInfo>({
      status: "pending",
   });

   return (
      <dialog
         ref={ref}
         className="bg-green-primary font-inter border-yellow-primary/20 m-auto w-150 rounded-md border-2 p-5 outline-none backdrop:bg-black/50 backdrop:backdrop-blur-xs"
      >
         <div className="min-w-50">
            <p className="text-sm text-white/80 select-none">Confirm details</p>
            <p className="text-white-primary text-2xl font-bold">
               Borrow request
            </p>
            <div className="my-4 space-y-2 text-white">
               {[
                  { label: "Borrower ID", icon: IdCard, data: borrowerId },
                  { label: "Book Barcode", icon: Barcode, data: bookCode },
                  {
                     label: "Book ISBN",
                     icon: BookOpen,
                     data: bookISBN.trim() || "N/A",
                  },
               ].map((e) => (
                  <div
                     key={e.label}
                     className="flex justify-between gap-2 rounded-md bg-black/10 px-3 py-2"
                  >
                     <div className="flex min-w-0 items-center gap-3">
                        <span>
                           <e.icon />
                        </span>
                        <span className="truncate">{e.label}</span>
                     </div>
                     <p>{e.data}</p>
                  </div>
               ))}
            </div>
            <button
               className="font-roboto bg-yellow-primary w-full rounded-md p-2 font-semibold shadow-sm"
               onClick={toggle}
            >
               Close
            </button>
         </div>
      </dialog>
   );
}
