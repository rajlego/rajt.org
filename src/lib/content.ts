import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  published: boolean;
  gated: boolean;
  tags: string[];
  content: string;
  excerpt: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(contentDir, filename), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: (data.title as string) || slug.replace(/-/g, " "),
        date: (data.date as string) || "",
        published: data.published !== false, // default to true
        gated: data.gated !== false, // default to gated (private) — safe default
        tags: (data.tags as string[]) || [],
        content,
        excerpt:
          (data.excerpt as string) || content.slice(0, 160).replace(/\n/g, " "),
      };
    })
    .filter((p) => p.published)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getPublicPosts(): Post[] {
  return getAllPosts().filter((p) => !p.gated);
}

export function getGatedPosts(): Post[] {
  return getAllPosts().filter((p) => p.gated);
}

export function getPost(slug: string): Post | null {
  const filepath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title as string) || slug.replace(/-/g, " "),
    date: (data.date as string) || "",
    published: data.published !== false,
    gated: data.gated !== false,
    tags: (data.tags as string[]) || [],
    content,
    excerpt:
      (data.excerpt as string) || content.slice(0, 160).replace(/\n/g, " "),
  };
}
