"use client";

import changeEmailAction from "@/actions/AdminSettings/ChangeEmail";
import { LoaderCircle, SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEvent, useActionState, useState } from "react";
import { toast } from "react-toastify";

export default function ChangeEmail() {
   const { status, data, update } = useSession();
   const [edited, setEdited] = useState<boolean>(false);

   const onAction = async (_: unknown, formData: FormData) => {
      if (!edited || isPending) return;
      const email = (formData.get("email") ?? "") as string;
      if (!email) return;
      const res = await changeEmailAction(email);
      if (res.ok) {
         await update({ email: res.data.newEmail });
         toast.success("Email updated");
      } else {
         toast.error(res.message);
      }
      setEdited(false);
   };

   const [, formAction, isPending] = useActionState(onAction, null);

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEdited(data?.user?.email !== e.target.value);
   };

   return (
      <form
         className="font-inter"
         action={formAction}
         onSubmit={(e) => {
            if (!edited) e.preventDefault();
         }}
      >
         <label
            htmlFor="email"
            className="font-inter text-white-primary mb-1 block text-sm font-medium"
         >
            Email
         </label>
         <div className="flex items-stretch gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-0.5">
            <span className="shrink-0 self-center">
               <Image
                  src={"/sms.svg"}
                  width={24}
                  height={24}
                  alt=""
                  className="size-auto"
               />
            </span>
            <input
               autoComplete="off"
               spellCheck={false}
               id="email"
               type="email"
               name="email"
               required
               defaultValue={data?.user?.email ?? ""}
               className="w-full py-2.5 text-sm outline-none"
               onChange={handleChange}
            />
            {isPending && (
               <span className="mr-2 self-center">
                  <LoaderCircle className="animate-spin" />
               </span>
            )}
         </div>
         {edited && (
            <button className="bg-yellow-primary font-roboto mt-2 flex w-full items-center justify-center gap-2 rounded-lg p-2 font-medium shadow-md hover:brightness-105 active:brightness-95">
               <span>
                  <SquarePen size={17} />
               </span>
               Change Email
            </button>
         )}
      </form>
   );
}
