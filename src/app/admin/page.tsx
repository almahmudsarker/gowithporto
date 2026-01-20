"use client";

import {
  BanknotesIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  const stats = [
    {
      name: "Total Revenue",
      value: "$0.00",
      change: "+0% from last month",
      icon: BanknotesIcon,
      color: "bg-green-500",
    },
    {
      name: "Active Stores",
      value: "0",
      change: "+0 new stores",
      icon: BuildingStorefrontIcon,
      color: "bg-blue-500",
    },
    {
      name: "Total Orders",
      value: "0",
      change: "+0 today",
      icon: ShoppingBagIcon,
      color: "bg-purple-500",
    },
    {
      name: "Total Users",
      value: "0",
      change: "+0 new users",
      icon: UserGroupIcon,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session?.user?.name || "Admin"}. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center">
              <div className={`rounded-xl p-3 ${stat.color} bg-opacity-10`}>
                <stat.icon
                  className={`h-6 w-6 text-${stat.color.replace("bg-", "")}`}
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-green-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">Activity chart coming soon</p>
        </div>
      </div>
    </div>
  );
}
