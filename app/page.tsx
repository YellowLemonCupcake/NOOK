import Landing from "@/components/Landing";
import { adminLoginPage } from "@/constants";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
   return (
      <main className="relative select-none">
         <nav className="bg-white-primary fixed inset-x-0 top-0 z-10 flex justify-between px-5 py-3.75 text-lg">
            <p className="font-inter font-bold sm:hidden">Home</p>
            <Menu className="sm:hidden" />
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
         <div className="absolute inset-x-0 top-15 flex min-h-screen grow flex-col">
            <div className="absolute inset-0 -z-10">
               <Image
                  src={"/library.jpg"}
                  alt=""
                  draggable={false}
                  width={2000}
                  height={2000}
                  loading="eager"
                  className="absolute inset-0 size-full object-cover"
               />
               <div className="bg-green-primary/70 absolute inset-0" />
            </div>
            <Landing />
            <Image
               src={"/icon2.svg"}
               alt=""
               draggable={false}
               width={196}
               height={87}
               className="absolute inset-0 m-auto size-auto sm:hidden"
            />
         </div>
      </main>
   );
}
