import StoreOwnerSidebar from "@/components/layout/StoreOwnerSidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔒 STORE OWNER ROLE GUARD
  if (!session) {
    redirect("/store-owner/login");
  }

  if (session.user.role !== "STORE_OWNER") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <StoreOwnerSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
