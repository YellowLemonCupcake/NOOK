"use server";

import { settingsPage } from "@/constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";

export async function addCollege(
   college: string,
): Promise<Result<{ newCollege: string }>> {
   const session = await auth();

   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

   const normalized = college.toUpperCase().trim();
   try {
      const newCollege = await prisma.college.create({
         data: { collegeName: normalized, collegeAbbreviation: normalized },
         select: { collegeAbbreviation: true },
      });

      revalidatePath(settingsPage);
      return { ok: true, data: { newCollege: newCollege.collegeAbbreviation } };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002")
            return {
               ok: false,
               error: "CONFLICT",
               message: `${normalized} already exists`,
            };
         return { ok: false, error: "DATABASE", message: e.message };
      }
      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}

export async function removeCollege(
   collegeId: number,
): Promise<Result<{ message: string }>> {
   const session = await auth();
   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

   try {
      const deleted = await prisma.college.delete({
         where: { id: collegeId },
      });

      revalidatePath(settingsPage);
      return {
         ok: true,
         data: {
            message: `Successfully removed ${deleted.collegeAbbreviation}`,
         },
      };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2025")
            return {
               ok: false,
               error: "NOT_FOUND",
               message: "College not found",
            };
         if (e.code === "P2003")
            return {
               ok: false,
               error: "CONFLICT",
               message:
                  "Cannot delete this college — it still has programs under it. Remove those first.",
            };
         return { ok: false, error: "DATABASE", message: e.message };
      }
      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}
