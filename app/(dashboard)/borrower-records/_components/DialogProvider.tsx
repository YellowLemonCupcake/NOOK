"use client";

import React, { createContext, useContext, useRef } from "react";

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
