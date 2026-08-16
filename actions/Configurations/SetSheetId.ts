"use server";
import { configurationsPage } from "@/constants";
import { auth } from "@/lib/auth";
import { sheetsService } from "@/lib/googlesheetsapi";
import { prisma } from "@/lib/prisma";
import { GaxiosError } from "gaxios";
import { revalidatePath } from "next/cache";

type ReturnType =
   | {
        success: false;
        error: string;
     }
   | {
        success: true;
        message: string;
        id: string;
     };

export default async function SetSheedIdAction(
   id: string,
): Promise<ReturnType> {
   const newSpreadsheetId = id.trim();
   if (!newSpreadsheetId) {
      return { success: false, error: "Please provide an id" };
   }

   try {
      const res = await sheetsService.spreadsheets.get({
         spreadsheetId: newSpreadsheetId,
      });
      console.log(res);

      const session = await auth();
      if (!session?.user) {
         return { success: false, error: "" };
      }
      await prisma.adminAccount.update({
         where: { id: session?.user.id },
         data: {
            configuration: {
               upsert: {
                  create: { speadsheetId: newSpreadsheetId },
                  update: { speadsheetId: newSpreadsheetId },
               },
            },
         },
      });

      revalidatePath(configurationsPage);
      return {
         success: true,
         message: "Successfully set Sheet ID",
         id: newSpreadsheetId,
      };
   } catch (err) {
      // Claude helped me here. I had no time reading documentations
      if (err instanceof GaxiosError) {
         const status = err.response?.status;
         const message = err.response?.data?.error?.message ?? err.message;

         switch (status) {
            // case 400:
            //    return { success: false, error: `Invalid request: ${message}` };
            // case 401:
            //    return {
            //       success: false,
            //       error: "Authentication failed — check service account credentials",
            //    };
            case 403:
               return {
                  success: false,
                  error: "Permission denied — make sure the sheet is shared with the service account email",
               };
            case 404:
               return {
                  success: false,
                  error: "Sheet not found — check the Sheet ID",
               };
            case 429:
               return {
                  success: false,
                  error: "Rate limit exceeded — try again shortly",
               };
            default:
               return {
                  success: false,
                  error: `Google Sheets API error: ${message}`,
               };
         }
      }

      console.error("Unexpected error updating sheet:", err);
      return { success: false, error: "Something went wrong" };
   }
}
