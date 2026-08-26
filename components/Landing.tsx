"use client";
import { Nook2 } from "./Images";
import TopBorrowerTable from "./TopBorrowerTable";
//  https://herolearningcommons.vercel.app/

function TopBorrowers() {
   return (
      <div className="flex min-h-100 flex-col px-4 sm:px-10 md:min-h-auto">
         <p className="border-yellow-primary font-inter mb-2 border-l-8 px-2 text-xl font-bold">
            Top Borrowers
         </p>
         <div className="h-5 bg-[#34A853]/12"></div>
         <div className="bg-white-primary h-10 space-x-2 p-2 px-6"></div>
         <div className="grow bg-[#34A853]/12">
            <TopBorrowerTable
               topBorrowers={[
                  { _count: { bookBarcode: 20 }, idNumber: "241-01080" },
                  { _count: { bookBarcode: 18 }, idNumber: "241-01234" },
                  { _count: { bookBarcode: 15 }, idNumber: "241-01235" },
                  { _count: { bookBarcode: 13 }, idNumber: "241-01236" },
                  { _count: { bookBarcode: 12 }, idNumber: "241-01237" },
                  { _count: { bookBarcode: 8 }, idNumber: "241-01238" },
                  { _count: { bookBarcode: 5 }, idNumber: "241-01239" },
                  { _count: { bookBarcode: 3 }, idNumber: "241-01210" },
                  { _count: { bookBarcode: 2 }, idNumber: "241-01211" },
                  { _count: { bookBarcode: 1 }, idNumber: "241-01212" },
               ]}
            />
         </div>
      </div>
   );
}

export default function Landing() {
   return (
      <div className="my-auto grid grid-cols-1 gap-y-6 bg-white py-7 md:grid-cols-2">
         <div className="flex flex-col items-center space-y-7 px-4 py-8">
            <Nook2 width={331} height={142} />
            <p
               className="font-funnel-sans max-w-82.75 text-justify"
               style={{ fontSize: "14px", lineHeight: "18px" }}
            >
               <span className="text-green-primary font-bold">NOOK</span> stands
               for{" "}
               <span className="text-green-primary font-bold">
                  Navigate, Open, Obtain, Keep
               </span>
               . It is designed to make book borrowing faster, simpler, and more
               organized. It allows students and library staff to use book
               scanning and digital records to streamline the borrowing process
               while reducing manual logging.
            </p>
         </div>
         <TopBorrowers />
      </div>
   );
}
