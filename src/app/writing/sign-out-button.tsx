"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-xs text-neutral-600 hover:text-white transition-colors"
    >
      Sign out
    </button>
  );
}
