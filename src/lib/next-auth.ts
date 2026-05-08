import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./repositories";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "CMS Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user || !user.active || !("passwordHash" in user) || typeof user.passwordHash !== "string") return null;

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
};
