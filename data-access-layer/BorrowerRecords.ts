import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";
import type { Result, BorrowerRecord } from "@/lib/types";

export async function getBorrowerRecords(): Promise<Result<BorrowerRecord[]>> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const records = await getCachedBorrowerRecords();
      return { ok: true, data: records };
   } catch (e) {
      console.error("Error on getStudentRecords()", e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         return {
            ok: false,
            error: "OTHER",
            message: `Database error (${e.code})`,
         };
      }
      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}

async function getCachedBorrowerRecords(): Promise<BorrowerRecord[]> {
   "use cache";
   cacheLife("minutes");

   return prisma.borrower.findMany({
      orderBy: { createdAt: "asc" },
   });
}
