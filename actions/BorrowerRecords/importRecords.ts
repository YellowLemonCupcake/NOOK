"use server";

import { borrowerRecordsPage, importBorrowerRecordsPage } from "@/constants";
import { auth } from "@/lib/auth";
import { sheetsService } from "@/lib/googlesheetsapi";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";
import {
   PrismaClientKnownRequestError,
   PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import { GaxiosError } from "gaxios";
import { revalidatePath } from "next/cache";

export default async function importRecords(
   sheetName: string,
   range: string,
): Promise<Result<{ message: string }>> {
   const session = await auth();
   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

   const user = await prisma.adminAccount.findUnique({
      where: { id: session.user.id },
      select: { id: true, configuration: { select: { spreadsheetId: true } } },
   });
   if (!user?.configuration)
      return {
         ok: false,
         error: "NOT_FOUND",
         message: "Please provide a spreadsheet ID before continuing.",
      };
   try {
      const pendingRegistrationCount = await prisma.pendingRegistration.count();
      if (pendingRegistrationCount > 0)
         return {
            ok: false,
            error: "VALIDATION",
            message:
               "Please clear the pending registrations before continuing.",
         };

      const result = await sheetsService.spreadsheets.values.get({
         spreadsheetId: user.configuration.spreadsheetId,
         range: `${sheetName}!${range}`,
      });
      if (!result.data.values)
         return { ok: true, data: { message: "No result" } };

      const data = result.data.values.map((d) => ({
         idNumber: d[0],
         name: d[1],
         yearLevel: parseInt(d[2], 10),
         program: d[3],
         college: d[4],
      }));
      const { count } = await prisma.borrower.createMany({
         skipDuplicates: true,
         data,
      });

      revalidatePath(borrowerRecordsPage);
      revalidatePath(importBorrowerRecordsPage);
      return { ok: true, data: { message: `Imported ${count} record/s` } };
   } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
         console.error(e);
         return { ok: false, error: "DATABASE", message: "Prisma error" };
      }
      if (e instanceof PrismaClientValidationError) {
         return {
            ok: false,
            error: "DATABASE",
            message:
               "Couldn't import records. Check that the sheet name and range are correct and valid.",
         };
      }
      if (e instanceof GaxiosError) {
         const status = e.response?.status;
         if (status === 400) {
            return {
               ok: false,
               error: "VALIDATION",
               message:
                  "Couldn't import records. Check that the sheet name and range are correct and valid.",
            };
         }
         if (status === 404) {
            return {
               ok: false,
               error: "NOT_FOUND",
               message: "Spreadsheet or range doesn't exist",
            };
         }
         if (status === 403) {
            return {
               ok: false,
               error: "FORBIDDEN",
               message: "Service account doesn't have access to this sheet",
            };
         }
         if (status === 429) {
            return {
               ok: false,
               error: "RATE_LIMITED",
               message: "Too many requests",
            };
         }

         console.error("Sheets API error:", status, e.response?.data);
         return { ok: false, error: "OTHER", message: e.message };
      }
      console.error(e);
      return { ok: false, error: "OTHER", message: "Internal server error" };
   }
}
