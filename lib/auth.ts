// Reference: https://next-auth.js.org/configuration/nextjs#getserversession

import { adminLoginPage } from "@/constants";
import type {
   GetServerSidePropsContext,
   NextApiRequest,
   NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
   providers: [
      CredentialsProvider({
         credentials: {
            username: {
               type: "text",
               required: true,
            },
            password: {
               type: "password",
               required: true,
            },
         },
         async authorize(credentials) {
            // Temporary logic
            if (!credentials?.password || !credentials.username) {
               return null;
            }
            if (
               credentials.username !== "admin" ||
               credentials.password !== "admin123"
            ) {
               return null;
            }

            return { id: "1", name: "Library Admin" };
         },
      }),
      GoogleProvider({
         clientId: process.env.AUTH_GOOGLE_CLIENT!,
         clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      }),
   ],
   callbacks: {
      async signIn({ account }) {
         if (account?.provider === "google") return false;
         return true;
      },
   },
   secret: process.env.AUTH_SECRET,
   session: { strategy: "jwt" },
   pages: {
      signIn: adminLoginPage,
      error: adminLoginPage,
      signOut: adminLoginPage,
   },
} satisfies NextAuthOptions;

export function auth(
   ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
) {
   return getServerSession(...args, authOptions);
}
