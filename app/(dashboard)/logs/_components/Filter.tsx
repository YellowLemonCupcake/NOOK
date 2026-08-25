"use client";

import { format, parseISO } from "date-fns";
import { ChevronDownIcon, FilterIcon, ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, SubmitEvent, useState } from "react";
import clsx from "clsx";

export function DatePicker({
   label,
   date,
   setDate,
}: {
   label: string;
   date?: Date;
   setDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
   return (
      <Popover>
         <PopoverTrigger
            render={
               <Button
                  variant={"outline"}
                  data-empty={!date}
                  className="data-[empty=true]:text-muted-foreground w-50 justify-between text-left font-normal"
               >
                  {date ? format(date, "PPP") : <span>{label}</span>}
                  <ChevronDownIcon data-icon="inline-end" />
               </Button>
            }
         />
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar
               mode="single"
               selected={date}
               onSelect={setDate}
               defaultMonth={date}
            />
         </PopoverContent>
      </Popover>
   );
}

export default function Filter({
   from: initialFrom,
   to: initialTo,
   idNumber: initialIdNumber,
}: {
   from?: string;
   to?: string;
   idNumber?: string;
}) {
   const [showFilter, setShowFilter] = useState(
      !!initialFrom || !!initialTo || !!initialIdNumber,
   );
   const pathname = usePathname();
   const router = useRouter();
   const [from, setFrom] = useState<Date | undefined>(
      initialFrom ? parseISO(initialFrom) : undefined,
   );
   const [to, setTo] = useState<Date | undefined>(
      initialTo ? parseISO(initialTo) : undefined,
   );
   const [idNumber, setIdNumber] = useState(initialIdNumber ?? "");

   function applyFilters(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      const params = new URLSearchParams();

      if (idNumber.trim()) params.set("idNumber", idNumber.trim());
      if (from) params.set("from", format(from, "yyyy-MM-dd"));
      if (to) params.set("to", format(to, "yyyy-MM-dd"));

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
   }

   function clearFilters() {
      setFrom(undefined);
      setTo(undefined);
      setIdNumber("");
      router.replace(pathname);
   }

   return (
      <div className="mb-2 overflow-x-auto p-1">
         <div className="flex items-center justify-between">
            <Button
               onClick={() => setShowFilter((prev) => !prev)}
               className={
                  "bg-white-primary flex items-center gap-2 text-black hover:bg-black/5"
               }
            >
               <span>
                  <ListFilter size={20} />
               </span>
               Filters
            </Button>
         </div>
         <form
            className={clsx(
               "mt-2 flex flex-wrap gap-2",
               !showFilter && "hidden",
            )}
            onSubmit={applyFilters}
         >
            <Input
               value={idNumber}
               onChange={(event) => setIdNumber(event.target.value)}
               placeholder="ID-Number"
               className="w-50 min-w-50"
            />
            <DatePicker label="from" date={from} setDate={setFrom} />-
            <DatePicker label="to" date={to} setDate={setTo} />
            <div className="flex gap-2">
               <Button
                  type="submit"
                  className="bg-green-primary flex items-center gap-1 rounded-md px-2 py-1 font-medium text-white shadow-sm"
               >
                  <span>
                     <FilterIcon size={20} />
                  </span>
                  Filter
               </Button>
               {(initialIdNumber || initialFrom || initialTo) && (
                  <Button
                     type="button"
                     onClick={clearFilters}
                     className="flex items-center gap-1 rounded-md bg-transparent px-2 py-1 font-medium text-black hover:bg-transparent"
                  >
                     <span>
                        <X size={20} />
                     </span>
                     Clear
                  </Button>
               )}
            </div>
         </form>
      </div>
   );
}
