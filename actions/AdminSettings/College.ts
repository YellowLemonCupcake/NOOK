"use server";

import { settingsPage } from "@/constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";

export async function addCollege(college: string): Promise<
   | {
        success: true;
        college: string;
     }
   | { success: false; error: string }
> {
   const session = await auth();

   if (!session?.user) return { success: false, error: "Unauthorized" };

   const normalized = college.toUpperCase().trim();
   try {
      const newCollege = await prisma.college.create({
         data: { collegeName: normalized, collegeAbbreviation: normalized },
         select: { collegeAbbreviation: true },
      });

      revalidatePath(settingsPage);
      return { success: true, college: newCollege.collegeAbbreviation };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002")
            return { success: false, error: `${normalized} already exists` };
         return { success: false, error: e.message };
      }
      return { success: false, error: "Unexpected error" };
   }
}

export async function removeCollege(
   collegeId: number,
): Promise<{ success: true } | { success: false; error: string }> {
   const session = await auth();
   if (!session?.user) return { success: false, error: "Unauthorized" };

   try {
      await prisma.college.delete({
         where: { id: collegeId },
      });

      revalidatePath(settingsPage);
      return { success: true };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2025")
            return { success: false, error: "College not found" };
         if (e.code === "P2003")
            return {
               success: false,
               error: "Cannot delete this college — it still has programs under it. Remove those first.",
            };
         return { success: false, error: e.message };
      }
      return { success: false, error: "Unexpected error" };
   }
}
