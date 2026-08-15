"use server";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ChangeEmailAction(
   newEmail: string,
): Promise<
   | { status: "error"; message: string }
   | { status: "success"; newEmail: string }
> {
   const normalizedNewEmail = newEmail.trim().toLowerCase();

   try {
      const session = await auth();
      if (!session?.user?.id)
         return { status: "error", message: "Unauthorized" };

      await prisma.adminAccount.update({
         where: { id: session.user.id },
         data: { email: normalizedNewEmail },
      });

      return { status: "success", newEmail: normalizedNewEmail };
   } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
         if (e.code === "P2002") {
            return { status: "error", message: "Email already in use" };
         }
         if (e.code === "P2025") {
            return { status: "error", message: "Account not found" };
         }
      }
      console.error(e);
      return { status: "error", message: "Unknown Error" };
   }
}
