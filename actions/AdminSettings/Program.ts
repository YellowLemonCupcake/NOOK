"use server";

import { settingsPage } from "@/constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";

export async function addProgram(
   collegeId: number,
   program: string,
): Promise<Result<{ newProgram: string }>> {
   const session = await auth();
   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

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
      return { ok: true, data: { newProgram: newProgram.programAbbreviation } };
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

export async function removeProgram(
   programId: number,
): Promise<Result<{ message: string }>> {
   const session = await auth();
   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

   try {
      const deleted = await prisma.program.delete({
         where: { id: programId },
         select: { programAbbreviation: true },
      });

      revalidatePath(settingsPage);
      return {
         ok: true,
         data: { message: `Deleted ${deleted.programAbbreviation}` },
      };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2025")
            return {
               ok: false,
               error: "NOT_FOUND",
               message: "Program not found",
            };
         if (e.code === "P2003")
            return {
               ok: false,
               error: "CONFLICT",
               message:
                  "Cannot delete this program — one or more borrowers are still linked to it. Remove or reassign them first.",
            };
         return { ok: false, error: "DATABASE", message: e.message };
      }
      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}

export async function renameProgram(
   programId: number,
   newName: string,
): Promise<Result<{ newName: string }>> {
   const normalized = newName.toUpperCase().trim();
   if (!normalized)
      return {
         ok: false,
         error: "VALIDATION",
         message: "Please provide a name",
      };

   const session = await auth();
   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

   try {
      const res = await prisma.program.update({
         where: { id: programId },
         data: { programAbbreviation: normalized, programName: normalized },
         select: { programAbbreviation: true },
      });

      revalidatePath(settingsPage);
      return { ok: true, data: { newName: res.programAbbreviation } };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002")
            return {
               ok: false,
               error: "CONFLICT",
               message: `${normalized} already exists`,
            };
         if (e.code === "P2025")
            return {
               ok: false,
               error: "NOT_FOUND",
               message: "Program not found",
            };

         return { ok: false, error: "DATABASE", message: e.message };
      }
      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}
