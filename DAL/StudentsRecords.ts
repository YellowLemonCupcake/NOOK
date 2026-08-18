import { Prisma } from "@/generated/prisma/client";
import { BorrowerGetPayload } from "@/generated/prisma/models";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Result } from "@/lib/types";

export async function getStudentRecords(): Promise<
   Result<BorrowerGetPayload<{ include: { college: true; program: true } }>[]>
> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const records = await prisma.borrower.findMany({
         include: { college: true, program: true },
      });
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
