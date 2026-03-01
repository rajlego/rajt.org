"use client";

import { useState, useEffect } from "react";
import { projects, interests, type Project } from "@/lib/projects";
import Link from "next/link";

/* ─── Design Registry ─── */
const DESIGNS = [
  { id: "brutalist", name: "Brutalist", desc: "Raw concrete, bold type" },
  { id: "terminal", name: "Terminal", desc: "Green-on-black hacker" },
  { id: "bento", name: "Bento", desc: "Grid cards, rounded" },
  { id: "editorial", name: "Editorial", desc: "Magazine typography" },
  { id: "neon", name: "Neon Noir", desc: "Dark with neon accents" },
  { id: "zen", name: "Minimal Zen", desc: "White space, breath" },
  { id: "retro", name: "Retro Pixel", desc: "8-bit aesthetic" },
  { id: "glass", name: "Glassmorphism", desc: "Frosted glass cards" },
  { id: "duotone", name: "Duotone", desc: "Two-color bold" },
  { id: "blueprint", name: "Blueprint", desc: "Technical drawings" },
  { id: "vapor", name: "Vaporwave", desc: "80s/90s aesthetic" },
  { id: "swiss", name: "Swiss Grid", desc: "International typographic" },
  { id: "lux", name: "Dark Lux", desc: "Premium dark, gold accents" },
  { id: "organic", name: "Organic", desc: "Natural, earthy tones" },
  { id: "hud", name: "Cyberpunk HUD", desc: "Sci-fi interface" },
] as const;

type DesignId = (typeof DESIGNS)[number]["id"];

/* ─── Shared Components ─── */

function ProjectCard({ p, variant }: { p: Project; variant: string }) {
  const link = p.url || p.github;
  const Tag = link ? "a" : "div";
  const linkProps = link
    ? { href: link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const base: Record<string, string> = {
    brutalist:
      "border-4 border-white p-5 hover:bg-white hover:text-black transition-colors",
    terminal:
      "border border-green-500/30 p-4 hover:border-green-400 hover:bg-green-950/30",
    bento: "rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all",
    editorial:
      "border-b border-white/20 pb-6 hover:border-white/40 transition-colors",
    neon: "rounded-lg bg-black/50 border border-white/10 p-5 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all",
    zen: "py-6 border-b border-neutral-200 hover:pl-2 transition-all",
    retro:
      "border-2 border-yellow-400 bg-indigo-900 p-4 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]",
    glass:
      "rounded-xl backdrop-blur-md bg-white/5 border border-white/20 p-5 hover:bg-white/10 transition-all",
    duotone:
      "border-2 border-cyan-400 p-5 hover:bg-cyan-400 hover:text-black transition-colors",
    blueprint:
      "border border-blue-400/40 p-4 bg-blue-950/20 hover:bg-blue-950/40 transition-colors",
    vapor:
      "rounded-lg bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-pink-400/20 p-5 hover:from-pink-500/20 hover:to-cyan-500/20 transition-all",
    swiss:
      "border-l-4 border-red-500 pl-4 py-3 hover:bg-white/5 transition-colors",
    lux: "rounded-lg bg-neutral-900 border border-amber-500/20 p-5 hover:border-amber-500/50 transition-all",
    organic:
      "rounded-3xl bg-amber-950/20 border border-amber-800/30 p-5 hover:bg-amber-950/30 transition-all",
    hud: "border border-cyan-500/30 bg-black/80 p-4 clip-corners hover:border-cyan-400/60 transition-colors",
  };

  return (
    <Tag {...linkProps} className={`block ${base[variant] || base.bento}`}>
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{p.icon}</span>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold ${variant === "zen" ? "text-neutral-900" : ""}`}
          >
            {p.name}
          </h3>
          <p
            className={`text-sm ${variant === "zen" ? "text-neutral-500" : "opacity-60"}`}
          >
            {p.tagline}
          </p>
        </div>
      </div>
      <p
        className={`text-sm leading-relaxed ${variant === "zen" ? "text-neutral-600" : "opacity-50"}`}
      >
        {p.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span
            key={t}
            className={`text-xs px-2 py-0.5 rounded-full ${
              variant === "zen"
                ? "bg-neutral-100 text-neutral-600"
                : variant === "retro"
                  ? "bg-yellow-400 text-indigo-900 font-bold"
                  : "bg-white/10"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </Tag>
  );
}

function InterestBadge({
  label,
  detail,
  variant,
}: {
  label: string;
  detail: string;
  variant: string;
}) {
  const [open, setOpen] = useState(false);
  const styles: Record<string, string> = {
    brutalist:
      "border-2 border-white px-3 py-1 cursor-pointer hover:bg-white hover:text-black",
    terminal:
      "border border-green-500/40 px-3 py-1 cursor-pointer hover:bg-green-500 hover:text-black",
    bento: "rounded-full bg-white/10 px-4 py-1.5 cursor-pointer hover:bg-white/20",
    editorial: "italic cursor-pointer hover:underline underline-offset-4",
    neon: "rounded-full border border-purple-500/30 px-4 py-1.5 cursor-pointer hover:border-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    zen: "text-neutral-600 cursor-pointer hover:text-neutral-900 underline underline-offset-4 decoration-neutral-300",
    retro:
      "bg-yellow-400 text-indigo-900 font-bold px-3 py-1 cursor-pointer",
    glass:
      "rounded-full backdrop-blur bg-white/10 border border-white/20 px-4 py-1.5 cursor-pointer hover:bg-white/20",
    duotone:
      "border border-orange-400 px-3 py-1 cursor-pointer hover:bg-orange-400 hover:text-black",
    blueprint:
      "border border-blue-400/40 px-3 py-1 text-blue-300 cursor-pointer hover:bg-blue-400/20",
    vapor:
      "bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-400/20 rounded-full px-4 py-1.5 cursor-pointer hover:from-pink-500/30",
    swiss:
      "bg-red-500 text-white px-3 py-1 cursor-pointer hover:bg-red-600",
    lux: "border border-amber-500/30 rounded px-3 py-1 cursor-pointer hover:border-amber-400 text-amber-300",
    organic:
      "rounded-full bg-green-800/30 border border-green-700/30 px-4 py-1.5 text-green-300 cursor-pointer hover:bg-green-800/50",
    hud: "border border-cyan-500/40 px-3 py-1 text-cyan-400 cursor-pointer hover:bg-cyan-500/10 font-mono text-xs uppercase tracking-wider",
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`text-sm transition-all ${styles[variant] || styles.bento}`}
      >
        {label}
      </button>
      {open && (
        <p
          className={`mt-2 text-sm max-w-md ${variant === "zen" ? "text-neutral-500" : "opacity-60"}`}
        >
          {detail}
        </p>
      )}
    </div>
  );
}

/* ─── 15 Design Renderers ─── */

function Brutalist() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b-4 border-white p-8">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
          RAJ
          <br />
          THIMMIAH
        </h1>
        <p className="mt-4 text-xl max-w-xl border-l-4 border-white pl-4">
          BUILDER. TOOL-MAKER. SPACED REPETITION OBSESSIVE.
        </p>
      </header>

      <section className="p-8">
        <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-white pb-2 inline-block">
          PROJECTS
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} variant="brutalist" />
          ))}
        </div>
      </section>

      <section className="p-8 border-t-4 border-white">
        <h2 className="text-3xl font-black uppercase mb-6">INTERESTS</h2>
        <div className="flex flex-wrap gap-3">
          {interests.map((i) => (
            <InterestBadge key={i.label} {...i} variant="brutalist" />
          ))}
        </div>
      </section>

      <footer className="p-8 border-t-4 border-white flex gap-6 text-sm">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
          GITHUB
        </a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
          TWITTER
        </a>
      </footer>
    </div>
  );
}

function Terminal() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        <div className="border border-green-500/30 rounded-lg overflow-hidden">
          <div className="bg-green-950/40 px-4 py-2 flex items-center gap-2 border-b border-green-500/30">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-green-500/60 text-sm">
              raj@berkeley ~ %
            </span>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <span className="text-green-600">$ </span>
              <span>whoami</span>
            </div>
            <pre className="text-green-300 leading-relaxed">
{`╔═══════════════════════════════════════╗
║  Raj Thimmiah                         ║
║  Builder · Tool-maker · Berkeley, CA  ║
║                                       ║
║  Spaced repetition obsessive.         ║
║  Desktop app addict (Tauri 2.0).      ║
║  Co-organized Memoria 2025.           ║
╚═══════════════════════════════════════╝`}
            </pre>

            <div>
              <span className="text-green-600">$ </span>
              <span>ls ~/projects/</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.name} p={p} variant="terminal" />
              ))}
            </div>

            <div className="mt-8">
              <span className="text-green-600">$ </span>
              <span>cat interests.txt</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((i) => (
                <InterestBadge key={i.label} {...i} variant="terminal" />
              ))}
            </div>

            <div className="mt-8 flex gap-4 text-sm">
              <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                [GitHub]
              </a>
              <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                [Twitter]
              </a>
            </div>
            <div className="text-green-600 animate-pulse">█</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bento() {
  const featured = projects.filter((p) => p.category === "featured");
  const tools = projects.filter((p) => p.category === "tool");
  const rest = projects.filter(
    (p) => p.category !== "featured" && p.category !== "tool"
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-10 md:p-14">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Raj Thimmiah
          </h1>
          <p className="mt-4 text-xl text-white/80 max-w-lg">
            Building tools for thought. Spaced repetition nerd. Desktop app
            maker.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/20 px-4 py-2 text-sm hover:bg-white/30 transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/20 px-4 py-2 text-sm hover:bg-white/30 transition-colors">
              Twitter
            </a>
          </div>
        </div>

        {/* Featured - large cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.name} p={p} variant="bento" />
          ))}
        </div>

        {/* Tools - smaller grid */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tools.map((p) => (
            <ProjectCard key={p.name} p={p} variant="bento" />
          ))}
        </div>

        {/* Rest */}
        <div className="grid gap-4 md:grid-cols-3">
          {rest.map((p) => (
            <ProjectCard key={p.name} p={p} variant="bento" />
          ))}
        </div>

        {/* Interests */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
          <h2 className="text-xl font-semibold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="bento" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Editorial() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="max-w-4xl mx-auto pt-20 pb-16 px-8">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
          Personal Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-[0.9]">
          Raj
          <br />
          <span className="not-italic font-light">Thimmiah</span>
        </h1>
        <div className="mt-8 flex gap-8 text-sm text-white/50 border-t border-white/20 pt-4">
          <span>Berkeley, CA</span>
          <span>Builder</span>
          <span>Tool-maker</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8">
        <div className="border-t border-white/20 pt-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-8">
            Selected Works
          </h2>
          <div className="space-y-1">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} variant="editorial" />
            ))}
          </div>
        </div>

        <div className="border-t border-white/20 mt-16 pt-8 pb-20">
          <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
            Areas of Interest
          </h2>
          <div className="flex flex-wrap gap-4">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="editorial" />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-8 max-w-4xl mx-auto flex gap-6 text-xs uppercase tracking-[0.2em] text-white/40">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
      </footer>
    </div>
  );
}

function NeonNoir() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10">
        <header className="text-center pt-20 pb-16 px-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Raj Thimmiah
          </h1>
          <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
            Building at the intersection of memory, AI, and beautiful tools.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300">
              GitHub &rarr;
            </a>
            <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="text-sm text-pink-400 hover:text-pink-300">
              Twitter &rarr;
            </a>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-sm uppercase tracking-widest text-purple-400/60 mb-6">
            Projects
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} variant="neon" />
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-sm uppercase tracking-widest text-purple-400/60 mb-6">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <InterestBadge key={i.label} {...i} variant="neon" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MinimalZen() {
  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900">
      <header className="max-w-2xl mx-auto pt-32 pb-24 px-8 text-center">
        <h1 className="text-3xl font-light tracking-wide">Raj Thimmiah</h1>
        <p className="mt-6 text-neutral-500 leading-relaxed max-w-sm mx-auto">
          I build tools that help people think better, remember more, and work
          with intention.
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-8 pb-20">
        <div className="space-y-1">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} variant="zen" />
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-neutral-200">
          <h2 className="text-sm text-neutral-400 mb-6">Things I care about</h2>
          <div className="flex flex-wrap gap-4">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="zen" />
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto px-8 py-12 border-t border-neutral-200 flex gap-6 text-sm text-neutral-400">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">GitHub</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">Twitter</a>
      </footer>
    </div>
  );
}

function RetroPixel() {
  return (
    <div className="min-h-screen bg-indigo-950 text-yellow-300 font-mono">
      <header className="text-center pt-12 pb-8 px-6">
        <pre className="text-yellow-400 text-xs md:text-sm leading-tight inline-block text-left">
{`
 ██████╗  █████╗      ██╗
 ██╔══██╗██╔══██╗     ██║
 ██████╔╝███████║     ██║
 ██╔══██╗██╔══██║██   ██║
 ██║  ██║██║  ██║╚█████╔╝
 ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝`}
        </pre>
        <p className="mt-4 text-yellow-400/60">
          &gt; BUILDER OF TOOLS &bull; BERKELEY, CA
        </p>
        <p className="text-yellow-400/40 text-sm mt-1">
          &gt; PRESS ANY INTEREST TO LEARN MORE
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-xl mb-4 border-b-2 border-yellow-400 pb-1 inline-block">
          &lt; PROJECTS /&gt;
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} variant="retro" />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl mb-4 border-b-2 border-yellow-400 pb-1 inline-block">
            &lt; STATS /&gt;
          </h2>
          <div className="flex flex-wrap gap-3">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="retro" />
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-6 border-t-2 border-yellow-400/30 text-sm">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 mx-3">[GITHUB]</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 mx-3">[TWITTER]</a>
      </footer>
    </div>
  );
}

function Glassmorphism() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Gradient BG */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="fixed top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-[80px]" />
      <div className="fixed bottom-20 right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-[80px]" />
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px]" />

      <div className="relative z-10">
        <header className="text-center pt-20 pb-16 px-6">
          <div className="inline-block backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl px-12 py-10">
            <h1 className="text-4xl md:text-5xl font-bold">Raj Thimmiah</h1>
            <p className="mt-3 text-white/60">
              Tools for thought &bull; Spaced repetition &bull; AI
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} variant="glass" />
            ))}
          </div>

          <div className="mt-12 backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <InterestBadge key={i.label} {...i} variant="glass" />
              ))}
            </div>
          </div>
        </main>

        <footer className="text-center py-8 text-sm text-white/40">
          <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-white mx-3">GitHub</a>
          <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-white mx-3">Twitter</a>
        </footer>
      </div>
    </div>
  );
}

function Duotone() {
  return (
    <div className="min-h-screen bg-black text-cyan-400">
      <header className="pt-20 pb-16 px-8 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black">
          <span className="text-cyan-400">RAJ</span>
          <br />
          <span className="text-orange-400">THIMMIAH</span>
        </h1>
        <p className="mt-6 text-xl text-cyan-400/60 max-w-lg">
          I make desktop apps with Japanese names and obsess over how people
          learn.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} variant="duotone" />
          ))}
        </div>

        <div className="mt-16 border-t-2 border-orange-400 pt-8">
          <div className="flex flex-wrap gap-3">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="duotone" />
            ))}
          </div>
        </div>
      </main>

      <footer className="px-8 py-8 border-t border-cyan-400/20 max-w-5xl mx-auto flex gap-6 text-sm">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">GitHub</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">Twitter</a>
      </footer>
    </div>
  );
}

function Blueprint() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-blue-300 font-mono">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        <header className="pt-16 pb-12 px-8 max-w-5xl mx-auto">
          <p className="text-xs text-blue-500/50 mb-2">
            DRAWING NO. 001 &mdash; REV. 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-200">
            Raj Thimmiah
          </h1>
          <p className="mt-2 text-blue-400/60 text-sm">
            SCALE: 1:1 &bull; BERKELEY, CA &bull; TOOLS FOR THOUGHT
          </p>
          <div className="mt-4 h-px bg-blue-400/30" />
        </header>

        <main className="max-w-5xl mx-auto px-8 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 border border-blue-400/40 rotate-45" />
            <h2 className="text-sm uppercase tracking-widest text-blue-400/60">
              Project Registry
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} variant="blueprint" />
            ))}
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 border border-blue-400/40 rounded-full" />
              <h2 className="text-sm uppercase tracking-widest text-blue-400/60">
                Research Interests
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <InterestBadge key={i.label} {...i} variant="blueprint" />
              ))}
            </div>
          </div>
        </main>

        <footer className="border-t border-blue-400/20 py-6 px-8 max-w-5xl mx-auto flex justify-between text-xs text-blue-500/40">
          <div>
            <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 mr-4">GitHub</a>
            <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">Twitter</a>
          </div>
          <span>DWG-001-2026</span>
        </footer>
      </div>
    </div>
  );
}

function Vaporwave() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0020] via-[#1a0040] to-[#0a0020] text-white overflow-hidden">
      {/* Sun */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-300 opacity-30 blur-sm" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#0a0020] mt-32" />

      <div className="relative z-10">
        <header className="text-center pt-20 pb-12 px-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ＲＡＪ
          </h1>
          <p className="mt-2 text-2xl text-pink-300/60 tracking-[0.5em]">
            ＴＨＩＭＭＩＡＨ
          </p>
          <p className="mt-4 text-sm text-cyan-300/50">
            ｔｏｏｌｓ ｆｏｒ ｔｈｏｕｇｈｔ
          </p>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} variant="vapor" />
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {interests.map((i) => (
                <InterestBadge key={i.label} {...i} variant="vapor" />
              ))}
            </div>
          </div>
        </main>

        <footer className="text-center py-8 text-sm text-pink-400/40">
          <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 mx-3">ＧｉｔＨｕｂ</a>
          <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 mx-3">Ｔｗｉｔｔｅｒ</a>
        </footer>
      </div>
    </div>
  );
}

function SwissGrid() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="max-w-6xl mx-auto px-8 pt-12 pb-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
              Raj
              <br />
              Thimmiah
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-end">
            <p className="text-sm text-neutral-500 leading-relaxed">
              Software builder working on tools for thought, spaced repetition
              systems, and keyboard-first interfaces. Based in Berkeley.
            </p>
          </div>
        </div>
        <div className="h-1 bg-red-500 mt-8" />
      </header>

      <main className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="col-span-12 md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-neutral-400 sticky top-8">
              Projects
            </p>
          </div>
          <div className="col-span-12 md:col-span-10">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.name} p={p} variant="swiss" />
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-200 my-12" />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Interests
            </p>
          </div>
          <div className="col-span-12 md:col-span-10 flex flex-wrap gap-2">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="swiss" />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-6 px-8 max-w-6xl mx-auto flex gap-6 text-xs uppercase tracking-widest text-neutral-400">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-black">GitHub</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-black">Twitter</a>
      </footer>
    </div>
  );
}

function DarkLux() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="max-w-5xl mx-auto pt-20 pb-16 px-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-500/60 mb-6">
          Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight">
          Raj <span className="text-amber-400">Thimmiah</span>
        </h1>
        <div className="mt-6 w-12 h-px bg-amber-500 mx-auto" />
        <p className="mt-6 text-neutral-500 max-w-md mx-auto">
          Crafting beautiful software tools at the intersection of memory,
          learning, and AI.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} variant="lux" />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-xs uppercase tracking-[0.3em] text-amber-500/60 mb-6">
            Interests
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="lux" />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-900 py-8 text-center text-sm text-neutral-600">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 mx-3">GitHub</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 mx-3">Twitter</a>
      </footer>
    </div>
  );
}

function Organic() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <header className="max-w-4xl mx-auto pt-20 pb-16 px-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-2xl font-bold">
            R
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Raj Thimmiah</h1>
            <p className="text-stone-500">Berkeley, CA</p>
          </div>
        </div>
        <p className="text-stone-400 max-w-lg leading-relaxed">
          I grow tools. Desktop apps with Japanese names, spaced repetition
          systems, and things that help people think. Everything built
          keyboard-first.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-8 pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} variant="organic" />
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-emerald-950/20 border border-emerald-800/20 p-8">
          <h2 className="text-lg text-emerald-400 mb-4">
            What I care about
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <InterestBadge key={i.label} {...i} variant="organic" />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-900 py-8 px-8 max-w-4xl mx-auto flex gap-6 text-sm text-stone-600">
        <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">GitHub</a>
        <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Twitter</a>
      </footer>
    </div>
  );
}

function CyberpunkHUD() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-hidden">
      {/* Scan lines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)",
        }}
      />

      <div className="relative z-10">
        <header className="pt-12 pb-8 px-6 max-w-6xl mx-auto">
          <div className="border border-cyan-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-500/60 uppercase tracking-widest">
                System Online
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-300">
              &gt; RAJ.THIMMIAH
            </h1>
            <p className="mt-2 text-sm text-cyan-500/50">
              DESIGNATION: TOOL_BUILDER // LOCATION: BERKELEY_CA //
              STATUS: ACTIVE
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-cyan-500/40 uppercase tracking-widest">
              [ PROJECT_DATABASE ]
            </span>
            <div className="flex-1 h-px bg-cyan-500/20" />
            <span className="text-xs text-cyan-500/40">
              {projects.length} ENTRIES
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.name} p={p} variant="hud" />
            ))}
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-cyan-500/40 uppercase tracking-widest">
                [ INTEREST_VECTORS ]
              </span>
              <div className="flex-1 h-px bg-cyan-500/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <InterestBadge key={i.label} {...i} variant="hud" />
              ))}
            </div>
          </div>
        </main>

        <footer className="border-t border-cyan-500/20 py-6 px-6 max-w-6xl mx-auto flex justify-between text-xs text-cyan-500/40">
          <div className="flex gap-4">
            <a href="https://github.com/rajlego" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300">[GITHUB]</a>
            <a href="https://twitter.com/rajlearns" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300">[TWITTER]</a>
          </div>
          <span>&copy; 2026 // ALL SYSTEMS NOMINAL</span>
        </footer>
      </div>
    </div>
  );
}

/* ─── Design Switcher ─── */

function DesignSwitcher({
  current,
  onChange,
}: {
  current: DesignId;
  onChange: (id: DesignId) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentDesign = DESIGNS.find((d) => d.id === current);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {open && (
        <div className="mb-3 bg-neutral-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto w-72">
          <div className="p-3 border-b border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider">
              Choose a design ({DESIGNS.length})
            </p>
          </div>
          <div className="p-2">
            {DESIGNS.map((d, i) => (
              <button
                key={d.id}
                onClick={() => {
                  onChange(d.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                  current === d.id
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-6 text-center text-xs text-white/40 font-mono">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-white/40">{d.desc}</div>
                </div>
                {current === d.id && (
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-neutral-900 border border-white/20 text-white rounded-full px-4 py-2.5 shadow-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm"
      >
        <span className="text-lg">
          {open ? "\u2715" : "\u{1F3A8}"}
        </span>
        <span className="hidden sm:inline">
          {currentDesign?.name || "Design"}
        </span>
      </button>
    </div>
  );
}

/* ─── Main Page ─── */

const designMap: Record<DesignId, () => React.JSX.Element> = {
  brutalist: Brutalist,
  terminal: Terminal,
  bento: Bento,
  editorial: Editorial,
  neon: NeonNoir,
  zen: MinimalZen,
  retro: RetroPixel,
  glass: Glassmorphism,
  duotone: Duotone,
  blueprint: Blueprint,
  vapor: Vaporwave,
  swiss: SwissGrid,
  lux: DarkLux,
  organic: Organic,
  hud: CyberpunkHUD,
};

export default function Home() {
  const [design, setDesign] = useState<DesignId>("bento");

  // Persist choice
  useEffect(() => {
    const saved = localStorage.getItem("rajt-design") as DesignId | null;
    if (saved && designMap[saved]) setDesign(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("rajt-design", design);
  }, [design]);

  // Keyboard nav: left/right arrows to cycle designs when switcher is NOT open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const ids = DESIGNS.map((d) => d.id);
      const idx = ids.indexOf(design);
      if (e.key === "ArrowLeft" || e.key === "[") {
        e.preventDefault();
        setDesign(ids[(idx - 1 + ids.length) % ids.length]);
      } else if (e.key === "ArrowRight" || e.key === "]") {
        e.preventDefault();
        setDesign(ids[(idx + 1) % ids.length]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [design]);

  const DesignComponent = designMap[design];

  return (
    <>
      <DesignComponent />
      <DesignSwitcher current={design} onChange={setDesign} />
      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-6 z-[9999] text-xs text-white/30 hidden sm:block">
        Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono">&larr;</kbd>{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono">&rarr;</kbd>{" "}
        to switch designs
      </div>
    </>
  );
}
