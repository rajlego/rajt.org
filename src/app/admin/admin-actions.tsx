"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminActions({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAction(action: "approve" | "reject") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || `Failed to ${action}`);
        return;
      }

      router.refresh();
    } catch {
      alert(`Failed to ${action}. Check your connection.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium hover:bg-green-500 transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading}
        className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium hover:bg-red-900 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
