import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

// All reference photos
const facePhotos = [
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/masters/4/402C3759-966A-4C07-AA77-AF1C770A3CBE_4_5005_c.jpeg",
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/9/957FA93D-170A-42D4-8CB2-868B9E915F4A_1_105_c.jpeg",
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/1/1B430110-001E-457F-849C-7C7D539C2152_1_105_c.jpeg",
];

// Statue style prompts for PuLID
const statueStyles = [
  {
    name: "marble",
    prompt: "portrait as a white marble sculpture bust, classical greco-roman style, museum lighting, dramatic shadows, dark background, hyper realistic marble texture, masterpiece quality",
  },
  {
    name: "bronze",
    prompt: "portrait as a bronze sculpture bust, dark patina with golden highlights, museum quality, dramatic warm lighting, dark background, hyper realistic bronze metal texture",
  },
  {
    name: "stone",
    prompt: "portrait as an ancient weathered stone sculpture, granite texture with moss, mysterious temple artifact, foggy atmosphere, dramatic lighting",
  },
  {
    name: "ethereal",
    prompt: "portrait with glowing ethereal crystalline skin, luminescent blue and gold light emanating from within, divine celestial being, floating light particles, dark background",
  },
];

async function uploadImage(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  const blob = new Blob([buffer], { type: "image/jpeg" });
  const file = new File([blob], path.basename(imagePath), { type: "image/jpeg" });
  return await fal.storage.upload(file);
}

async function generateWithPuLID(style, referenceUrls) {
  console.log(`\nGenerating ${style.name} with PuLID...`);

  try {
    const result = await fal.subscribe("fal-ai/pulid", {
      input: {
        prompt: style.prompt,
        reference_images: referenceUrls.map(url => ({ image_url: url })),
        id_scale: 1.2, // Higher for better face preservation
        mode: "fidelity", // Prioritize identity accuracy
        image_size: { width: 1024, height: 1024 },
        negative_prompt: "ugly, deformed, bad anatomy, cartoon, anime, illustration, low quality, blurry, watermark",
        guidance_scale: 1.2,
        num_inference_steps: 8,
        num_images: 1,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_QUEUE") process.stdout.write(".");
      },
    });

    if (result.data?.images?.[0]?.url) {
      return result.data.images[0].url;
    }
    console.log("Result:", JSON.stringify(result.data, null, 2));
    return null;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.body) console.error(JSON.stringify(error.body, null, 2));
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, "../public/pulid-statues");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log("Uploading reference images...");
  const referenceUrls = [];
  for (const photo of facePhotos) {
    const url = await uploadImage(photo);
    referenceUrls.push(url);
    console.log(`  Uploaded: ${path.basename(photo)}`);
  }

  console.log("\n=== Generating PuLID Statues ===");

  const results = [];

  for (const style of statueStyles) {
    const url = await generateWithPuLID(style, referenceUrls);
    if (url) {
      results.push({ name: style.name, url });
      console.log(`\n✓ ${style.name}: ${url}`);

      const outputPath = path.join(outputDir, `${style.name}.png`);
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`  Saved: ${outputPath}`);
      } catch (err) {
        console.error(`  Download failed: ${err.message}`);
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, "urls.json"), JSON.stringify(results, null, 2));
  console.log("\n=== Done ===");
}

main().catch(console.error);
