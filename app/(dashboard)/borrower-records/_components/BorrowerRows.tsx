"use client";

import { BorrowerRecord } from "@/lib/types";
import clsx from "clsx";
import { Edit, LoaderCircle, Trash2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useSidebar } from "../../_Sidebar/SidebarContextProvider";
import ProgramDropdown, { ProgramInfo } from "./ProgramDropdown";
import CollegeDropdown, { CollegeInfo } from "./CollegeDropdown";
import { useChangeDialogRef, useDialogRef } from "./DialogProvider";
import ReactDOM from "react-dom";
import useIsMounted from "@/lib/useIsMounted";

type EditInfo = {
   id: string;
   name: string;
   idNumber: string;
   yearLevel: number;
   program: string;
   college: string;
};

function BorrowerRow({
   number,
   borrowerRecord,
   onEdit,
}: {
   number: number;
   borrowerRecord: BorrowerRecord;
   onEdit: () => void;
}) {
   return (
      <tr className="text-center">
         <td className="py-2">{number}</td>
         <td className="py-2">{borrowerRecord.idNumber}</td>
         <td className="py-2">{borrowerRecord.name}</td>
         <td className="py-2">{borrowerRecord.program}</td>
         <td className="py-2">{borrowerRecord.yearLevel}</td>
         <td className="py-2">{borrowerRecord.college}</td>
         <td className="py-2">
            <button onClick={onEdit}>
               <Edit size={18} />
            </button>
         </td>
         <td className="py-2">
            <button>
               <Trash2 size={18} />
            </button>
         </td>
      </tr>
   );
}

export default function BorrowerRecords({
   records,
}: {
   records: BorrowerRecord[];
}) {
   const editRecordDialogRef = useRef<HTMLDialogElement>(null);
   const { desktop } = useSidebar();
   const currentDialog = useDialogRef();
   const changeCurrentDialog = useChangeDialogRef();

   const [infos, setInfos] = useState<EditInfo>({
      id: "",
      name: "",
      idNumber: "",
      yearLevel: 1,
      program: "",
      college: "",
   });
   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setInfos((prev) =>
         name === "yearLevel"
            ? { ...prev, yearLevel: Number(value) }
            : { ...prev, [name]: value },
      );
   };

   const editNewRow = (info: EditInfo) => {
      if (
         // editRecordDialogRef.current === currentDialog.current &&
         // editRecordDialogRef.current?.open
         currentDialog.current?.open &&
         currentDialog.current !== editRecordDialogRef.current
      )
         return;

      setInfos(info);
      currentDialog.current?.close();
      editRecordDialogRef.current?.show();
      changeCurrentDialog(editRecordDialogRef);
   };
   const closeDialog = () => {
      editRecordDialogRef.current?.close();
   };

   const isMounted = useIsMounted();
   return (
      <>
         {records.map((record, i) => (
            <BorrowerRow
               key={record.id}
               number={i + 1}
               borrowerRecord={record}
               onEdit={() =>
                  editNewRow({
                     id: record.id,
                     college: record.college,
                     idNumber: record.idNumber,
                     name: record.name,
                     program: record.program,
                     yearLevel: record.yearLevel,
                  })
               }
            />
         ))}
         {isMounted &&
            ReactDOM.createPortal(
               <dialog
                  ref={editRecordDialogRef}
                  className={clsx(
                     "bg-white-primary fixed inset-y-0 m-auto w-[calc(100%-12px)] max-w-125 rounded-xl shadow-md transition-[left] select-none backdrop:bg-transparent",
                     desktop && "md:left-81",
                  )}
               >
                  <div className="font-inter text-white-primary rounded-t-lg bg-blue-400 px-5 py-3 font-medium">
                     Edit record
                  </div>
                  <form
                     // action={formAction}
                     onSubmit={(e) => {
                        // if (isPending)
                        e.preventDefault();
                        console.log(infos);
                     }}
                     className="flex flex-col items-stretch gap-y-3 p-5 pb-4"
                  >
                     <div className="flex gap-2">
                        <label htmlFor="idnumber" className="grow">
                           <span className="mb-1 block text-xs text-gray-600">
                              ID Number
                           </span>
                           <p className="font-inter w-full rounded-md py-2 font-bold tracking-wider text-gray-600">
                              {infos.idNumber}
                           </p>
                        </label>
                        <label htmlFor="yearLevel" className="self-start">
                           <span className="mb-1 block text-xs text-gray-600">
                              Year Level
                           </span>
                           <input
                              type="number"
                              min={1}
                              max={6}
                              value={infos.yearLevel}
                              onChange={handleChange}
                              id="yearLevel"
                              name="yearLevel"
                              className="font-inter w-full rounded-md p-2 outline-1 outline-gray-200"
                              spellCheck={false}
                              autoComplete="off"
                              required
                           />
                        </label>
                     </div>
                     <label htmlFor="name">
                        <span className="mb-1 block text-xs text-gray-600">
                           Name
                        </span>
                        <input
                           type="text"
                           id="name"
                           name="name"
                           placeholder="Dela Cruz, Juan S. Jr."
                           className="font-inter w-full rounded-md p-2 outline-1 outline-gray-200"
                           spellCheck={false}
                           value={infos.name}
                           onChange={handleChange}
                           autoComplete="off"
                           required
                        />
                     </label>
                     <ProgramDropdown
                        value={infos.program as unknown as ProgramInfo}
                        setProgram={(program) => {
                           setInfos((prev) => ({
                              ...prev,
                              program: program as unknown as string,
                           }));
                        }}
                     />
                     <CollegeDropdown
                        value={infos.college as unknown as CollegeInfo}
                        setCollege={(college) => {
                           setInfos((prev) => ({
                              ...prev,
                              college: college as unknown as string,
                           }));
                        }}
                     />
                     <div className="mt-2 flex flex-wrap-reverse items-center justify-end gap-3 self-end">
                        <button
                           type="button"
                           onClick={closeDialog}
                           className="rounded-md bg-black/5 px-4 py-2 shadow-sm"
                        >
                           Cancel
                        </button>
                        <button
                           // disabled={isPending}
                           className="flex items-center justify-center rounded-md bg-blue-400 px-4 py-2 text-white shadow-sm"
                        >
                           {false ? (
                              <LoaderCircle className="animate-spin text-black/70" />
                           ) : (
                              "Edit"
                           )}
                        </button>
                     </div>
                  </form>
               </dialog>,
               document.getElementById("portal-container")!,
            )}
      </>
   );
}
