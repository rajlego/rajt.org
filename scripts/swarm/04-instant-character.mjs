// Swarm agent: Instant Character — character-consistent generation
// v1 — 2026-02-20
import { fal } from "@fal-ai/client";
import path from "path";
import { fileURLToPath } from "url";
import pLimit from "p-limit";
import { FAL_KEY, PHOTOS, STYLES, ensureDir, downloadImage, uploadImage } from "./shared-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.FAL_KEY = FAL_KEY;

const MODEL_NAME = "instant-character";
const CONCURRENCY = 5;

async function generate(style, imageUrl) {
  try {
    const result = await fal.subscribe("fal-ai/instant-character", {
      input: {
        prompt: style.prompt,
        image_url: imageUrl,
        negative_prompt: "ugly, deformed, bad anatomy, cartoon, low quality, blurry, watermark",
        num_images: 1,
        image_size: "square_hd",
      },
      logs: false,
      onQueueUpdate: (u) => { if (u.status === "IN_QUEUE") process.stdout.write("."); },
    });
    return result.data?.images?.[0]?.url || result.data?.image?.url || null;
  } catch (err) {
    console.error(`  [${MODEL_NAME}/${style.name}] Error: ${err.message}`);
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, `../../public/experiments/${MODEL_NAME}`);
  ensureDir(outputDir);

  console.log(`[${MODEL_NAME}] Uploading full kimono photo...`);
  const imageUrl = await uploadImage(fal, PHOTOS.kimono_full);
  console.log(`  Uploaded`);

  console.log(`[${MODEL_NAME}] Running ${STYLES.length} styles with concurrency ${CONCURRENCY}...`);
  const limit = pLimit(CONCURRENCY);
  const results = [];

  const tasks = STYLES.map(style => limit(async () => {
    process.stdout.write(`  [${style.name}] `);
    const url = await generate(style, imageUrl);
    if (url) {
      const outPath = path.join(outputDir, `${style.name}.png`);
      await downloadImage(url, outPath);
      results.push({ name: style.name, category: style.category, url, local: outPath });
      console.log(`✓`);
    } else {
      console.log(`✗`);
    }
  }));

  await Promise.all(tasks);

  const metaPath = path.join(outputDir, "results.json");
  const fs = await import("fs");
  fs.default.writeFileSync(metaPath, JSON.stringify({ model: MODEL_NAME, count: results.length, results }, null, 2));
  console.log(`[${MODEL_NAME}] Done: ${results.length}/${STYLES.length} succeeded`);
}

main().catch(e => { console.error(`[${MODEL_NAME}] Fatal:`, e); process.exit(1); });
