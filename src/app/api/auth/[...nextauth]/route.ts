import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";
import User from "@/models/User";

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    // 👤 USER LOGIN (GOOGLE)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🛡️ ADMIN LOGIN (CREDENTIALS)
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

        // 1. Find user by email
        // We explicitly select 'password' and 'role' because password might be excluded by default
        const user = await User.findOne({
          email: credentials.email,
        }).select("+password +role");

        if (!user) return null;

        // 2. Check if user is ADMIN
        if (user.role !== "ADMIN") return null;

        // 3. Verify password (if set)
        // Note: You must seed this user manually or via script first!
        // For 'gowithporto' / 'gowithporto1234'
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

    // 🏪 STORE OWNER LOGIN (CREDENTIALS)
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
      
      // Allow updating session from client (e.g. after profile update)
      if (trigger === "update" && session?.user) {
          token.role = session.user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.storeId = token.storeId;
      session.user.storeName = token.storeName;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

