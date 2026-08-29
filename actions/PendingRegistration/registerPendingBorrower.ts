"use server";

import { borrowerRecordsPage, pendingBorrowerRecordPage } from "@/constants";
import { updateCachedPendingBorrowerRecordsCount } from "@/data-access-layer/PendingBorrowerRecords";
import { auth } from "@/lib/auth";
import getSpreadsheetId from "@/lib/getSpreadsheetId";
import { sheetsService } from "@/lib/googlesheetsapi";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { GaxiosError } from "gaxios";
import { revalidatePath } from "next/cache";

export default async function registerPendingBorrower(
   idNumber: string,
   name: string,
   yearLevel: number,
   program: string,
   college: string,
): Promise<Result<{ message: string }>> {
   const normalizedIdNumber = idNumber.trim();
   const normalizedName = name.trim();

   const session = await auth();
   if (!session?.user)
      return { ok: false, error: "AUTH", message: "Unauthorized" };

   try {
      const pendingRegistration = await prisma.pendingRegistration.findUnique({
         where: { idNumber: normalizedIdNumber },
      });
      if (!pendingRegistration)
         return {
            ok: false,
            error: "NOT_FOUND",
            message: "Pending registration for such id number doesn't exist",
         };

      const spreadsheetId = await getSpreadsheetId(session.user.id);

      const newRecord = await prisma.$transaction(
         async (tx) => {
            const record = await tx.borrower.create({
               data: {
                  idNumber: pendingRegistration.idNumber,
                  name: normalizedName,
                  yearLevel: program === "INSTRUCTOR" ? 0 : yearLevel,
                  program,
                  college,
               },
               select: { idNumber: true },
            });

            await tx.pendingRegistration.delete({
               where: { id: pendingRegistration.id },
            });

            await sheetsService.spreadsheets.values.batchUpdate({
               spreadsheetId,
               requestBody: {
                  valueInputOption: "USER_ENTERED",
                  data: pendingRegistration.tableRanges.map((range) => ({
                     range,
                     values: [
                        [
                           null,
                           null,
                           normalizedName,
                           program,
                           yearLevel,
                           college,
                        ],
                     ],
                  })),
               },
            });

            return record;
         },
         { timeout: 10000 },
      );

      revalidatePath(borrowerRecordsPage);
      revalidatePath(pendingBorrowerRecordPage);
      updateCachedPendingBorrowerRecordsCount();

      return {
         ok: true,
         data: { message: `Created ${newRecord.idNumber}` },
      };
   } catch (e) {
      if (e instanceof GaxiosError) {
         const status = e.response?.status;

         switch (status) {
            case 400:
               return {
                  ok: false,
                  error: "VALIDATION",
                  message:
                     "We couldn't complete the registration. Please check the borrower details and try again.",
               };
            case 403:
               return {
                  ok: false,
                  error: "FORBIDDEN",
                  message:
                     "We couldn't complete the registration right now. Please contact an administrator.",
               };
            case 404:
               return {
                  ok: false,
                  error: "NOT_FOUND",
                  message:
                     "We couldn't complete the registration right now. Please contact an administrator.",
               };
            case 429:
               return {
                  ok: false,
                  error: "RATE_LIMITED",
                  message:
                     "Registration is temporarily busy. Please try again shortly.",
               };
            default:
               console.error(
                  "Google Sheets API error:",
                  status,
                  e.response?.data,
               );
               return {
                  ok: false,
                  error: "OTHER",
                  message:
                     "We couldn't complete the registration right now. Please try again later.",
               };
         }
      }
      if (e instanceof PrismaClientKnownRequestError) {
         if (e.code === "P2002")
            return {
               ok: false,
               error: "CONFLICT",
               message: "Record with that ID Number already exists",
            };
         return { ok: false, error: "DATABASE", message: e.message };
      }
      console.error(e);
      return {
         ok: false,
         error: "OTHER",
         message: "Unexpected error occurred",
      };
   }
}
