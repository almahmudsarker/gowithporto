import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getTransactions() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/transactions`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    return [];
  }
  return res.json();
}

async function getCredits() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/credits`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (!res.ok) return { credits: 0 };
  return res.json();
}

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const [transactions, creditData] = await Promise.all([
    getTransactions(),
    getCredits()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions & Credits</h1>
        <div className="bg-black text-white px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm opacity-80">Current Balance</p>
          <p className="text-xl font-bold">{creditData.credits} Credits</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8">Purchase History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-hidden border rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Added</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((t: any) => (
                <tr key={t._id}>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {t.currency.toUpperCase()} {(t.amount / 100).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-green-600 font-bold">
                    +{t.creditsAdded}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400 font-mono">
                    {t.stripeSessionId.slice(-10)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
