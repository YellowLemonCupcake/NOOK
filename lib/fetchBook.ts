import { GOOGLE_BOOKS_API_KEY } from "@/constants";
import axios from "axios";
import { cacheLife } from "next/cache";

export async function fetchBook(isbn: string) {
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

export function normalizeIsbn(isbn: string): string {
   return isbn.replace(/[-\s]/g, "");
}
