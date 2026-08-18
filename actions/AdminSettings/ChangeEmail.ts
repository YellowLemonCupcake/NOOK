"use server";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";

export default async function changeEmailAction(
   newEmail: string,
): Promise<Result<{ newEmail: string }>> {
   const normalizedNewEmail = newEmail.trim().toLowerCase();

   try {
      const session = await auth();
      if (!session?.user?.id)
         return { ok: false, error: "AUTH", message: "Unauthorized" };

      await prisma.adminAccount.update({
         where: { id: session.user.id },
         data: { email: normalizedNewEmail },
      });

      return { ok: true, data: { newEmail: normalizedNewEmail } };
   } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         if (e.code === "P2002") {
            return {
               ok: false,
               error: "CONFLICT",
               message: "That email already exists",
            };
         }
         if (e.code === "P2025") {
            return {
               ok: false,
               error: "NOT_FOUND",
               message: "Account not found",
            };
         }
      }
      console.error(e);
      return { ok: false, error: "OTHER", message: "Unknown Error" };
   }
}
