import Link from "next/link";

export const metadata = {
  title: "About - Raj Thimmiah",
  description: "About Raj Thimmiah - building tools for thought and exploring AI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Raj
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/projects"
              className="text-white/60 transition-colors hover:text-white"
            >
              Projects
            </Link>
            <Link href="/about" className="text-white">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <h1 className="mb-8 text-4xl font-bold">About</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-white/80 leading-relaxed">
            I&apos;m Raj Thimmiah, a software engineer passionate about building
            tools for thought, exploring the frontiers of AI, and creating
            software that&apos;s both beautiful and functional.
          </p>

          <h2 className="mt-12 mb-4 text-2xl font-semibold text-white">
            What I Do
          </h2>
          <p className="text-white/80 leading-relaxed">
            I build desktop and web applications with a focus on offline-first
            architecture, beautiful UI, and thoughtful user experience. My tech
            stack typically includes Tauri, React, TypeScript, and various CRDT
            implementations for real-time sync.
          </p>

          <h2 className="mt-12 mb-4 text-2xl font-semibold text-white">
            Interests
          </h2>
          <ul className="list-disc pl-6 text-white/80 space-y-2">
            <li>Tools for thought &amp; personal knowledge management</li>
            <li>AI and language models</li>
            <li>Offline-first sync architectures (CRDTs)</li>
            <li>Internal Family Systems (IFS) therapy</li>
            <li>Spaced repetition &amp; learning systems</li>
          </ul>

          <h2 className="mt-12 mb-4 text-2xl font-semibold text-white">
            Connect
          </h2>
          <p className="text-white/80 leading-relaxed">
            You can find me on{" "}
            <a
              href="https://github.com/rajlego"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 hover:text-white/80"
            >
              GitHub
            </a>{" "}
            and{" "}
            <a
              href="https://twitter.com/rajthimmiah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 hover:text-white/80"
            >
              Twitter
            </a>
            .
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Raj Thimmiah
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/rajlego"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/rajthimmiah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-white"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
