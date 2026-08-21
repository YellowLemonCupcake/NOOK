"use client";

import axios from "axios";
import {
   Combobox,
   ComboboxContent,
   ComboboxEmpty,
   ComboboxInput,
   ComboboxItem,
   ComboboxList,
} from "@/components/ui/combobox";
import {
   Item,
   ItemContent,
   ItemDescription,
   ItemTitle,
} from "@/components/ui/item";
import { useEffect, useState } from "react";
import { offeredProgramsRoute } from "@/constants";

export type ProgramInfo = {
   campus: string;
   campus_desc: string;
   progcode: string;
   progdesc: string;
   shorthand: string;
};

export default function ProgramDropdown({
   value,
   setProgram,
}: {
   value?: ProgramInfo | null;
   setProgram?: (program: ProgramInfo | null) => void;
}) {
   const [programs, setPrograms] = useState<ProgramInfo[]>([]);

   useEffect(() => {
      (async () => {
         const { data } = await axios.get<ProgramInfo[]>(offeredProgramsRoute);
         const dataWithInstructor = [
            ...data,
            {
               campus: "MAIN",
               campus_desc: "CSU Main",
               progcode: "INSTRUCTOR",
               progdesc: "INSTRUCTOR",
               shorthand: "INSTRUCTOR",
            },
         ];
         setPrograms(dataWithInstructor);
      })();
   }, []);

   return (
      <div>
         <p className="mb-1 block text-xs text-gray-600">Program</p>
         <Combobox
            items={programs.filter((program) => program.campus === "MAIN")}
            itemToStringValue={(program: ProgramInfo) => program.progcode}
            value={value}
            onValueChange={setProgram}
         >
            <ComboboxInput
               placeholder="Search programs..."
               name="program"
               required
            />
            <ComboboxContent>
               <ComboboxEmpty>No programs found.</ComboboxEmpty>
               <ComboboxList>
                  {(program: ProgramInfo) => (
                     <ComboboxItem
                        key={program.progcode}
                        value={program.progcode}
                     >
                        <Item size="xs" className="p-0">
                           <ItemContent>
                              <ItemTitle className="whitespace-nowrap">
                                 {program.progcode}
                              </ItemTitle>
                              <ItemDescription>
                                 {program.progdesc}
                              </ItemDescription>
                           </ItemContent>
                        </Item>
                     </ComboboxItem>
                  )}
               </ComboboxList>
            </ComboboxContent>
         </Combobox>
      </div>
   );
}
