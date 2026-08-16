"use client";
import { Library } from "@/components/Images";
import { Scanner } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import {
   Barcode,
   Book,
   BookText,
   Feather,
   SendHorizonal,
   UserRound,
   type LucideProps,
} from "lucide-react";
import { useState } from "react";

type Infos = {
   borrowerId: string | null;
   bookCode: string | null;
   bookISBN: string | null;
   bookTitle: string | null;
   bookAuthor: string | null;
};

function Input({
   label,
   icon,
   placeholder,
}: {
   label: string;
   placeholder?: string;
   icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
   >;
}) {
   return (
      <div>
         <p className="mb-1 flex items-center gap-1">
            <span>{((prop) => <prop.icon size={18} />)({ icon })}</span>
            {label}
         </p>
         <input
            type="text"
            className="bg-white-primary w-full rounded-md p-2 text-gray-700 outline-none"
            disabled
            placeholder={placeholder}
         />
      </div>
   );
}

export default function ScannerPage() {
   const [infos, setInfos] = useState<Infos>({
      borrowerId: null,
      bookCode: null,
      bookISBN: null,
      bookTitle: null,
      bookAuthor: null,
   });

   return (
      <div className="relative min-h-[calc(100dvh-85px)] bg-[#003300]/90 p-7 select-none">
         <Library className="absolute inset-0 -z-10 size-full object-cover" />

         <div className="flex flex-wrap items-stretch justify-center gap-x-8 gap-y-4">
            <Scanner
               onScan={() => {}}
               classNames={{
                  container: clsx(
                     "max-w-100 rounded-2xl border-2 border-green-primary ",
                  ),
               }}
            />
            <form className="text-white-primary font-inter flex w-full max-w-100 flex-col font-medium">
               <div className="space-y-3">
                  <Input icon={UserRound} label="ID-Number" />
                  <Input icon={Barcode} label="Book Code" />
                  <p className="text-sm font-medium"></p>
                  <Input icon={Barcode} label="ISBN" />
               </div>
               {/* <button className="bg-yellow-primary font-roboto mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md p-2 font-semibold tracking-wide text-gray-700 shadow-sm">
                  Submit
               </button> */}
            </form>
         </div>
      </div>
   );
}
