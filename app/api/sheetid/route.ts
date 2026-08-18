import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<
   NextResponse<
      | {
           status: "success";
           id: string;
        }
      | { status: "error" }
   >
> {
   try {
      const session = await auth();
      if (!session?.user) return NextResponse.json({ status: "error" });
      const configuration = await prisma.configuration.findUnique({
         where: { adminAccountId: session.user.id },
      });

      return NextResponse.json({
         status: "success",
         id: configuration?.speadsheetId ?? "",
      });
   } catch (e) {
      console.error(e);
      return NextResponse.json({ status: "error" });
   }
}
