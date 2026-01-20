"use client";

import { cn } from "@/utils/cn";
import {
    ArrowLeftOnRectangleIcon,
    BanknotesIcon,
    BuildingStorefrontIcon,
    CpuChipIcon,
    HomeIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Revenue", href: "/admin/revenue", icon: BanknotesIcon },
    { name: "Stores", href: "/admin/stores", icon: BuildingStorefrontIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
    { name: "AI Settings", href: "/admin/ai-settings", icon: CpuChipIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500"
                        aria-hidden="true"
                    />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
