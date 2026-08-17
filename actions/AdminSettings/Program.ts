"use server";

import { settingsPage } from "@/constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";

export async function addProgram(
   collegeId: number,
   program: string,
): Promise<
   { success: true; program: string } | { success: false; error: string }
> {
   const session = await auth();
   if (!session?.user) return { success: false, error: "Unauthorized" };

   const normalized = program.toUpperCase().trim();
   try {
      const newProgram = await prisma.program.create({
         data: {
            programAbbreviation: normalized,
            programName: normalized,
            collegeId: collegeId,
         },
      });

      revalidatePath(settingsPage);
      return { success: true, program: newProgram.programAbbreviation };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002")
            return { success: false, error: `${normalized} already exists` };
         return { success: false, error: e.message };
      }
      return { success: false, error: "Unexpected error" };
   }
}

export async function removeProgram(
   programId: number,
): Promise<{ success: true } | { success: false; error: string }> {
   const session = await auth();
   if (!session?.user) return { success: false, error: "Unauthorized" };

   try {
      await prisma.program.delete({
         where: { id: programId },
      });

      revalidatePath(settingsPage);
      return { success: true };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2025")
            return { success: false, error: `Program not found` };
         if (e.code === "P2003")
            return {
               success: false,
               error: "Cannot delete this program — one or more borrowers are still linked to it. Remove or reassign them first.",
            };
         return { success: false, error: e.message };
      }
      return { success: false, error: "Unexpected error" };
   }
}

export async function renameProgram(
   programId: number,
   newName: string,
): Promise<
   { success: true; newName: string } | { success: false; error: string }
> {
   const normalized = newName.toUpperCase().trim();
   if (!normalized) return { success: false, error: "Please provide a name" };

   const session = await auth();
   if (!session?.user) return { success: false, error: "Unauthorized" };

   try {
      const res = await prisma.program.update({
         where: { id: programId },
         data: { programAbbreviation: normalized, programName: normalized },
         select: { programAbbreviation: true },
      });

      revalidatePath(settingsPage);
      return { success: true, newName: res.programAbbreviation };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002")
            return { success: false, error: `${normalized} already exists` };
         if (e.code === "P2025")
            return { success: false, error: "Program not found" };

         return { success: false, error: e.message };
      }
      return { success: false, error: "Unexpected error" };
   }
}
