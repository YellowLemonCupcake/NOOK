import { hashData } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
      const body = await req.json();
      if (!body.name || !body.email || !body.username || !body.password)
         return NextResponse.json({ status: "error" }, { status: 400 });

      const result = await prisma.adminAccount.create({
         data: {
            email: body.email,
            name: body.name,
            username: body.username,
            password: await hashData(body.password),
         },
      });

      return NextResponse.json({ status: "success", ...result });
   } catch (e) {
      console.error(e);
      return NextResponse.json({ status: "error" }, { status: 400 });
   }
}
