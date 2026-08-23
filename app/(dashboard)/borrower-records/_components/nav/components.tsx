"use client";

import { borrowerRecordsPage, pendingBorrowerRecordPage } from "@/constants";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
   return (
      <div className="font-inter mb-2 flex w-fit gap-2 rounded-md bg-gray-50 px-2 py-1.5 select-none">
         {children}
      </div>
   );
}

export function AllStudents({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const active = !pathname.includes(pendingBorrowerRecordPage);
   return (
      <Link
         href={borrowerRecordsPage}
         className={clsx(
            "rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100",
            active && "bg-yellow-primary pointer-events-none shadow-sm",
         )}
      >
         All {children}
      </Link>
   );
}
export function PendingStudents({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const active = pathname.includes(pendingBorrowerRecordPage);
   return (
      <Link
         href={pendingBorrowerRecordPage}
         className={clsx(
            "rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100",
            active && "bg-yellow-primary pointer-events-none shadow-sm",
         )}
      >
         Pending {children}
      </Link>
   );
}
