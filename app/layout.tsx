import type { Metadata } from "next";
import { Inter, Funnel_Sans, Roboto } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { AuthProvider } from "./providers";
import { ToastContainer } from "react-toastify";

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
         className={clsx(
            funnelSans.variable,
            inter.variable,
            roboto.variable,
            "h-full antialiased",
         )}
      >
         <body className="flex min-h-full flex-col">
            <ToastContainer
               position="bottom-right"
               closeButton={false}
               closeOnClick
               toastClassName={"font-semibold"}
               pauseOnHover={false}
            />
            <AuthProvider>{children}</AuthProvider>
         </body>
      </html>
   );
}
