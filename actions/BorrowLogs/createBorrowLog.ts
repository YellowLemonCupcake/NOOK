"use server";

import { logsPage, pendingBorrowerRecordPage } from "@/constants";
import { updateCachedPendingBorrowerRecordsCount } from "@/data-access-layer/PendingBorrowerRecords";
import { auth } from "@/lib/auth";
import { fetchBook, normalizeIsbn } from "@/lib/fetchBook";
import getSpreadsheetId from "@/lib/getSpreadsheetId";
import { sheetsService } from "@/lib/googlesheetsapi";
import { prisma } from "@/lib/prisma";
import toPHDateString from "@/lib/toPHDateString";
import { Result } from "@/lib/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { sheets_v4 } from "googleapis";
import { revalidatePath } from "next/cache";

export default async function createBorrowLog(
   idNumber: string,
   bookCode: string,
   isbn: string,
): Promise<Result<{ message: string }>> {
   const session = await auth();
   if (!session?.user)
      return {
         ok: false,
         error: "AUTH",
         message: "Unauthorized",
      };

   const dateNow = new Date();
   const phDateString = toPHDateString(dateNow);

   const normalizedISBN = normalizeIsbn(isbn);

   try {
      const book = normalizedISBN ? await fetchBook(normalizedISBN) : null;
      const existingBorrower = await prisma.borrower.findUnique({
         where: { idNumber: idNumber.trim() },
         select: { name: true, program: true, college: true, yearLevel: true },
      });
      const spreadsheetId = await getSpreadsheetId(session.user.id);
      if (!spreadsheetId)
         return {
            ok: false,
            error: "VALIDATION",
            message: "Please provide a spreadsheet ID before continuing.",
         };
      const appendResponse = await appendToCurrentMonthSheet(spreadsheetId, [
         [
            phDateString,
            idNumber,
            existingBorrower?.name,
            existingBorrower?.program,
            existingBorrower?.yearLevel,
            existingBorrower?.college,
            bookCode,
            book?.title,
            book?.authors,
         ],
      ]);
      if (!existingBorrower) {
         await prisma.pendingRegistration.upsert({
            create: {
               idNumber: idNumber.trim(),
               tableRanges: { set: [appendResponse?.range ?? ""] },
            },
            update: {
               tableRanges: { push: appendResponse?.range },
               lastBorrowDate: dateNow,
               timesBorrowed: { increment: 1 },
            },
            where: { idNumber },
         });
         revalidatePath(pendingBorrowerRecordPage);
         updateCachedPendingBorrowerRecordsCount();
      }

      await prisma.borrowLog.create({
         data: {
            date: dateNow,
            idNumber: idNumber.trim(),
            bookBarcode: bookCode,
            bookTitle: book?.title,
            bookAuthor: book?.authors,
         },
      });

      revalidatePath(logsPage);

      return {
         ok: true,
         data: {
            message: existingBorrower
               ? `Borrow logged for ${existingBorrower.name}.`
               : `Borrow logged. Borrower ${idNumber} is not yet registered — added to pending registration.`,
         },
      };
   } catch (e) {
      console.error(e);
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002") {
            return {
               ok: false,
               error: "DATABASE",
               message:
                  "A conflicting record already exists. Please try again.",
            };
         }
         if (e.code === "P2025") {
            return {
               ok: false,
               error: "DATABASE",
               message: "Related record not found.",
            };
         }
         return {
            ok: false,
            error: "DATABASE",
            message: `Database error (${e.code}).`,
         };
      }

      if (e instanceof Error) {
         return { ok: false, error: "OTHER", message: e.message };
      }

      return { ok: false, error: "OTHER", message: "Unexpected error" };
   }
}

async function getOrCreateMonthSheet(
   sheets: sheets_v4.Sheets,
   spreadsheetId: string,
): Promise<string> {
   const sheetName = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      month: "short",
   });

   const meta = await sheets.spreadsheets.get({ spreadsheetId });
   const exists = meta.data.sheets?.some(
      (s) => s.properties?.title === sheetName,
   );

   if (!exists) {
      const template = meta.data.sheets?.find(
         (s) => s.properties?.title === "TEMPLATE",
      );

      if (template?.properties?.sheetId !== undefined) {
         // Duplicate the styled template
         await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
               requests: [
                  {
                     duplicateSheet: {
                        sourceSheetId: template.properties.sheetId,
                        insertSheetIndex: meta.data.sheets?.length ?? 0,
                        newSheetName: sheetName,
                     },
                  },
               ],
            },
         });
      } else {
         // No template — fall back to a plain sheet + manual header row
         await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
               requests: [
                  {
                     addSheet: {
                        properties: { title: sheetName },
                     },
                  },
               ],
            },
         });
         await sheetsService.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:I`,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
               values: [
                  [
                     "Date",
                     "ID No.",
                     "Name",
                     "Course",
                     "Year Level",
                     "College",
                     "Book Barcode",
                     "TITLE",
                     "AUTHOR",
                     "CALL NUMBER",
                     "COPIES",
                  ],
               ],
            },
         });
      }
   }

   return sheetName;
}

async function appendToCurrentMonthSheet(
   spreadsheetId: string,
   values: (string | number)[][],
): Promise<{ range: string } | null> {
   let sheetName: string;
   try {
      sheetName = await getOrCreateMonthSheet(sheetsService, spreadsheetId);
   } catch (e) {
      console.error("Failed to get/create month sheet:", e);
      throw new Error("Could not prepare sheet for append");
   }

   try {
      const res = await sheetsService.spreadsheets.values.append({
         spreadsheetId,
         range: `${sheetName}!A:A`,
         valueInputOption: "USER_ENTERED",
         insertDataOption: "OVERWRITE",
         requestBody: { values },
      });

      return { range: res.data.updates?.updatedRange ?? "" };
   } catch (e) {
      console.error("Failed to append row:", e);
      throw new Error("Could not append data to sheet");
   }
}
