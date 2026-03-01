import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { getAllPosts } from "@/lib/content";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export default async function WritingPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/writing");
  }

  const email = session.user.email.toLowerCase();
  const isAdmin = email === process.env.ADMIN_EMAIL?.toLowerCase();

  if (!isAdmin) {
    const snap = await db
      .collection("access_requests")
      .where("email", "==", email)
      .where("status", "==", "approved")
      .get();

    if (snap.empty) {
      redirect("/request-access?reason=not-approved");
    }
  }

  // User is authenticated and approved — show content
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-900 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold">
              Raj
            </Link>
            <span className="text-neutral-600">|</span>
            <span className="text-sm text-neutral-400">Writing</span>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs text-amber-500 hover:text-amber-400"
              >
                Admin
              </Link>
            )}
            <span className="text-sm text-neutral-500">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">No posts yet.</p>
            <p className="text-neutral-600 text-sm mt-2">
              Check back soon — Raj is writing.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link
                  href={`/writing/${post.slug}`}
                  className="block hover:bg-neutral-900/50 -mx-4 px-4 py-4 rounded-lg transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-medium group-hover:text-white">
                      {post.title}
                    </h2>
                    <time className="text-sm text-neutral-600 whitespace-nowrap">
                      {post.date}
                    </time>
                  </div>
                  <p className="mt-2 text-neutral-400 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
