import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { matchPassword } from "./password";
import prisma from "./prisma";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const user: any = await prisma.user.findFirstOrThrow({
          where: { email: credentials.email, deletedAt: null },
          include: { department: { include: { permissions: true } } }
        });

        const match = matchPassword(credentials.password, user.password);
        if (!match) return null;
        delete user.password;
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in"
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow all credentials logins
      if (account?.provider === "credentials") return true;

      // For social providers: check if user exists in your DB
      const existingUser:any = await prisma.user.findUnique({ where: { email: user.email! }, include: { department: { include: { permissions: true } } }, });

      if (!existingUser) {
        // Reject the sign-in
        throw new Error("NotInOrg");
      }
      Object.assign(user, existingUser);
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Attach the whole user object to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any; // Dynamically assign full user
      }
      return session;
    }
  }
};