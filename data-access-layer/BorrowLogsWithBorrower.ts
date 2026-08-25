import { Prisma } from "@/generated/prisma/client";
import { BorrowerGetPayload, BorrowLogModel } from "@/generated/prisma/models";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";
import { cacheLife } from "next/cache";

export const LOGS_PAGE_SIZE = 2;

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

export type PaginatedBorrowLogs = {
   logs: BorrowLogWithBorrower[];
   total: number;
};

export default async function getLogsWithBorrower(
   idNumber?: string,
   from?: Date,
   to?: Date,
   page = 1,
   pageSize = LOGS_PAGE_SIZE,
): Promise<Result<PaginatedBorrowLogs>> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const logsWithBorrower = await getCachedLogsWithBorrower(
         page,
         pageSize,
         idNumber,
         from,
         to,
      );
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

async function getCachedLogsWithBorrower(
   page: number,
   pageSize: number,
   idNumber?: string,
   from?: Date,
   to?: Date,
): Promise<PaginatedBorrowLogs> {
   "use cache";
   cacheLife("minutes");

   const where = {
      idNumber,
      ...(from || to
         ? {
              date: {
                 gte: from,
                 lte: to,
              },
           }
         : {}),
   };
   const [total, logs] = await Promise.all([
      prisma.borrowLog.count({ where }),
      prisma.borrowLog.findMany({
         where,
         orderBy: [{ date: "desc" }, { id: "desc" }],
         skip: (page - 1) * pageSize,
         take: pageSize,
      }),
   ]);

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
   return {
      total,
      logs: logs.map((log) => ({
         ...log,
         borrower: borrowerMap.get(log.idNumber) ?? null,
      })),
   };
}
