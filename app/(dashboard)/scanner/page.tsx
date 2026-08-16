"use client";
import { Library } from "@/components/Images";
import { Scanner } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import { useState } from "react";

type Infos = {
   bookCode: string | null;
   bookISBN: string | null;
   borrowerId: string | null;
};

export default function ScannerPage() {
   const [infos, setInfos] = useState<Infos>({
      bookCode: null,
      bookISBN: null,
      borrowerId: null,
   });

   return (
      <div className="relative min-h-[calc(100dvh-85px)] bg-[#003300]/90 p-7 select-none">
         <Library className="absolute inset-0 -z-10 size-full object-cover" />

         <div>
            <Scanner
               onScan={() => {}}
               classNames={{
                  container: clsx(
                     "max-w-100 rounded-2xl border-2 border-green-primary mx-auto",
                  ),
               }}
            />
            <form></form>
         </div>
      </div>
   );
}
