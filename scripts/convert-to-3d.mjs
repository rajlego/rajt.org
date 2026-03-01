import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set FAL_KEY environment variable
process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

const statueImages = [
  { name: "commanding-marble", file: "commanding-marble.png" },
  { name: "commanding-bronze", file: "commanding-bronze.png" },
  { name: "commanding-stone", file: "commanding-stone.png" },
  { name: "commanding-ethereal", file: "commanding-ethereal.png" },
];

async function uploadImage(imagePath) {
  console.log(`Uploading ${imagePath}...`);
  const imageBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: "image/png" });
  const file = new File([blob], path.basename(imagePath), { type: "image/png" });

  const url = await fal.storage.upload(file);
  return url;
}

async function convertTo3D(name, imageUrl) {
  console.log(`\nConverting ${name} to 3D...`);

  try {
    const result = await fal.subscribe("fal-ai/hunyuan3d-v3/image-to-3d", {
      input: {
        input_image_url: imageUrl,
        enable_pbr: true,
        generate_type: "Normal",
        face_count: 100000,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log(`  ${log.message}`));
        }
        if (update.status === "IN_QUEUE") {
          console.log(`  Position in queue: ${update.queue_position || "processing..."}`);
        }
      },
    });

    console.log(`Result for ${name}:`, JSON.stringify(result.data, null, 2));

    // Handle various response formats
    if (result.data?.model?.url) {
      return result.data.model.url;
    }
    if (result.data?.glb?.url) {
      return result.data.glb.url;
    }
    if (result.data?.output?.url) {
      return result.data.output.url;
    }
    if (typeof result.data === "string") {
      return result.data;
    }

    // Log the full result for debugging
    console.log("Full result structure:", Object.keys(result.data || {}));
    return null;
  } catch (error) {
    console.error(`Error converting ${name}:`, error.message);
    if (error.body) {
      console.error("Error details:", JSON.stringify(error.body, null, 2));
    }
    return null;
  }
}

async function main() {
  const inputDir = path.join(__dirname, "../public/statue-variations");
  const outputDir = path.join(__dirname, "../public/models");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log("=== Converting Statues to 3D Models ===\n");

  const results = [];

  for (const statue of statueImages) {
    const imagePath = path.join(inputDir, statue.file);

    if (!fs.existsSync(imagePath)) {
      console.log(`Skipping ${statue.name} - file not found: ${imagePath}`);
      continue;
    }

    const imageUrl = await uploadImage(imagePath);
    const modelUrl = await convertTo3D(statue.name, imageUrl);

    if (modelUrl) {
      results.push({ name: statue.name, modelUrl });
      console.log(`✓ ${statue.name}: ${modelUrl}\n`);
    }
  }

  // Save results
  const resultsPath = path.join(outputDir, "model-urls.json");
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log("\n=== Generated 3D Model URLs ===\n");
  results.forEach((r) => {
    console.log(`${r.name}: ${r.modelUrl}`);
  });

  // Download the GLB files
  console.log("\n=== Downloading GLB files ===\n");
  for (const r of results) {
    const outputPath = path.join(outputDir, `${r.name}.glb`);
    try {
      const response = await fetch(r.modelUrl);
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`Downloaded: ${outputPath}`);
    } catch (error) {
      console.error(`Failed to download ${r.name}:`, error.message);
    }
  }
}

main().catch(console.error);
