import type { Metadata } from "next";
import { Inter, Funnel_Sans, Roboto, Geist } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { AuthProvider } from "./sessionProvider";
import { ToastContainer } from "react-toastify";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const funnelSans = Funnel_Sans({
   variable: "--font-funnel-sans",
   subsets: ["latin"],
});

const inter = Inter({
   variable: "--font-inter",
   subsets: ["latin"],
});
const roboto = Roboto({
   variable: "--font-roboto",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Nook",
   description: "", // TODO
};

export default function RootLayout({ children }: LayoutProps<"/">) {
   return (
      <html
         lang="en"
         className={cn(
            clsx(
               funnelSans.variable,
               inter.variable,
               roboto.variable,
               "h-full antialiased",
            ),
            "font-sans",
            geist.variable,
         )}
      >
         <body className="flex min-h-full flex-col">
            <ToastContainer
               position="bottom-right"
               closeButton={false}
               closeOnClick
               toastClassName={"font-semibold select-none"}
               pauseOnHover={false}
               autoClose={3000}
            />
            <AuthProvider>{children}</AuthProvider>
            <div id="portal-container"></div>
         </body>
      </html>
   );
}
