import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
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

      <div className="space-y-4">
        {history.map((item: any) => (
          <details key={item._id} className="group border rounded-lg bg-white overflow-hidden shadow-sm">
            <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 bg-gray-50 transition-colors list-none">
              <div>
                <p className="font-semibold text-lg">Plan generated on {new Date(item.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-1">{item._id}</p>
              </div>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-4 border-t border-gray-100 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-gray-700 uppercase mb-2">My Input</h3>
                <pre className="p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap font-sans text-gray-700">
                  {JSON.stringify(item.prompt, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-700 uppercase mb-2">AI Response</h3>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded text-sm text-gray-800 space-y-2">
                  {/* Basic rendering of the response object nicely */}
                  {Object.entries(item.response).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <div className="ml-2 mt-1">
                        {typeof value === 'object' ? (
                          <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                        ) : (
                          <p>{String(value)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
