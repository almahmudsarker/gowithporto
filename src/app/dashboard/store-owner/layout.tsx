import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import StoreOwnerSidebar from "@/components/layout/StoreOwnerSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STORE_OWNER") {
    redirect("/store-owner/login");
  }

  return (
    <div className="flex min-h-screen">
      <StoreOwnerSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
