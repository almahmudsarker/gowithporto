import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getAIHistory() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/ai-history`, {
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

export default async function AIHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const history = await getAIHistory();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI History</h1>
      <p className="text-gray-600">Review your past AI-generated plans.</p>

      {history.length === 0 && <p>No AI history found.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {history.map((item: any) => (
          <Link
            key={item._id}
            href={`/ai/result?id=${item._id}`}
            className="block p-5 border rounded-xl hover:shadow-md hover:border-blue-300 transition-all bg-white group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                  Trip to Porto
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-blue-500 text-sm font-medium">View Plan &rarr;</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded-md border">
                {item.prompt.days} Days
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-md border">
                {item.prompt.budget}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-md border">
                {item.prompt.people}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
