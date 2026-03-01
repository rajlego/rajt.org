import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import Link from "next/link";
import { AdminActions } from "./admin-actions";

interface AccessRequest {
  id: string;
  email: string;
  name: string | null;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt: string | null;
}

export default async function AdminPage() {
  const session = await auth();

  if (
    !session?.user?.email ||
    session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    redirect("/");
  }

  const snapshot = await db
    .collection("access_requests")
    .orderBy("requestedAt", "desc")
    .get();

  const requests: AccessRequest[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<AccessRequest, "id">),
  }));

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-900 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold">
              Raj
            </Link>
            <span className="text-neutral-600">|</span>
            <span className="text-sm text-amber-500">Admin</span>
          </div>
          <Link
            href="/writing"
            className="text-sm text-neutral-400 hover:text-white"
          >
            Writing &rarr;
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-8">Access Requests</h1>

        {/* Pending */}
        <section className="mb-12">
          <h2 className="text-sm uppercase tracking-widest text-amber-500/60 mb-4">
            Pending ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className="text-neutral-600 text-sm">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-neutral-900 border border-neutral-800 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {r.name || r.email}
                    </p>
                    {r.name && (
                      <p className="text-sm text-neutral-500">{r.email}</p>
                    )}
                    <p className="text-xs text-neutral-600 mt-1">
                      Requested{" "}
                      {new Date(r.requestedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <AdminActions requestId={r.id} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved */}
        <section className="mb-12">
          <h2 className="text-sm uppercase tracking-widest text-green-500/60 mb-4">
            Approved ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p className="text-neutral-600 text-sm">No approved users yet</p>
          ) : (
            <div className="space-y-2">
              {approved.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-neutral-900/50 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm truncate">
                      {r.name ? `${r.name} (${r.email})` : r.email}
                    </p>
                  </div>
                  <span className="text-xs text-green-600">
                    {r.reviewedAt &&
                      new Date(r.reviewedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rejected */}
        {rejected.length > 0 && (
          <section>
            <h2 className="text-sm uppercase tracking-widest text-red-500/60 mb-4">
              Rejected ({rejected.length})
            </h2>
            <div className="space-y-2">
              {rejected.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-neutral-900/30 p-3"
                >
                  <p className="text-sm text-neutral-600 truncate">
                    {r.email}
                  </p>
                  <span className="text-xs text-red-900">
                    {r.reviewedAt &&
                      new Date(r.reviewedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
