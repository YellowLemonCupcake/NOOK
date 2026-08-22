"use client";

import React, { RefObject, useEffect, useState } from "react";
import { type BorrowData } from "../page";
import {
   Barcode,
   BookOpen,
   Check,
   IdCard,
   LoaderCircle,
   X,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { bookInfosRoute, borrowerInfoRoute } from "@/constants";
import { Result } from "@/lib/types";

type BorrowerInfo = {
   name: string;
   yearLevel: number;
   program: string;
   college: string;
};

type FetchState<T> =
   | { status: "pending" }
   | { status: "not-found" }
   | { status: "noinput" }
   | { status: "error" }
   | { status: "found"; data: T };

function useFetchResource<T>(
   url: string | null, // pass null to skip fetching (e.g. no ISBN yet)
): FetchState<T> {
   const [state, setState] = useState<FetchState<T>>({ status: "pending" });

   useEffect(() => {
      if (url === null) {
         return;
      }

      const controller = new AbortController();

      (async () => {
         setState({ status: "pending" });
         try {
            const { data }: { data: Result<T> } = await axios.get(url, {
               signal: controller.signal,
            });

            if (!data.ok) {
               setState({
                  status: data.error === "NOT_FOUND" ? "not-found" : "error",
               });
            } else {
               setState({ status: "found", data: data.data });
            }
         } catch (e) {
            if (e instanceof AxiosError && e.code === "ERR_CANCELED") return;
            setState({ status: "error" });
         }
      })();

      return () => controller.abort();
   }, [url]);

   return !url ? { status: "noinput" } : state;
}

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

   const bookInfo = useFetchResource<{ title: string; authors: string }>(
      infos.bookISBN.trim() ? `${bookInfosRoute}?isbn=${infos.bookISBN}` : null,
   );

   const studentInfo = useFetchResource<BorrowerInfo>(
      `${borrowerInfoRoute}?idNumber=${infos.borrowerId}`,
   );

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
                                 Looking up student record...
                              </span>
                           ) : studentInfo.status === "not-found" ? (
                              <p className="text-sm text-white/90">
                                 No student record found. This borrow will be
                                 saved and added to pending registration.
                              </p>
                           ) : (
                              // error
                              <p className="text-sm text-white/90">
                                 We couldn&apos;t load the student record.
                                 Please try again.
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
                                 Looking up book details...
                              </span>
                           ) : bookInfo.status === "not-found" ? (
                              <p className="text-sm text-white/90">
                                 No book was found for this ISBN.
                              </p>
                           ) : bookInfo.status === "noinput" ? (
                              <p className="text-sm text-white/90">
                                 Enter an ISBN to look up the book title and
                                 author.
                              </p>
                           ) : (
                              // error
                              <p className="text-sm text-white/90">
                                 We couldn&apos;t load the book details. Please
                                 try again.
                              </p>
                           )}
                        </div>
                     )}
                  </React.Fragment>
               ))}
            </div>
            <div className="flex gap-2">
               <button
                  className="font-roboto bg-yellow-primary flex items-center gap-1 rounded-md px-6 py-2 font-semibold shadow-sm select-none"
                  onClick={toggle}
               >
                  <span>
                     <X size={20} />
                  </span>
                  Close
               </button>
               <button className="font-roboto bg-yellow-primary flex w-full grow items-center justify-center gap-1 rounded-md px-6 py-2 font-semibold shadow-sm select-none">
                  <span>
                     <Check size={20} />
                  </span>
                  Confirm
               </button>
            </div>
         </div>
      </dialog>
   );
}
