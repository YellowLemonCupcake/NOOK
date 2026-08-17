import { Building, UserShield } from "lucide-react";
import ChangeEmail from "./_components/ChangeEmail";
import ChangePassword from "./_components/ChangePassword";

export default async function SettingsPage() {
   return (
      <div className="min-h-[calc(100dvh-85px)] bg-[#34A853] p-7 select-none">
         <div className="mx-auto max-w-100">
            <p className="font-inter mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
               <span>
                  <UserShield />
               </span>
               Account
            </p>
            <ChangeEmail />
            <ChangePassword />

            <p className="font-inter mt-10 mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
               <span>
                  <Building />
               </span>
               Colleges / Programs
            </p>
         </div>
      </div>
   );
}
