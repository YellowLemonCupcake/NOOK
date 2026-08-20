import { Plus } from "lucide-react";

export default function AddRecord() {
   return (
      <>
         <button className="bg-green-primary text-white-primary outline-green-primary fixed right-5 bottom-10 rounded-lg p-2.5 shadow-sm outline-offset-2 transition-[scale] focus-visible:outline-2 active:scale-95 lg:right-10 lg:bottom-15">
            <Plus />
         </button>
      </>
   );
}
