"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [mode, setMode] = useState<"choose" | "password" | "magic">("choose");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("callbackUrl") || "/writing"
      : "/writing";

  async function handleGoogle() {
    await signIn("google", { callbackUrl });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await signIn("resend", {
        email: magicEmail,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError("Failed to send magic link. Are you approved?");
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch {
      setError("Something went wrong.");
      setStatus("error");
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError("Invalid credentials or account not approved.");
        setStatus("error");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Log in</h1>
        <p className="text-neutral-400 mb-8">
          Access private writing on rajt.org
        </p>

        {mode === "choose" && (
          <div className="space-y-3">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-white text-black font-medium py-2.5 hover:bg-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            <button
              onClick={() => setMode("magic")}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
            >
              Magic link (email)
            </button>

            <button
              onClick={() => setMode("password")}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
            >
              Email + password
            </button>
          </div>
        )}

        {mode === "magic" && (
          <>
            {status === "sent" ? (
              <div className="rounded-xl bg-green-950/50 border border-green-500/30 p-6 text-center">
                <p className="text-green-300 mb-1">Check your email</p>
                <p className="text-sm text-neutral-400">
                  We sent a magic link to {magicEmail}
                </p>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label htmlFor="magic-email" className="block text-sm text-neutral-400 mb-1">
                    Email
                  </label>
                  <input
                    id="magic-email"
                    type="email"
                    required
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-white focus:outline-none focus:border-neutral-600"
                    placeholder="you@example.com"
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-white text-black font-medium py-2.5 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send magic link"}
                </button>
              </form>
            )}
            <button
              onClick={() => { setMode("choose"); setStatus("idle"); setError(""); }}
              className="mt-4 text-sm text-neutral-500 hover:text-white"
            >
              &larr; Back
            </button>
          </>
        )}

        {mode === "password" && (
          <>
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <label htmlFor="pw-email" className="block text-sm text-neutral-400 mb-1">
                  Email
                </label>
                <input
                  id="pw-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-white focus:outline-none focus:border-neutral-600"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="pw-password" className="block text-sm text-neutral-400 mb-1">
                  Password
                </label>
                <input
                  id="pw-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-white focus:outline-none focus:border-neutral-600"
                />
              </div>
              {status === "error" && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-white text-black font-medium py-2.5 hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <button
              onClick={() => { setMode("choose"); setStatus("idle"); setError(""); }}
              className="mt-4 text-sm text-neutral-500 hover:text-white"
            >
              &larr; Back
            </button>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
          <p className="text-sm text-neutral-500">
            Don&apos;t have access?{" "}
            <Link href="/request-access" className="text-white hover:underline">
              Request it here
            </Link>
          </p>
          <Link href="/" className="text-sm text-neutral-600 hover:text-white mt-2 block">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
