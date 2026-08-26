import { prisma } from "@/lib/prisma";

type TopBorrower = {
   idNumber: string;
   _count: { bookBarcode: number };
};

async function getTopBorrowers(limit: number): Promise<TopBorrower[]> {
   const top = await prisma.borrowLog.groupBy({
      by: ["idNumber"],
      _count: { bookBarcode: true },
      orderBy: { _count: { bookBarcode: "desc" } },
      take: limit,
   });
   return top;
}

const RANK_STYLES: Record<number, string> = {
   0: "bg-amber-100 text-amber-800",
   1: "bg-neutral-200 text-neutral-700",
   2: "bg-orange-100 text-orange-800",
};

export default async function TopBorrowers({ limit = 10 }: { limit?: number }) {
   const borrowers = await getTopBorrowers(limit);

   const maxCount = borrowers[0]?._count.bookBarcode ?? 1;

   return (
      <div className="rounded-xl border border-neutral-200 bg-white">
         <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <h2 className="text-sm font-medium text-neutral-900">
               Top borrowers
            </h2>
            <span className="text-xs text-neutral-500">
               Last {limit} ranked by books borrowed
            </span>
         </div>

         {borrowers.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-neutral-500">
               No borrow activity yet.
            </div>
         ) : (
            <ul className="divide-y divide-neutral-100">
               {borrowers.map((borrower, i) => {
                  const count = borrower._count.bookBarcode;
                  const widthPct = Math.max((count / maxCount) * 100, 6);

                  return (
                     <li
                        key={borrower.idNumber}
                        className="flex items-center gap-4 px-5 py-3"
                     >
                        <span
                           className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                              RANK_STYLES[i] ??
                              "bg-neutral-100 text-neutral-500"
                           }`}
                        >
                           {i + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                           <p className="truncate text-sm font-medium text-neutral-900">
                              {borrower.idNumber}
                           </p>
                           <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                              <div
                                 className="h-full rounded-full bg-neutral-800"
                                 style={{ width: `${widthPct}%` }}
                              />
                           </div>
                        </div>

                        <span className="shrink-0 text-sm text-neutral-600 tabular-nums">
                           {count} {count === 1 ? "book" : "books"}
                        </span>
                     </li>
                  );
               })}
            </ul>
         )}
      </div>
   );
}
