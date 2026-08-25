import { LoaderCircle } from "lucide-react";

export default function Loading() {
   return (
      <div className="p-3 pb-25" aria-busy="true" aria-live="polite">
         <div className="bg-muted mb-2 h-8 w-24 animate-pulse rounded-md" />
         <div className="bg-muted mb-3 h-8 w-full animate-pulse rounded-md" />
         <div className="text-muted-foreground flex min-h-32 items-center justify-center text-sm">
            <LoaderCircle className="mr-2 animate-spin" size={18} />
            Loading logs...
         </div>
      </div>
   );
}
