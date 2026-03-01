"use client";

import { useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import Link from "next/link";

export default function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const reason =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("reason")
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!turnstileToken) {
      setMessage("Please complete the captcha.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, turnstileToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setMessage(data.message);
      setStatus("done");
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Request Access</h1>
        <p className="text-neutral-400 mb-8">
          {reason === "not-approved"
            ? "Your account hasn't been approved yet. If you haven't requested access, do so below."
            : "This is a private writing space. Enter your email to request access. I'll review and approve personally."}
        </p>

        {status === "done" ? (
          <div className="rounded-xl bg-green-950/50 border border-green-500/30 p-6 text-center">
            <p className="text-green-300 text-lg mb-2">{message}</p>
            <Link href="/" className="text-sm text-neutral-400 hover:text-white">
              Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-neutral-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-white focus:outline-none focus:border-neutral-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm text-neutral-400 mb-1">
                Name <span className="text-neutral-600">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-white focus:outline-none focus:border-neutral-600"
                placeholder="Your name"
              />
            </div>

            <TurnstileWidget onVerify={setTurnstileToken} />

            {status === "error" && (
              <p className="text-red-400 text-sm">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-lg bg-white text-black font-medium py-2.5 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Request Access"}
            </button>

            <p className="text-center text-sm text-neutral-500">
              Already approved?{" "}
              <Link href="/login" className="text-white hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
