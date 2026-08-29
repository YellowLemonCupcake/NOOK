import { PillTabContainer } from "@/components/pill-tab/container";
import { Pill } from "@/components/pill-tab/pill";
import { logsPage, topBorrowersPage } from "@/constants";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="p-3 pb-25">
         <PillTabContainer>
            <Pill targetRoute={logsPage} label="All" />
            <Pill targetRoute={topBorrowersPage} label="Top Borrowers" />
         </PillTabContainer>
         {children}
      </div>
   );
}
