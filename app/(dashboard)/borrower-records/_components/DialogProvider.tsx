"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";

const DialogRefContext = createContext<
   React.RefObject<HTMLDialogElement | null>
>({ current: null });

const ChangeDialogRefContext = createContext<
   (dialogRef: React.RefObject<HTMLDialogElement | null>) => void
>(() => {});

export function DialogProvider({ children }: { children: React.ReactNode }) {
   const currentDialog = useRef<HTMLDialogElement | null>(null);

   const changeDialogRef = (
      dialogRef: React.RefObject<HTMLDialogElement | null>,
   ) => {
      currentDialog.current = dialogRef.current;
   };

   useEffect(() => {
      const onKeydown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            currentDialog.current?.close();
         }
      };
      document.addEventListener("keydown", onKeydown);

      return () => {
         document.removeEventListener("keydown", onKeydown);
      };
   }, []);

   return (
      <DialogRefContext value={currentDialog}>
         <ChangeDialogRefContext value={changeDialogRef}>
            {children}
         </ChangeDialogRefContext>
      </DialogRefContext>
   );
}

export function useDialogRef() {
   return useContext(DialogRefContext);
}

export function useChangeDialogRef() {
   return useContext(ChangeDialogRefContext);
}
