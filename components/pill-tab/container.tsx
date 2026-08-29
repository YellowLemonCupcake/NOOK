export function PillTabContainer({ children }: { children: React.ReactNode }) {
   return (
      <div className="overflow-x-auto">
         <div className="font-inter mb-2 grid min-w-65 grid-cols-2 gap-2 rounded-md bg-gray-100 p-1.5 select-none sm:flex sm:w-fit sm:min-w-0">
            {children}
         </div>
      </div>
   );
}
