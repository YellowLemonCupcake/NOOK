import { Building, LoaderCircle, UserShield } from "lucide-react";
import ChangeEmail from "./_components/ChangeEmail";
import ChangePassword from "./_components/ChangePassword";
import AddCollege from "./_components/AddCollege";
import College from "./_components/College";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

async function Colleges() {
   const colleges = await prisma.college.findMany({
      include: { programs: true },
   });
   return colleges.map((c) => (
      <College
         key={c.id}
         id={c.id}
         name={c.collegeAbbreviation}
         programs={c.programs}
      />
   ));
}

export default async function SettingsPage() {
   return (
      <div className="min-h-[calc(100dvh-85px)] min-w-50 bg-[#34A853] p-7 select-none">
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

            <p className="font-inter mt-10 mb-4 flex items-center gap-2 text-2xl font-semibold text-white">
               <span>
                  <Building />
               </span>
               <span className="truncate">Colleges & Programs</span>
            </p>
            <AddCollege />
            <Suspense
               fallback={
                  <p className="font-inter text-white-primary/90 flex items-center justify-center gap-2 text-sm font-medium">
                     <span>
                        <LoaderCircle className="animate-spin" size={15} />
                     </span>
                     <span className="truncate">Loading</span>
                  </p>
               }
            >
               <Colleges />
            </Suspense>
         </div>
      </div>
   );
}
