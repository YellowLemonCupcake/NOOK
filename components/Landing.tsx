"use client";
import clsx from "clsx";
import { useState } from "react";
import { Nook2 } from "./Images";
//  https://herolearningcommons.vercel.app/

function TopBorrowers() {
   const [selected, setSelected] = useState<"all" | "student" | "college">(
      "all",
   );

   return (
      <div className="flex min-h-100 flex-col gap-2 px-4 sm:px-10 md:min-h-auto">
         <p className="border-yellow-primary font-inter border-l-8 px-2 text-xl font-bold">
            Top Borrowers
         </p>
         <div className="grow bg-[#34A853]/12">
            <div className="bg-white-primary mt-6 space-x-2 p-2 px-6">
               {/* {(["all", "student", "college"] as const).map((e, i) => (
                  <button
                     key={i}
                     className={clsx(
                        "font-inter rounded-xl px-4 py-1.5 text-sm font-medium",
                        e.toLowerCase() === selected
                           ? "bg-green-primary text-white-primary pointer-events-none"
                           : "text-black",
                     )}
                     onClick={() => setSelected(e)}
                  >
                     {e[0].toUpperCase()}
                     {e.slice(1)}
                  </button>
               ))} */}
            </div>
         </div>
      </div>
   );
}

export default function Landing() {
   return (
      <div className="my-auto grid grid-cols-1 gap-y-6 bg-white py-7 md:grid-cols-2">
         <div className="flex flex-col items-center space-y-7 px-4 py-8">
            <Nook2 width={331} height={142} />
            <p
               className="font-funnel-sans max-w-82.75 text-justify"
               style={{ fontSize: "14px", lineHeight: "18px" }}
            >
               <span className="text-green-primary font-bold">NOOK</span> stands
               for{" "}
               <span className="text-green-primary font-bold">
                  Navigate, Open, Obtain, Keep
               </span>
               . It is designed to make book borrowing faster, simpler, and more
               organized. It allows students and library staff to use book
               scanning and digital records to streamline the borrowing process
               while reducing manual logging.
            </p>
         </div>
         <TopBorrowers />
      </div>
   );
}
