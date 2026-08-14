"use client";

import { signOut } from "next-auth/react";

export default function Logs() {
   return (
      <>
         <h1 className="text-4xl">Hi</h1>
         <button
            onClick={() => {
               signOut();
            }}
         >
            Log Out
         </button>
      </>
   );
}
