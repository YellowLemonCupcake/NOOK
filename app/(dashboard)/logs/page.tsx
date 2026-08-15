import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const instant = false;
export default async function Logs() {
   const header = await headers();
   const res = await prisma.adminAccount.findMany();
   return (
      <>
         <p>{JSON.stringify(res)}</p>
      </>
   );
}
