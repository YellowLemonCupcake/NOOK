import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";

export default async function getSpreadsheetId(userId: string) {
   "use cache";
   cacheLife("days");
   cacheTag(`spreadsheetId:${userId}`);

   const configuration = await prisma.configuration.findUnique({
      where: { adminAccountId: userId },
   });

   return configuration?.spreadsheetId ?? "";
}
