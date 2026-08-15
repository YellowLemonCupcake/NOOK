"use server";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { compareData, hashData } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";

export default async function ChangePasswordAction(
   oldPassword: string,
   newPassword: string,
): Promise<{ status: "error"; message: string } | { status: "success" }> {
   if (newPassword.length < 8 || oldPassword.length < 8)
      return {
         status: "error",
         message: "Password must be at least 8 characters long",
      };

   try {
      const session = await auth();
      if (!session?.user?.id)
         return { status: "error", message: "Unauthorized" };

      const data = await prisma.adminAccount.findUnique({
         where: { id: session.user.id },
         select: { password: true },
      });

      if (!data?.password || !(await compareData(oldPassword, data?.password)))
         return { status: "error", message: "Current password is incorrect" };

      if (oldPassword === newPassword)
         return {
            status: "error",
            message:
               "New password must be different from your current password",
         };

      await prisma.adminAccount.update({
         where: { id: session.user.id },
         data: { password: await hashData(newPassword) },
      });

      return { status: "success" };
   } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         if (e.code === "P2025") {
            return { status: "error", message: "Account not found" };
         }
      }
      console.error(e);
      return { status: "error", message: "Unknown Error" };
   }
}
