"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
// If lucide-react is not available, I can just use text. Let's assume it might not be and use simple loading text for now or verify later.
// Actually checking package.json, only @heroicons/react is there. I should use heroicons.

import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/admin/login");
            return;
        }

        if (session?.user?.role !== "ADMIN") {
            router.push("/"); // Or an unauthorized page
            return;
        }
    }, [session, status, router]);

    // Don't protect the login page itself within the layout if this guard wraps the layout
    // But usually Guard wraps the protected pages.
    // We'll handle login page exclusion in the layout or by not wrapping it.
    // Actually, if we put this in layout, it protects everything under /admin.
    // So /admin/login should probably be outside /admin layout or we check pathname.

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (session?.user?.role === "ADMIN") {
        return <>{children}</>;
    }

    return null;
}
