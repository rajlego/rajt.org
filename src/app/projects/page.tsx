"use client";

import { useState } from "react";
import { projects, type Project, type ProjectStatus } from "@/lib/projects";

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  active: {
    label: "Active",
    dot: "bg-green-400",
    bg: "bg-green-400/10",
    text: "text-green-400",
  },
  shipped: {
    label: "Shipped",
    dot: "bg-blue-400",
    bg: "bg-blue-400/10",
    text: "text-blue-400",
  },
  prototype: {
    label: "Prototype",
    dot: "bg-amber-400",
    bg: "bg-amber-400/10",
    text: "text-amber-400",
  },
  paused: {
    label: "Paused",
    dot: "bg-neutral-500",
    bg: "bg-neutral-500/10",
    text: "text-neutral-500",
  },
  completed: {
    label: "Done",
    dot: "bg-purple-400",
    bg: "bg-purple-400/10",
    text: "text-purple-400",
  },
};

const FILTERS: { key: ProjectStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "shipped", label: "Shipped" },
  { key: "prototype", label: "Prototype" },
  { key: "paused", label: "Paused" },
  { key: "completed", label: "Done" },
];

function StatusBadge({ status }: { status: ProjectStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const glow =
    rank === 1
      ? "from-amber-400 to-orange-500 shadow-amber-500/20 shadow-lg"
      : rank === 2
        ? "from-neutral-300 to-neutral-400 shadow-neutral-400/10 shadow-md"
        : rank === 3
          ? "from-amber-600 to-amber-700 shadow-amber-600/10 shadow-md"
          : "";

  if (rank <= 3) {
    return (
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br text-xs font-bold text-black ${glow}`}
      >
        {rank}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 text-xs font-medium text-neutral-500">
      {rank}
    </span>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const link = project.url || project.github;

  return (
    <div
      className="group relative"
      style={
        {
          "--accent": project.color,
        } as React.CSSProperties
      }
    >
      {/* Accent line on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: project.color }}
      />

      <div
        className="pl-4 py-4 cursor-pointer hover:bg-white/[0.02] rounded-r-lg transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <RankBadge rank={project.rank} />

          <span className="text-2xl w-8 text-center shrink-0">
            {project.icon}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-semibold text-white">
                {project.name}
              </h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-neutral-500 mt-0.5">
              {project.tagline}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded bg-neutral-900 text-neutral-600"
              >
                {t}
              </span>
            ))}
          </div>

          <svg
            className={`w-4 h-4 text-neutral-600 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {expanded && (
          <div className="mt-3 ml-[4.5rem] space-y-3">
            <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
              {project.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1.5 sm:hidden">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-900 text-neutral-600"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md border transition-colors"
                  style={{
                    borderColor: project.color + "40",
                    color: project.color,
                  }}
                >
                  {project.github ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      Visit
                    </>
                  )}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsBar() {
  const active = projects.filter((p) => p.status === "active").length;
  const shipped = projects.filter((p) => p.status === "shipped").length;
  const total = projects.length;

  return (
    <div className="flex items-center gap-6 text-sm">
      <div>
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-neutral-600 ml-1.5">projects</span>
      </div>
      <div className="w-px h-6 bg-neutral-800" />
      <div>
        <span className="text-2xl font-bold text-green-400">{active}</span>
        <span className="text-neutral-600 ml-1.5">active</span>
      </div>
      <div className="w-px h-6 bg-neutral-800" />
      <div>
        <span className="text-2xl font-bold text-blue-400">{shipped}</span>
        <span className="text-neutral-600 ml-1.5">shipped</span>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-900">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Projects
              </h1>
              <p className="mt-2 text-neutral-500 max-w-lg">
                Tools for thought, desktop apps with Japanese names, and the
                occasional act of hubris (looking at you, assembly LLM client).
                Ranked by how cool I think they are.
              </p>
            </div>
            <a
              href="https://rajt.org"
              className="text-sm text-neutral-600 hover:text-white transition-colors shrink-0 mt-1"
            >
              rajt.org &rarr;
            </a>
          </div>

          <div className="mt-6">
            <StatsBar />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-neutral-900 sticky top-0 bg-black/90 backdrop-blur-sm z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-1 overflow-x-auto">
          {FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? projects.length
                : projects.filter((p) => p.status === f.key).length;

            if (f.key !== "all" && count === 0) return null;

            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  filter === f.key
                    ? "bg-white/10 text-white"
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-neutral-600">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project list */}
      <main className="max-w-3xl mx-auto px-6 py-6">
        <div className="divide-y divide-neutral-900/50">
          {filtered.map((p) => (
            <ProjectRow key={p.name} project={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-neutral-600 py-20">
            No projects with this status.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-neutral-600">
          <span>&copy; {new Date().getFullYear()} Raj Thimmiah</span>
          <div className="flex gap-4">
            <a
              href="https://github.com/rajlego"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/rajlearns"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
