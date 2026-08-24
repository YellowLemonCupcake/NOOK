import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";
import type { Result } from "@/lib/types";
import { BorrowLogModel } from "@/generated/prisma/models";

export async function getBorrowLogs(
   idNumber?: string,
   from?: Date,
   to?: Date,
): Promise<Result<BorrowLogModel[]>> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const logs = await getCachedBorrowLogs(idNumber, from, to);
      return { ok: true, data: logs };
   } catch (e) {
      console.error("Error on getBorrowLogs()", e);
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

async function getCachedBorrowLogs(
   idNumber?: string,
   from?: Date,
   to?: Date,
): Promise<BorrowLogModel[]> {
   "use cache";
   cacheLife("minutes");

   return prisma.borrowLog.findMany({
      where: {
         idNumber,
         ...(from || to
            ? {
                 date: {
                    gte: from,
                    lte: to,
                 },
              }
            : {}),
      },
      orderBy: {
         date: "desc",
      },
   });
}
