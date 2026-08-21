"use client";

import React, { RefObject, useEffect, useState } from "react";
import { type BorrowData } from "../page";
import { Barcode, BookOpen, IdCard, LoaderCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { bookInfosRoute, borrowerInfoRoute } from "@/constants";
import { Result } from "@/lib/types";

type BorrowerInfo = {
   name: string;
   yearLevel: number;
   program: string;
   college: string;
};

type BookInfo =
   | {
        status: "noisbn" | "pending" | "not-found" | "error";
     }
   | {
        status: "found";
        data: { title: string; authors: string };
     };

type StudentInfo =
   | {
        status: "pending" | "not-found" | "error";
     }
   | {
        status: "found";
        data: BorrowerInfo;
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

   // Data fetching
   useEffect(() => {
      const controller = new AbortController();
      (async () => {
         setStudentInfo({ status: "pending" });
         setBookInfo({ status: "pending" });
         try {
            const {
               data,
            }: { data: Result<{ title: string; authors: string }> } =
               await axios.get(`${bookInfosRoute}?isbn=${infos.bookISBN}`, {
                  signal: controller.signal,
               });

            if (!data.ok) {
               if (data.error === "NOT_FOUND")
                  setBookInfo({ status: "not-found" });
               else setBookInfo({ status: "error" });
            } else {
               setBookInfo({
                  status: "found",
                  data: { title: data.data.title, authors: data.data.authors },
               });
            }

            const { data: data2 }: { data: Result<BorrowerInfo> } =
               await axios.get(
                  `${borrowerInfoRoute}?idNumber=${infos.borrowerId}`,
               );

            if (!data2.ok) {
               if (data2.error === "NOT_FOUND")
                  setStudentInfo({ status: "not-found" });
               else setStudentInfo({ status: "error" });
            } else {
               setStudentInfo({
                  status: "found",
                  data: {
                     name: data2.data.name,
                     yearLevel: data2.data.yearLevel,
                     program: data2.data.program,
                     college: data2.data.college,
                  },
               });
            }
         } catch (e) {
            if (e instanceof AxiosError) {
               if (e.code !== "ERR_CANCELED") throw e;
            }
         }
      })();
      return () => controller.abort();
   }, [infos]);

   return (
      <dialog
         ref={ref}
         className="bg-green-primary font-inter border-yellow-primary/20 m-auto w-150 rounded-md border-2 p-5 outline-none backdrop:bg-black/10 backdrop:backdrop-blur-xs"
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
               ].map((e, i) => (
                  <React.Fragment key={e.label}>
                     <div className="flex justify-between gap-2 rounded-md bg-white/20 px-3 py-2">
                        <div className="flex min-w-0 items-center gap-3">
                           <span>
                              <e.icon />
                           </span>
                           <span className="truncate">{e.label}</span>
                        </div>
                        <p>{e.data}</p>
                     </div>
                     {i === 0 && (
                        <div className="rounded-md bg-white/10 px-4 py-2 font-medium">
                           {studentInfo.status === "found" ? (
                              <>
                                 <p className="text-xs text-white/90">
                                    Student
                                 </p>
                                 <p>{studentInfo.data.name}</p>
                                 <p className="text-sm text-white/95">
                                    {studentInfo.data.college} -{" "}
                                    {studentInfo.data.program}{" "}
                                    {studentInfo.data.yearLevel}
                                 </p>
                              </>
                           ) : studentInfo.status === "pending" ? (
                              <span className="flex items-center gap-2 text-white/80">
                                 <span>
                                    <LoaderCircle
                                       size={15}
                                       className="animate-spin"
                                    />
                                 </span>
                                 Fetching record...
                              </span>
                           ) : studentInfo.status === "not-found" ? (
                              <p className="text-sm text-white/90">
                                 Student not registered yet — this record will
                                 go to pending registration.
                              </p>
                           ) : (
                              // error
                              <p className="text-sm text-white/90">
                                 Error fetching data...
                              </p>
                           )}
                        </div>
                     )}
                     {i === 2 && (
                        <div className="rounded-md bg-white/10 px-4 py-2 font-medium">
                           {bookInfo.status === "found" ? (
                              <>
                                 <>
                                    <p className="text-xs text-white/90">
                                       Book
                                    </p>
                                    <p>{bookInfo.data.title}</p>
                                    <p className="text-sm text-white/95">
                                       {bookInfo.data.authors}
                                    </p>
                                 </>
                              </>
                           ) : bookInfo.status === "pending" ? (
                              <span className="flex items-center gap-2 text-white/80">
                                 <span>
                                    <LoaderCircle
                                       size={15}
                                       className="animate-spin"
                                    />
                                 </span>
                                 Fetching record data...
                              </span>
                           ) : bookInfo.status === "not-found" ? (
                              <></>
                           ) : bookInfo.status === "noisbn" ? (
                              <></>
                           ) : (
                              // error
                              <></>
                           )}
                        </div>
                     )}
                  </React.Fragment>
               ))}
            </div>
            <button
               className="font-roboto bg-yellow-primary w-full rounded-md p-2 font-semibold shadow-sm select-none"
               onClick={toggle}
            >
               Close
            </button>
         </div>
      </dialog>
   );
}
