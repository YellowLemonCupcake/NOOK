"use client";

import { Copy, Link } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

export function AddSheetId() {
   return (
      <form className="font-inter max-w-138 select-none">
         <label
            htmlFor="sheetid"
            className="mb-2 flex items-center gap-2 text-xl font-medium text-gray-600"
         >
            <Image
               src={"/Google_Sheets_Logo.svg"}
               alt=""
               width={17}
               height={20}
               draggable={false}
               className="h-full"
            />
            <span className="self-end">Google Sheet ID</span>
         </label>
         <div className="flex items-stretch gap-1.5">
            <div className="flex w-full items-center rounded-lg border border-gray-400">
               <span className="m-2">
                  <Link size={18} />
               </span>
               <input
                  spellCheck={false}
                  type="text"
                  name="sheetid"
                  id="sheetid"
                  className="w-full self-stretch py-2 pr-2 focus:outline-0"
               />
            </div>
            <button className="bg-yellow-primary block rounded-lg px-4 py-2 text-sm font-medium shadow-sm">
               Save
            </button>
         </div>
         <p className="mt-2 text-sm text-gray-700">Instructions:</p>
         <ol className="mt-1 list-decimal space-y-1 pl-5 text-xs text-gray-700 select-text">
            <li>Open your Google Sheet and copy its URL.</li>
            <li>
               The Sheet ID is the long string of letters and numbers between
               <strong> /d/</strong> and <strong>/edit</strong> in the URL -
               e.g.{" "}
               <span className="break-all">
                  docs.google.com/spreadsheets/d/
                  <strong>1aBcD3fGhIjK...</strong>/edit
               </span>
            </li>
            <li>Paste that ID into the field above.</li>
            <li>
               Make sure the sheet is shared with this email{" "}
               <strong
                  className="cursor-pointer bg-gray-100 break-all hover:underline"
                  onClick={async () => {
                     await navigator.clipboard.writeText(
                        "nook-service@nook-505311.iam.gserviceaccount.com",
                     );
                     toast.info("Copied to clipboard");
                  }}
               >
                  nook-service@nook-505311.iam.gserviceaccount.com
                  <Copy size={10} className="mb-0.5 ml-0.5 inline" />
               </strong>{" "}
               with at least Editor access, or the API won&apos;t be able to
               modify it.
            </li>
         </ol>
      </form>
   );
}
