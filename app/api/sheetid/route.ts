import { auth } from "@/lib/auth";
import getSpreadsheetId from "@/lib/getSpreadsheetId";
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
      const spreadsheetId = await getSpreadsheetId(session.user.id);

      return NextResponse.json({
         status: "success",
         id: spreadsheetId,
      });
   } catch (e) {
      console.error(e);
      return NextResponse.json({ status: "error" });
   }
}
