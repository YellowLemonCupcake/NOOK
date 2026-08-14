"use client";

import clsx from "clsx";
import React, { useState } from "react";
import {
   useDesktopSidebarToggle,
   useMobileSidebarToggle,
   useSidebar,
} from "./SidebarContextProvider";
import {
   ChevronRight,
   LoaderCircle,
   LogOut,
   Menu,
   NotepadText,
   ScanLine,
   Settings,
   UserRound,
   Wrench,
   X,
} from "lucide-react";
import { Nook1 } from "@/components/Images";
import {
   adminLoginPage,
   configurationsPage,
   logsPage,
   scannerPage,
   settingsPage,
   studentRecordsPage,
} from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
   { label: "Borrow Logs", route: logsPage, icon: NotepadText },
   { label: "Student Records", route: studentRecordsPage, icon: UserRound },
   { label: "Scanner", route: scannerPage, icon: ScanLine },
   { label: "Configurations", route: configurationsPage, icon: Wrench },
];

const routeLabels = [
   [logsPage, "Borrow Logs"],
   [studentRecordsPage, "Student Records"],
   [scannerPage, "Scanner"],
   [configurationsPage, "Configurations"],
   [settingsPage, "Settings"],
];

function LogoutButton() {
   const [isLoading, setIsLoading] = useState(false);
   const handleLogout = async () => {
      if (isLoading) return;
      setIsLoading(true);
      signOut({ callbackUrl: adminLoginPage });
   };
   return (
      <button
         className="flex w-full items-center gap-2 rounded-md p-3 outline-0 hover:bg-white/8 focus-visible:bg-white/8"
         onClick={handleLogout}
      >
         <span>
            <LogOut />
         </span>
         <span className="truncate">Log out</span>
         {isLoading && (
            <span className="ml-auto">
               <LoaderCircle className="animate-spin" />
            </span>
         )}
      </button>
   );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
   const sidebarSwitch = useSidebar();
   const toggleDesktopSidebar = useDesktopSidebarToggle();
   const toggleMobileSidebar = useMobileSidebarToggle();
   const pathname = usePathname();

   return (
      <>
         <nav
            className={clsx(
               "fixed z-100 flex h-dvh w-full flex-col overflow-y-auto bg-[#34A853] px-7 py-5 transition-transform select-none sm:w-80",
               sidebarSwitch.mobile ? "translate-x-0" : "-translate-x-full",
               sidebarSwitch.desktop
                  ? "md:translate-x-0"
                  : "md:-translate-x-full",
            )}
            inert={!sidebarSwitch.mobile && !sidebarSwitch.desktop}
         >
            <button
               className="text-white-primary absolute top-4 left-4 md:hidden"
               onClick={() => toggleMobileSidebar()}
            >
               <X size={30} />
            </button>
            <Nook1
               width={180}
               height={68}
               className="m-auto mt-15 mb-10 size-auto w-45"
            />
            <div className="font-inter text-white-primary text-lg font-medium">
               {links.map((l) => (
                  <Link
                     key={l.label}
                     href={l.route}
                     className={clsx(
                        "flex items-center gap-2 rounded-md p-3 outline-0",
                        pathname === l.route
                           ? "bg-yellow-primary pointer-events-none text-black"
                           : "hover:bg-white/8 focus-visible:bg-white/8",
                     )}
                     onClick={() => toggleMobileSidebar(false)}
                  >
                     <span>
                        <l.icon />
                     </span>
                     <span className="truncate">{l.label}</span>
                     {pathname !== l.route && (
                        <span className="ml-auto">
                           <ChevronRight />
                        </span>
                     )}
                  </Link>
               ))}
            </div>
            <div className="font-inter text-white-primary mt-auto text-lg font-medium">
               <Link
                  href={settingsPage}
                  className={clsx(
                     "flex items-center gap-2 rounded-md p-3 outline-0",
                     pathname.includes(settingsPage)
                        ? "bg-yellow-primary pointer-events-none text-black"
                        : "hover:bg-white/8 focus-visible:bg-white/8",
                  )}
                  onClick={() => toggleMobileSidebar(false)}
               >
                  <span>
                     <Settings />
                  </span>
                  <span className="truncate">Settings</span>
                  {!pathname.includes(settingsPage) && (
                     <span className="ml-auto">
                        <ChevronRight />
                     </span>
                  )}
               </Link>
               <LogoutButton />
            </div>
         </nav>

         {/* Content */}
         <main
            className={clsx(
               "pt-15 transition-[padding]",
               sidebarSwitch.desktop && "md:pl-80",
            )}
         >
            <header
               className={clsx(
                  "bg-green-primary fixed inset-x-0 top-0 flex h-15 items-center px-4 transition-[padding] select-none",
                  sidebarSwitch.desktop && "md:pl-84",
               )}
            >
               <button
                  className="text-white-primary hidden md:block"
                  onClick={() => toggleDesktopSidebar()}
               >
                  <Menu size={30} />
               </button>
               <button
                  className="text-white-primary md:hidden"
                  onClick={() => toggleMobileSidebar()}
               >
                  <Menu size={30} />
               </button>
               <p className="font-inter text-white-primary ml-3 text-xl font-medium">
                  {routeLabels.find((e) => pathname.includes(e[0]))?.at(1) ??
                     ""}
               </p>
            </header>
            {children}
         </main>
      </>
   );
}
