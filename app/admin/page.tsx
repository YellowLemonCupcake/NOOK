import Image from "next/image";
import Login from "./LoginComponent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logsPage } from "@/constants";
import { Nook1, Nook2 } from "@/components/Images";

export default async function AdminLoginPage() {
   const session = await auth();
   if (session?.user) redirect(logsPage);

   return (
      <main className="flex select-none">
         <section className="relative hidden h-dvh grow items-center justify-center md:flex">
            <Image
               src={"/library.jpg"}
               alt=""
               width={1000}
               height={1000}
               className="absolute inset-0 size-full object-cover"
               loading="eager"
            />
            <div className="bg-green-primary/70 absolute inset-0" />
            <Nook1
               width={408}
               height={174}
               className="absolute inset-0 m-auto max-w-90 px-6"
            />
         </section>
         <Login />
      </main>
   );
}
