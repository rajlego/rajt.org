import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { getPost, getAllPosts } from "@/lib/content";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";
import rehypeSanitize from "rehype-sanitize";
import { SignOutButton } from "../sign-out-button";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

async function renderMarkdown(content: string): Promise<string> {
  // Content comes from Raj's own markdown files in content/posts/,
  // but we sanitize anyway as defense-in-depth.
  const result = await remark().use(html).use(rehypeSanitize).process(content);
  return result.toString();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    const { slug } = await params;
    redirect(`/login?callbackUrl=/writing/${slug}`);
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

  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const sanitizedHtml = await renderMarkdown(post.content);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-900 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold">
              Raj
            </Link>
            <span className="text-neutral-600">|</span>
            <Link
              href="/writing"
              className="text-sm text-neutral-400 hover:text-white"
            >
              Writing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="mt-3 flex items-center gap-4">
            <time className="text-sm text-neutral-500">{post.date}</time>
            {post.tags.length > 0 && (
              <div className="flex gap-2">
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
          </div>
        </header>

        <div
          className="prose prose-invert prose-neutral max-w-none
            prose-headings:font-semibold
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        <div className="mt-12 pt-6 border-t border-neutral-900">
          <Link
            href="/writing"
            className="text-sm text-neutral-500 hover:text-white"
          >
            &larr; Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
