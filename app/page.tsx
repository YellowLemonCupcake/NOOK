"use client";

import { Library } from "@/components/Images";
import Landing from "@/components/Landing";
import { adminLoginPage } from "@/constants";
import clsx from "clsx";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <main className="relative select-none">
         <nav className="bg-white-primary fixed inset-x-0 top-0 z-10 flex justify-between px-5 py-3.75 text-lg">
            <p className="font-inter font-bold sm:hidden">Home</p>
            <button
               className="sm:hidden"
               onClick={() => setIsOpen((prev) => !prev)}
            >
               <Menu />
            </button>
            <div className="font-inter hidden grow justify-end gap-10 px-5 sm:flex">
               <button className="w-19 text-center hover:font-bold hover:text-[#FBBC05]">
                  Home
               </button>
               <button className="w-19 text-center hover:font-bold hover:text-[#FBBC05]">
                  Search
               </button>
               <Link
                  href={adminLoginPage}
                  className="w-19 text-center hover:font-bold hover:text-[#FBBC05]"
               >
                  Admin
               </Link>
            </div>
         </nav>
         <div className="absolute inset-x-0 top-14 flex min-h-screen grow flex-col">
            <div className="absolute inset-0 -z-10">
               <Library className="absolute inset-0 size-full object-cover" />
               <div className="bg-green-primary/70 absolute inset-0" />
            </div>
            <Landing />
         </div>
         <nav
            className={clsx(
               "font-inter bg-white-primary fixed inset-x-0 top-14 overflow-y-hidden text-lg font-medium shadow-md transition-[height] duration-300 sm:hidden",
               isOpen ? "h-39" : "h-0",
            )}
         >
            <Link
               href={""}
               className="relative block w-full py-3 text-center active:bg-gray-100"
            >
               Home
               <span className="absolute inset-y-0 right-4 flex items-center">
                  <ChevronRight />
               </span>
            </Link>
            <Link
               href={""}
               className="relative block w-full py-3 text-center active:bg-gray-100"
            >
               Search
               <span className="absolute inset-y-0 right-4 flex items-center">
                  <ChevronRight />
               </span>
            </Link>
            <Link
               href={adminLoginPage}
               className="relative block w-full py-3 text-center active:bg-gray-100"
            >
               Admin
               <span className="absolute inset-y-0 right-4 flex items-center">
                  <ChevronRight />
               </span>
            </Link>
         </nav>
      </main>
   );
}
