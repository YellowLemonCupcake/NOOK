import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";
import type { Result } from "@/lib/types";
import { PendingRegistrationModel } from "@/generated/prisma/models";

export async function getPendingBorrowerRecords(): Promise<
   Result<PendingRegistrationModel[]>
> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const pendingRegistrations = await getCachedPendingBorrowerRecords();
      return { ok: true, data: pendingRegistrations };
   } catch (e) {
      console.error("Error on getPendingStudentRecords()", e);
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

async function getCachedPendingBorrowerRecords(): Promise<
   PendingRegistrationModel[]
> {
   "use cache";
   cacheLife("days");

   return prisma.pendingRegistration.findMany();
}

export async function getPendingBorrowerRecordsCount(): Promise<
   Result<number>
> {
   const session = await auth();
   if (!session?.user) {
      return { ok: false, error: "AUTH", message: "Unauthorized" };
   }

   try {
      const count = await getCachedPendingBorrowerRecordsCount();
      return { ok: true, data: count };
   } catch (e) {
      console.error("Error on getPendingBorrowerRecordsCount()", e);
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

async function getCachedPendingBorrowerRecordsCount() {
   "use cache";
   cacheLife("days");

   return await prisma.pendingRegistration.count();
}
