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
import { cache } from "react";
import { prisma } from "./prisma";
import { compareData } from "./bcrypt";

export const authOptions = {
   providers: [
      // Credentials Auth provider
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
         // Authorization logic
         async authorize(credentials) {
            if (!credentials?.password || !credentials.username) {
               return null;
            }
            const user = await prisma.adminAccount.findUnique({
               where: { username: credentials.username },
            });
            if (
               !user ||
               !(await compareData(credentials.password, user.password))
            ) {
               return null;
            }
            return { id: user.id, email: user.email, name: user.name };
         },
      }),
      // Google auth provider
      GoogleProvider({
         clientId: process.env.AUTH_GOOGLE_CLIENT!,
         clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      }),
   ],
   callbacks: {
      // Signin
      async signIn({ user, account }) {
         if (account?.provider === "google" && user.email) {
            const userFromDb = await prisma.adminAccount.findUnique({
               where: { email: user.email },
               select: { id: true },
            });

            return !!userFromDb;
         }
         return true;
      },
      // JWT
      async jwt({ user, account, token, session, trigger }) {
         if (user) {
            token.id = user.id;
         }

         if (trigger === "update" && session) {
            if (session.email) {
               token.email = session.email;
            }
         }

         if (
            trigger === "signIn" &&
            user?.email &&
            account?.provider === "google"
         ) {
            const userFromDb = await prisma.adminAccount.findUnique({
               where: { email: user.email },
               select: { id: true, name: true },
            });
            if (userFromDb) token.name = userFromDb.name;
         }

         return token;
      },
      // Session
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.id as string;
            session.user.name = token.name;
            session.user.email = token.email;
         }
         return session;
      },
   },
   // More configurations
   secret: process.env.AUTH_SECRET,
   session: { strategy: "jwt" },
   pages: {
      signIn: adminLoginPage,
      error: adminLoginPage,
      signOut: adminLoginPage,
   },
} satisfies NextAuthOptions;

function _auth(
   ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
) {
   return getServerSession(...args, authOptions);
}

export const auth = cache(_auth);
