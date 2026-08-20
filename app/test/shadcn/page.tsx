"use client";

import { useState } from "react";
import {
   Combobox,
   ComboboxContent,
   ComboboxEmpty,
   ComboboxInput,
   ComboboxItem,
   ComboboxList,
} from "@/components/ui/combobox";

type College = { shorthand: string; name: string };

const colleges: College[] = [
   { shorthand: "CEGS", name: "College of Engineering and Geosciences" },
   { shorthand: "CED", name: "College of Education" },
];

export default function CollegeDropdown() {
   const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

   return (
      <Combobox
         items={colleges}
         itemToStringValue={(c: College) => c.shorthand}
         itemToStringLabel={(c: College) => c.shorthand}
         value={selectedCollege}
         onValueChange={(selected) => {
            setSelectedCollege(selected);
         }}
      >
         <ComboboxInput placeholder="Search colleges..." />
         <ComboboxContent>
            <ComboboxEmpty>No colleges found.</ComboboxEmpty>
            <ComboboxList>
               {(c: College) => (
                  <ComboboxItem key={c.shorthand} value={c}>
                     {c.shorthand}
                  </ComboboxItem>
               )}
            </ComboboxList>
         </ComboboxContent>
      </Combobox>
   );
}
