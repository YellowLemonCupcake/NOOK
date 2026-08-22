"use client";

import clsx from "clsx";
import React from "react";

export default function Table({
   headers,
   children,
}: {
   headers: (React.ReactNode | string)[];
   children: React.ReactNode;
}) {
   return (
      <table className="font-inter w-full min-w-150 border-separate border-spacing-0">
         <thead className="bg-[#E8F5E9] text-sm font-bold select-none">
            <tr className="text-black/70">
               {headers.map((h, i) => (
                  <th
                     key={i}
                     className={clsx(
                        "border-b-green-primary border-b py-3",
                        i === 0 && "rounded-tl-xl",
                        i === headers.length - 1 && "rounded-tr-xl",
                     )}
                  >
                     {h}
                  </th>
               ))}
            </tr>
         </thead>
         <tbody className="text-sm text-gray-600">{children}</tbody>
      </table>
   );
}
