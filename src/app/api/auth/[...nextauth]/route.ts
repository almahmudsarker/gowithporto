import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectDB } from "@/lib/mongodb";
import Store from "@/models/Store";

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
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

        const validPassword = await bcrypt.compare(
          credentials.password,
          store.passwordHash
        );

        if (!validPassword) return null;

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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.storeId = user.storeId;
        token.storeName = user.storeName;
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

  pages: {
    signIn: "/store-owner/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
