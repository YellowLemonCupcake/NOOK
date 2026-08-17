"use client";
import { addCollege } from "@/actions/AdminSettings/College";
import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { toast } from "react-toastify";

export default function AddCollege() {
   const onAction = async (_: unknown, formData: FormData) => {
      const college = ((formData.get("college") ?? "") as string).toUpperCase();
      const res = await addCollege(college);

      if (!res.success) {
         toast.error(res.error);
         return college;
      } else {
         toast.success(`Created ${res.college} college`);
         return "";
      }
   };
   const [input, formAction, isPending] = useActionState(onAction, "");
   return (
      <div className="font-inter mb-5 rounded-md font-medium text-white">
         <p className="mb-1 text-sm font-medium">Add College</p>
         <form action={formAction} className="flex gap-2">
            <input
               type="text"
               name="college"
               className="font-inter w-full rounded-md border border-white/70 px-2 py-1 font-medium uppercase outline-none"
               required
               defaultValue={input}
               autoComplete="off"
            />
            {isPending ? (
               <span className="flex items-center p-2">
                  <LoaderCircle className="animate-spin" size={20} />
               </span>
            ) : (
               <button className="bg-yellow-primary font-roboto rounded-md px-4 py-2 text-sm font-medium text-black shadow-sm">
                  <span>Add</span>
               </button>
            )}
         </form>
      </div>
   );
}
