// Reference: https://next-auth.js.org/configuration/nextjs#getserversession

import type {
   GetServerSidePropsContext,
   NextApiRequest,
   NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
               credentials.username !== "admin" &&
               credentials.password !== "admin123"
            ) {
               return null;
            }

            return { id: "1", name: "Library Admin" };
         },
      }),
   ],
   secret: process.env.AUTH_SECRET,
   session: { strategy: "jwt" },
} satisfies NextAuthOptions;

export function auth(
   ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
) {
   return getServerSession(...args, authOptions);
}
