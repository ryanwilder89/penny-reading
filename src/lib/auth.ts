import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const userRecord = await db.select().from(users).where(eq(users.email, credentials.email)).get();

        if (!userRecord || !userRecord.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, userRecord.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: userRecord.id,
          email: userRecord.email,
          name: userRecord.name,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        
        // Handle OAuth Sign In: Auto-create user if not exists
        if (account?.provider === "google") {
           const existingUser = await db.select().from(users).where(eq(users.email, user.email!)).get();
           if (!existingUser) {
             const newId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
             await db.insert(users).values({
               id: newId,
               email: user.email!,
               name: user.name || "",
               image: user.image || "",
             });
             token.id = newId;
           } else {
             token.id = existingUser.id;
           }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
