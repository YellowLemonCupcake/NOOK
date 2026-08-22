import { UserShield } from "lucide-react";
import ChangeEmail from "./_components/ChangeEmail";
import ChangePassword from "./_components/ChangePassword";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

async function Suspended() {
   const session = await auth();
   console.log(session);
   return <></>;
}

export default async function SettingsPage() {
   return (
      <div className="min-h-[calc(100dvh-85px)] min-w-50 bg-[#34A853] p-7 select-none">
         <Suspense>
            <Suspended />
         </Suspense>
         <div className="mx-auto max-w-100 pb-10">
            <p className="font-inter mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
               <span>
                  <UserShield />
               </span>
               Account
            </p>
            <ChangeEmail />
            <small className="text-white/80">(Not Final)</small>
            <ChangePassword />
         </div>
      </div>
   );
}
