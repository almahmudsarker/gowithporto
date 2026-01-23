import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        }).select("+password +role");

        if (!user) return null;

        if (user.role !== "ADMIN") return null;

        if (!user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "ADMIN",
          image: user.image,
        };
      },
    }),

    CredentialsProvider({
      id: "store-owner-login",
      name: "StoreOwner",
      credentials: {
        storeCode: { label: "Store Code", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        await connectDB();

        const store = await Store.findOne({
          storeCode: credentials.storeCode,
          role: "STORE_OWNER",
          active: true,
        });

        if (!store) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          store.passwordHash
        );

        if (!valid) return null;

        return {
          id: store._id.toString(),
          role: "STORE_OWNER",
          storeId: store._id.toString(),
          storeName: store.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role ?? "USER";
        token.storeId = user.storeId;
        token.storeName = user.storeName;
      }
      
      if (trigger === "update" && session?.user) {
          token.role = session.user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
          session.user.role = token.role;
          session.user.storeId = token.storeId;
          session.user.storeName = token.storeName;
      }
      return session;
    },
  },
};
