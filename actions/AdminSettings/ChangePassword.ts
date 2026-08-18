"use server";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { compareData, hashData } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";

export default async function changePasswordAction(
   oldPassword: string,
   newPassword: string,
): Promise<Result<{ message: string }>> {
   if (newPassword.length < 8 || oldPassword.length < 8)
      return {
         ok: false,
         error: "VALIDATION",
         message: "Password must be at least 8 characters long",
      };

   try {
      const session = await auth();
      if (!session?.user?.id)
         return { ok: false, error: "AUTH", message: "Unauthorized" };

      const data = await prisma.adminAccount.findUnique({
         where: { id: session.user.id },
         select: { password: true },
      });

      if (!data?.password || !(await compareData(oldPassword, data?.password)))
         return {
            ok: false,
            error: "AUTH",
            message: "Incorrect current password.",
         };

      if (oldPassword === newPassword)
         return {
            ok: false,
            error: "VALIDATION",
            message:
               "New password must be different from your current password",
         };

      await prisma.adminAccount.update({
         where: { id: session.user.id },
         data: { password: await hashData(newPassword) },
      });

      return { ok: true, data: { message: "Password changed successfully" } };
   } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
