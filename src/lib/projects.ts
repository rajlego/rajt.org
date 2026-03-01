export type ProjectStatus =
  | "active"       // actively developing
  | "shipped"      // usable, maintenance mode
  | "prototype"    // early/experimental
  | "paused"       // on hold
  | "completed";   // done, not ongoing

export interface Project {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  category: "app" | "tool" | "research" | "community" | "extension";
  status: ProjectStatus;
  rank: number; // lower = cooler (1 is coolest)
  url?: string;
  github?: string;
  icon: string;
  color: string;
}

// Ordered by rank (coolest first)
export const projects: Project[] = ([
  {
    name: "Tanmatsu",
    tagline: "Terminal manager for Claude Code",
    description:
      "Carousel UI for managing multiple terminal sessions with a structured markdown sidebar. Built specifically for AI-assisted development workflows.",
    tech: ["Tauri", "xterm.js", "React"],
    category: "tool",
    status: "active",
    rank: 1,
    icon: "\u{1F5A5}\uFE0F",
    color: "#06B6D4",
  },
  {
    name: "Seswatha",
    tagline: "Incremental reading, reimagined",
    description:
      "A modern incremental reading app with live webpage support, EPUB/PDF parsing, spaced repetition via FSRS, and a rich text editor. The SuperMemo clone I always wanted.",
    tech: ["Electron", "React", "SQLite", "FSRS"],
    category: "app",
    status: "active",
    rank: 2,
    github: "https://github.com/rajlego/seswatha",
    icon: "\u{1F4DA}",
    color: "#7C3AED",
  },
  {
    name: "Lionheart",
    tagline: "Superhuman-fast LLM chat",
    description:
      "Desktop AI chat interface with OmniSearch, multi-model streaming, artifacts, and conversation bookmarks. Built for speed — every interaction is keyboard-first.",
    tech: ["Tauri", "React", "TypeScript", "OpenRouter"],
    category: "app",
    status: "active",
    rank: 3,
    github: "https://github.com/rajlego/lionheart",
    icon: "\u{1F981}",
    color: "#E8B931",
  },
  {
    name: "Keizai",
    tagline: "IFS therapy as a game",
    description:
      "Gamifies Internal Family Systems parts work as an internal economy. Your inner parts trade resources, form alliances, and negotiate — with AI assistance.",
    tech: ["Tauri", "React", "OpenAI", "Firebase"],
    category: "app",
    status: "active",
    rank: 4,
    github: "https://github.com/rajlego/keizai",
    icon: "\u{1F3ED}",
    color: "#10B981",
  },
  {
    name: "Sanjou",
    tagline: "Focused 25-minute blocks",
    description:
      'Implements the Block Method from David Cain\'s "How to Do Things." Structured meta-checklists, task management, and Right Now Lists for deep work.',
    tech: ["Tauri", "React", "Firebase", "Yjs"],
    category: "app",
    status: "active",
    rank: 5,
    icon: "\u{23F1}\uFE0F",
    color: "#EF4444",
  },
  {
    name: "Harp",
    tagline: "Absolute pitch training",
    description:
      "288 progressive levels to develop absolute pitch recognition. Uses FSRS spaced repetition to optimize your practice schedule.",
    tech: ["Tauri", "FSRS", "Web Audio"],
    category: "tool",
    status: "shipped",
    rank: 6,
    icon: "\u{1F3B5}",
    color: "#EC4899",
  },
  {
    name: "Memoria 2025",
    tagline: "120-person spaced repetition unconference",
    description:
      "Co-organized the largest spaced repetition community gathering at Lighthaven, Berkeley. Talks on incremental reading, memory systems, and homemade tools.",
    tech: ["Next.js", "Airtable", "Operations"],
    category: "community",
    status: "completed",
    rank: 7,
    url: "https://memoria.day",
    icon: "\u{1F9E0}",
    color: "#F59E0B",
  },
  {
    name: "Koe",
    tagline: "Voice-first thinking",
    description:
      "Speak to think through problems. Creates visual thought windows that you manipulate with voice commands. LLM-as-Controller architecture.",
    tech: ["Tauri", "Claude API", "Web Speech"],
    category: "tool",
    status: "prototype",
    rank: 8,
    icon: "\u{1F399}\uFE0F",
    color: "#F97316",
  },
  {
    name: "Ito",
    tagline: "Branching conversations",
    description:
      "Explore ideas through branching LLM conversations displayed as a visual tree. Fork any message to explore alternative paths.",
    tech: ["Tauri", "React Flow", "Yjs"],
    category: "tool",
    status: "prototype",
    rank: 9,
    icon: "\u{1F333}",
    color: "#84CC16",
  },
  {
    name: "Terasu",
    tagline: "Intelligent pairwise ranking",
    description:
      "Rank anything by importance through smart pairwise comparisons. Uses TrueSkill + Expected Information Gain to minimize the questions you need to answer.",
    tech: ["Tauri", "TrueSkill", "Firebase"],
    category: "tool",
    status: "shipped",
    rank: 10,
    icon: "\u{2696}\uFE0F",
    color: "#8B5CF6",
  },
  {
    name: "lionheart-asm",
    tagline: "LLM chat in raw assembly",
    description:
      "An entire LLM chat client written in AArch64 ARM64 assembly. Linked against libcurl for TLS. Because why not.",
    tech: ["ARM64 Assembly", "Swift", "libcurl"],
    category: "research",
    status: "completed",
    rank: 11,
    icon: "\u{1F9EC}",
    color: "#DC2626",
  },
  {
    name: "Yomiai",
    tagline: "Reward-gated reading",
    description:
      "Manga and book reader that gates access behind completed tasks. Finish your todos, earn reading time.",
    tech: ["Vite", "React", "epub.js"],
    category: "tool",
    status: "paused",
    rank: 12,
    icon: "\u{1F4D6}",
    color: "#6366F1",
  },
  {
    name: "Taut",
    tagline: "Superhuman for Slack",
    description:
      "Keyboard-driven Slack with scheduled check-in windows and priority inbox. Stop being distracted — read Slack on your terms.",
    tech: ["Browser Extension", "Tauri"],
    category: "extension",
    status: "paused",
    rank: 13,
    icon: "\u{1F4AC}",
    color: "#4A154B",
  },
  {
    name: "MATS Tooling",
    tagline: "AI safety program infrastructure",
    description:
      "Built the review, analytics, and reference pipeline for MATS (ML Alignment Theory Scholars) cohort 10 — handling 2,200 applicants across 50 streams.",
    tech: ["Node.js", "Airtable", "SendGrid", "PostHog"],
    category: "research",
    status: "completed",
    rank: 14,
    icon: "\u{1F6E1}\uFE0F",
    color: "#0284C7",
  },
  {
    name: "supermemo-ahk",
    tagline: "SuperMemo power scripts",
    description:
      "AutoHotkey scripts for SuperMemo including one-handed operation and priority management. 13+ stars on GitHub.",
    tech: ["AutoHotkey", "SuperMemo"],
    category: "research",
    status: "shipped",
    rank: 15,
    github: "https://github.com/rajlego/supermemo-ahk",
    icon: "\u{2328}\uFE0F",
    color: "#0EA5E9",
  },
] satisfies Project[]).sort((a, b) => a.rank - b.rank);

export const interests = [
  {
    label: "Spaced Repetition",
    detail:
      "Deep SuperMemo power user. Co-organized Memoria 2025. Building Seswatha as the incremental reading app I always wanted.",
  },
  {
    label: "AI Tools",
    detail:
      "Building keyboard-first AI interfaces. Lionheart for chat, Tanmatsu for terminal, Koe for voice-first thinking.",
  },
  {
    label: "Meditation",
    detail:
      "Exploring jhanas and contemplative practice. Interested in the intersection of meditation and technology.",
  },
  {
    label: "Learning Systems",
    detail:
      "Obsessed with how people learn. FSRS, incremental reading, curriculum design, Tesler's Law applied to education.",
  },
  {
    label: "Rationality & EA",
    detail:
      "Active in the Berkeley rationalist community. Organized Bay Area Rationalist Field Day. Contributed tooling to MATS.",
  },
];
