import { GOOGLE_BOOKS_API_KEY } from "@/constants";
import { auth } from "@/lib/auth";
import { Result } from "@/lib/types";
import axios, { AxiosError } from "axios";
import { cacheLife } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   req: NextRequest,
): Promise<NextResponse<Result<{ title: string; authors: string }>>> {
   const isbn = normalizeIsbn(req.nextUrl.searchParams.get("isbn") ?? "");
   if (!isbn)
      return NextResponse.json({
         ok: false,
         error: "VALIDATION",
         message: "Please provide an isbn in search params",
      });

   const session = await auth();
   if (!session?.user)
      return NextResponse.json({
         ok: false,
         error: "AUTH",
         message: "Unauthorized",
      });

   try {
      const data = await fetchBook(isbn);
      if (!data)
         return NextResponse.json({
            ok: false,
            error: "NOT_FOUND",
            message: "Not found",
         });

      return NextResponse.json({
         ok: true,
         data: { title: data.title, authors: data.authors },
      });
   } catch (e) {
      if (e instanceof AxiosError) {
         console.error(e);
         return NextResponse.json({
            ok: false,
            error: "OTHER",
            message: e.message,
         });
      }
      console.error(e);
      return NextResponse.json({
         ok: false,
         error: "OTHER",
         message: "Unexpected error",
      });
   }
}

async function fetchBook(isbn: string) {
   "use cache";
   cacheLife("weeks");

   const googleRes = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`,
   );

   if (googleRes.data.totalItems > 0) {
      const info = googleRes.data.items[0].volumeInfo;
      return {
         title: info.title,
         authors: (info.authors as string[])?.join(", ") ?? "",
      };
   }

   const openLibRes = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
   );
   const bookData = openLibRes.data[`ISBN:${isbn}`];
   if (!bookData) return null;

   return {
      title: bookData.title,
      authors: (bookData.authors ?? [])
         .map((a: { name: string }) => a.name)
         .join(", "),
   };
}

function normalizeIsbn(isbn: string): string {
   return isbn.replace(/[-\s]/g, "");
}
