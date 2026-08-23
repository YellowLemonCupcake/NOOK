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
import { colleges } from "@/constants";

export type CollegeInfo = {
   shorthand: string;
   desc: string;
};

export default function CollegeDropdown({
   value,
   setCollege,
}: {
   value?: CollegeInfo | null;
   setCollege?: (college: CollegeInfo | null) => void;
}) {
   return (
      <div>
         <p className="mb-1 block text-xs text-gray-600">College</p>
         <Combobox
            items={colleges.filter((college) => college.shorthand !== "")}
            itemToStringValue={(college: (typeof colleges)[number]) =>
               college.shorthand
            }
            value={value}
            onValueChange={setCollege}
         >
            <ComboboxInput
               placeholder="Search colleges..."
               name="college"
               required
            />
            <ComboboxContent>
               <ComboboxEmpty>No colleges found.</ComboboxEmpty>
               <ComboboxList>
                  {(college: (typeof colleges)[number]) => (
                     <ComboboxItem
                        key={college.shorthand}
                        value={college.shorthand}
                     >
                        <Item size="xs" className="p-0">
                           <ItemContent>
                              <ItemTitle className="whitespace-nowrap">
                                 {college.shorthand}
                              </ItemTitle>
                              <ItemDescription>{college.desc}</ItemDescription>
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
