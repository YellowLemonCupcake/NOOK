"use client";

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
import { programs } from "@/constants";

export default function ProgramDropdown({
   value,
   setProgram,
}: {
   value?: (typeof programs)[number] | null;
   setProgram?: (program: (typeof programs)[number] | null) => void;
}) {
   return (
      <div>
         <p className="mb-1 block text-xs text-gray-600">Program</p>
         <Combobox
            items={programs}
            itemToStringValue={(p: (typeof programs)[number]) => p.progcode}
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
                  {(program: (typeof programs)[number]) => (
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
