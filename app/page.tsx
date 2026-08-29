import { Library } from "@/components/Images";
import Landing from "@/app/_components/Landing";
import Nav from "./_components/Nav";

export default function Home() {
   return (
      <main className="relative top-14 flex min-h-[calc(100dvh-56px)] flex-col select-none">
         <Nav />
         <div className="fixed inset-0 -z-10">
            <Library className="absolute inset-0 size-full object-cover" />
            <div className="bg-green-primary/70 absolute inset-0" />
         </div>
         <Landing />
      </main>
   );
}
