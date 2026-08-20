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

const colleges = [
   {
      shorthand: "CEGS",
      desc: "College of Engineering and Geosciences",
   },
   {
      shorthand: "CED",
      desc: "College of Education",
   },
   {
      shorthand: "CFES",
      desc: "College of Forestry and Environmental Science",
   },
   {
      shorthand: "CMNS",
      desc: "College of Mathematics and Natural Sciences",
   },
   {
      shorthand: "CCIS",
      desc: "College of Computing and Information Sciences",
   },
   {
      shorthand: "CAA",
      desc: "College of Agriculture and Agri-Industries",
   },
   {
      shorthand: "CHASS",
      desc: "College of Humanities and Social Sciences",
   },
   {
      shorthand: "CM",
      desc: "College of Medicine",
   },
];

export function CollegeDropdown() {
   return (
      <div>
         <p className="mb-1 block text-xs text-gray-600">College</p>
         <Combobox
            items={colleges.filter((college) => college.shorthand !== "")}
            itemToStringValue={(college: (typeof colleges)[number]) =>
               college.shorthand
            }
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
