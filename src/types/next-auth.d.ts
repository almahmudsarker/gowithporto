import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      storeId?: string;
      storeName?: string;
    };
  }

  interface User {
    role?: string;
    storeId?: string;
    storeName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    storeId?: string;
    storeName?: string;
  }
}
