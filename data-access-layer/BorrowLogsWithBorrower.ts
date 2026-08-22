import { Prisma } from "@/generated/prisma/client";
import { BorrowerGetPayload, BorrowLogModel } from "@/generated/prisma/models";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";
import { cacheLife } from "next/cache";

type BorrowLogWithBorrower = BorrowLogModel & {
   borrower: BorrowerGetPayload<{
      select: {
         idNumber: true;
         name: true;
         program: true;
         college: true;
         yearLevel: true;
      };
   }> | null;
};

export default async function getLogsWithBorrower(): Promise<
   Result<BorrowLogWithBorrower[]>
> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const logsWithBorrower = await getCachedLogsWithBorrower();
      return { ok: true, data: logsWithBorrower };
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

async function getCachedLogsWithBorrower(): Promise<BorrowLogWithBorrower[]> {
   "use cache";
   cacheLife("minutes");

   const logs = await prisma.borrowLog.findMany();
   const idNumbers = [...new Set(logs.map((l) => l.idNumber))];
   const borrowers = await prisma.borrower.findMany({
      where: { idNumber: { in: idNumbers } },
      select: {
         idNumber: true,
         name: true,
         program: true,
         college: true,
         yearLevel: true,
      },
   });
   const borrowerMap = new Map(borrowers.map((b) => [b.idNumber, b]));
   return logs.map((log) => ({
      ...log,
      borrower: borrowerMap.get(log.idNumber) ?? null,
   }));
}
