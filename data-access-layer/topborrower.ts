import { PickEnumerable } from "@/generated/prisma/internal/prismaNamespace";
import { BorrowLogGroupByOutputType } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";

export type TopBorrowers = (PickEnumerable<
   BorrowLogGroupByOutputType,
   "idNumber"[]
> & {
   _count: {
      bookBarcode: number;
   };
})[];

export default async function getTopBorrowers(limit: number): Promise<
   Result<
      (PickEnumerable<BorrowLogGroupByOutputType, "idNumber"[]> & {
         _count: {
            bookBarcode: number;
         };
      })[]
   >
> {
   try {
      const top = await prisma.borrowLog.groupBy({
         by: ["idNumber"],
         _count: { bookBarcode: true },
         orderBy: { _count: { bookBarcode: "desc" } },
         take: limit,
      });
      return { ok: true, data: top };
   } catch (e) {
      console.error(e);
      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}
