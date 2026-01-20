"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface RevenueData {
  totalRevenue: number;
  revenueByStore: {
    storeId: string;
    storeName: string;
    total: number;
    orders: number;
  }[];
  dailyRevenue: {
    _id: string;
    total: number;
  }[];
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/revenue");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Could not load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Financial performance and analytics
        </p>
      </div>

      {/* Total Revenue Card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Lifetime Revenue</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          ${data.totalRevenue.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Stores Table */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Top Performing Stores
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Store</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.revenueByStore.length > 0 ? (
                  data.revenueByStore.map((store) => (
                    <tr key={store.storeId}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {store.storeName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{store.orders}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ${store.total.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">No sales yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Revenue List (Simple Chart Placeholder) */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Daily Revenue
          </h2>
          <div className="space-y-3">
            {data.dailyRevenue.length > 0 ? (
              data.dailyRevenue.map((day) => (
                <div key={day._id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-sm text-gray-600">{day._id}</span>
                  <span className="font-medium text-gray-900">${day.total.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No data for the last 30 days</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
