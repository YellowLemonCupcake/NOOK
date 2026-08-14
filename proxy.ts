import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { adminLoginPage } from "./constants";

export default async function proxy(req: NextRequest) {
   const session = await auth();
   if (!session) {
      return NextResponse.redirect(new URL(adminLoginPage, req.url));
   }
   return NextResponse.next();
}

export const config = {
   matcher: ["/logs"],
};
