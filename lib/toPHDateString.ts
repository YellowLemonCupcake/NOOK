export default function toPHDateString(date: Date) {
   return date.toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
   });
}
