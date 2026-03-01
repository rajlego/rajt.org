import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set FAL_KEY environment variable
process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

const faceStatues = [
  { name: "face-marble", file: "marble-classical.png" },
  { name: "face-bronze", file: "bronze-modern.png" },
  { name: "face-stone", file: "stone-weathered.png" },
  { name: "face-ethereal", file: "ethereal-glowing.png" },
];

async function uploadImage(imagePath) {
  console.log(`Uploading ${path.basename(imagePath)}...`);
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
        face_count: 80000, // Slightly lower for faster loading
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log(`  ${log.message}`));
        }
        if (update.status === "IN_QUEUE") {
          console.log(`  In queue...`);
        }
      },
    });

    if (result.data?.model_glb?.url) {
      return result.data.model_glb.url;
    }

    console.log("Result:", JSON.stringify(result.data, null, 2));
    return null;
  } catch (error) {
    console.error(`Error converting ${name}:`, error.message);
    return null;
  }
}

async function main() {
  const inputDir = path.join(__dirname, "../public/face-statues");
  const outputDir = path.join(__dirname, "../public/models");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log("=== Converting Face-Preserving Statues to 3D ===\n");

  const results = [];

  for (const statue of faceStatues) {
    const imagePath = path.join(inputDir, statue.file);

    if (!fs.existsSync(imagePath)) {
      console.log(`Skipping ${statue.name} - file not found`);
      continue;
    }

    const imageUrl = await uploadImage(imagePath);
    const modelUrl = await convertTo3D(statue.name, imageUrl);

    if (modelUrl) {
      results.push({ name: statue.name, modelUrl });
      console.log(`✓ ${statue.name}: ${modelUrl}`);

      // Download the GLB file
      const outputPath = path.join(outputDir, `${statue.name}.glb`);
      try {
        const response = await fetch(modelUrl);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`  Downloaded to: ${outputPath}\n`);
      } catch (err) {
        console.error(`  Failed to download: ${err.message}\n`);
      }
    }
  }

  console.log("\n=== Generated 3D Models ===\n");
  results.forEach((r) => {
    console.log(`${r.name}: ${r.modelUrl}`);
  });
}

main().catch(console.error);
