import type { Metadata } from "next";
import { Inter, Funnel_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { AuthProvider } from "./providers";

const funnelSans = Funnel_Sans({
   variable: "--font-funnel-sans",
   subsets: ["latin"],
});

const inter = Inter({
   variable: "--font-inter",
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
            "h-full antialiased",
         )}
      >
         <body className="flex min-h-full flex-col">
            <AuthProvider>{children}</AuthProvider>
         </body>
      </html>
   );
}
