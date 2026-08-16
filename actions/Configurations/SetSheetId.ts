"use server";
import { auth } from "@/lib/auth";
import { sheetsService } from "@/lib/googlesheetsapi";
import { prisma } from "@/lib/prisma";
import { GaxiosError } from "gaxios";

type ActionResult =
   | {
        success: false;
        error: string;
     }
   | {
        success: true;
        message: string;
        id: string;
     };

export default async function setSheetIdAction(
   id: string,
): Promise<ActionResult> {
   const newSpreadsheetId = id.trim();
   if (!newSpreadsheetId) {
      return { success: false, error: "Please provide an id" };
   }

   const session = await auth();
   if (!session?.user) {
      return { success: false, error: "Not authenticated" };
   }

   try {
      // Test the sheet
      const testRange = "A1";

      const existing = await sheetsService.spreadsheets.values.get({
         spreadsheetId: newSpreadsheetId,
         range: testRange,
      });
      const originalValue = existing.data.values?.[0]?.[0] ?? "";

      // Attempt the write
      await sheetsService.spreadsheets.values.update({
         spreadsheetId: newSpreadsheetId,
         range: testRange,
         valueInputOption: "RAW",
         requestBody: { values: [[originalValue]] },
      });

      await prisma.configuration.upsert({
         where: { adminAccountId: session.user.id },
         update: { speadsheetId: newSpreadsheetId },
         create: {
            speadsheetId: newSpreadsheetId,
            adminAccountId: session.user.id,
         },
      });

      return {
         success: true,
         message: "Successfully set Sheet ID",
         id: newSpreadsheetId,
      };
   } catch (err) {
      if (err instanceof GaxiosError) {
         const status = err.response?.status;
         const message = err.response?.data?.error?.message ?? err.message;

         switch (status) {
            case 403:
               return {
                  success: false,
                  error: "Permission denied — share the sheet with the service account email and grant it Editor access",
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

      console.error("Unexpected error setting Sheet ID:", err);
      return { success: false, error: "Something went wrong" };
   }
}
