import axios from "axios";
import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      return NextResponse.json(await getOfferedPrograms());
   } catch (e) {
      console.error("Failed to fetch offered programs", e);
      return NextResponse.json(
         { error: "Failed to fetch offered programs" },
         { status: 502 },
      );
   }
}

async function getOfferedPrograms() {
   "use cache";
   cacheLife("weeks");

   const { data } = await axios.get(
      "https://myadmission.carsu.edu.ph/api/enrollment/admission/public/offeredprogram-list/undergrad",
      {
         headers: {
            Accept: "application/json",
            "User-Agent": "nook-programs-api/1.0",
         },
         timeout: 10_000,
      },
   );
   return data.data;
}
