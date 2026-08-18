"use client";

import { removeCollege } from "@/actions/AdminSettings/College";
import {
   addProgram,
   removeProgram,
   renameProgram,
} from "@/actions/AdminSettings/Program";
import clsx from "clsx";
import { Check, LoaderCircle, Pencil, Trash2, X } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "react-toastify";

function AddProgram({ collegeId }: { collegeId: number }) {
   const onAction = async (_: string, formData: FormData) => {
      const program = ((formData.get("program") ?? "") as string).toUpperCase();
      const res = await addProgram(collegeId, program);
      if (res.ok) {
         toast.success(`Created ${res.data.newProgram} program`);
         return "";
      }
      toast.error(res.message);
      return program;
   };
   const [input, formAction, isPending] = useActionState(onAction, "");

   return (
      <form action={formAction} className="flex gap-2">
         <input
            type="text"
            name="program"
            className="font-inter w-full rounded-md border border-white/70 px-2 py-1 font-medium text-white uppercase outline-none"
            required
            defaultValue={input}
            placeholder="ADD PROGRAM"
            autoComplete="off"
         />
         {isPending ? (
            <span className="flex items-center p-2">
               <LoaderCircle className="animate-spin text-white" size={20} />
            </span>
         ) : (
            <button className="bg-yellow-primary font-roboto rounded-md px-4 py-2 text-sm font-medium text-black shadow-sm">
               <span>Add</span>
            </button>
         )}
      </form>
   );
}

function Program({ name, id }: { name: string; id: number }) {
   const [isDeleting, setIsDeleting] = useState(false);
   const [renaming, setRenaming] = useState(false);

   const onRemove = async () => {
      if (isDeleting) return;
      setIsDeleting(true);
      const loadingToast = toast.loading(`Deleting ${name}`);
      const res = await removeProgram(id);
      if (res.ok) {
         toast.update(loadingToast, {
            type: "success",
            render: `Deleted ${name}`,
            isLoading: false,
            autoClose: 3000,
         });
      } else {
         toast.update(loadingToast, {
            type: "error",
            render: res.message,
            isLoading: false,
            autoClose: 3000,
         });
      }
      setIsDeleting(true);
   };

   const onRename = async (_: unknown, formData: FormData) => {
      const newName = ((formData.get("name") ?? "") as string).toUpperCase();
      if (isPending || newName === name) return newName;
      const res = await renameProgram(id, newName);
      if (res.ok) {
         toast.success(`Program renamed to ${res.data.newName}`);
         setRenaming(false);
      } else toast.error(res.message);
      return newName;
   };
   const [currentName, renameAction, isPending] = useActionState(
      onRename,
      name,
   );
   return (
      <div
         className={clsx(
            "flex min-w-0 items-center gap-2 rounded-md bg-black/30 px-2 py-2 text-sm font-semibold text-white shadow-sm",
            renaming && "w-full",
         )}
      >
         {!renaming ? (
            <span className="truncate">{name}</span>
         ) : (
            <form
               action={renameAction}
               className="flex grow items-center gap-1"
            >
               <input
                  className="w-full uppercase outline-none"
                  name="name"
                  autoFocus
                  defaultValue={currentName}
                  required
                  autoComplete="off"
               />
               {!isPending ? (
                  <>
                     <button>
                        <Check type="submit" size={15} />
                     </button>
                     <button type="button" onClick={() => setRenaming(false)}>
                        <X size={15} />
                     </button>
                  </>
               ) : (
                  <span>
                     <LoaderCircle size={15} className="animate-spin" />
                  </span>
               )}
            </form>
         )}
         {!renaming && (
            <>
               <button onClick={() => setRenaming(true)}>
                  <Pencil size={15} />
               </button>
               <button onClick={onRemove}>
                  <Trash2 size={20} />
               </button>
            </>
         )}
      </div>
   );
}

export default function College({
   id,
   name,
   programs,
}: {
   id: number;
   name: string;
   programs: {
      id: number;
      programName: string;
      programAbbreviation: string;
      collegeId: number;
   }[];
}) {
   const [isDeleting, setisDeleting] = useState(false);
   const onDelete = async () => {
      if (isDeleting) return;
      setisDeleting(true);
      const loadingToast = toast.loading(`Deleting ${name}`);
      const res = await removeCollege(id);
      if (res.ok) {
         toast.update(loadingToast, {
            isLoading: false,
            render: `Deleted ${name}`,
            type: "success",
            autoClose: 3000,
         });
      } else {
         toast.update(loadingToast, {
            isLoading: false,
            render: res.message,
            type: "error",
            autoClose: 3000,
         });
      }
      setisDeleting(false);
   };
   return (
      <div className="relative mb-4 rounded-md border border-white/70 p-3">
         <button
            className="absolute top-1 right-1 text-white"
            onClick={onDelete}
         >
            <X size={20} />
         </button>
         <p className="font-inter mb-2 font-bold tracking-wider text-white">
            {name}
         </p>
         <div className="mb-3 flex flex-wrap gap-1">
            {programs.map((p) => (
               <Program key={p.id} id={p.id} name={p.programAbbreviation} />
            ))}
         </div>
         <AddProgram collegeId={id} />
      </div>
   );
}
