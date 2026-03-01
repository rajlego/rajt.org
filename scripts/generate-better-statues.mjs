import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

// All reference photos
const facePhotos = [
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/1/1B430110-001E-457F-849C-7C7D539C2152_1_105_c.jpeg",
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/9/957FA93D-170A-42D4-8CB2-868B9E915F4A_1_105_c.jpeg",
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/masters/4/402C3759-966A-4C07-AA77-AF1C770A3CBE_4_5005_c.jpeg",
];

// Better prompts emphasizing face preservation
const statueStyles = [
  {
    name: "marble-classical",
    prompt: "hyper realistic marble sculpture bust portrait, white carrara marble material, classical greek roman style, museum quality, dramatic side lighting, dark background, masterpiece sculpture, highly detailed face, curly hair carved in marble, elegant pose, 8k render",
  },
  {
    name: "bronze-modern",
    prompt: "hyper realistic bronze sculpture bust portrait, dark patina bronze material with golden highlights, museum quality modern sculpture, dramatic warm lighting, dark background, masterpiece, highly detailed face, curly hair in bronze, elegant contemplative pose, 8k render",
  },
  {
    name: "stone-ancient",
    prompt: "hyper realistic ancient stone sculpture bust portrait, weathered granite with moss texture, mysterious temple artifact, foggy dramatic lighting, archaeological treasure, highly detailed face carved in stone, curly hair texture, 8k render",
  },
  {
    name: "ethereal-divine",
    prompt: "hyper realistic luminescent crystalline sculpture bust portrait, glowing translucent material with blue and gold inner light, divine celestial aesthetic, floating light particles, dark background, highly detailed ethereal face, flowing curly hair with light, 8k cinematic",
  },
];

async function createFaceZip() {
  const zipDir = path.join(__dirname, "../temp");
  fs.mkdirSync(zipDir, { recursive: true });

  // Copy face images to temp folder with simple names
  facePhotos.forEach((photo, i) => {
    const dest = path.join(zipDir, `face${i + 1}.jpg`);
    fs.copyFileSync(photo, dest);
  });

  // Create zip using system command
  const zipPath = path.join(zipDir, "faces.zip");
  execSync(`cd "${zipDir}" && zip -j faces.zip face1.jpg face2.jpg face3.jpg`);

  return zipPath;
}

async function uploadFile(filePath, contentType) {
  console.log(`Uploading ${path.basename(filePath)}...`);
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: contentType });
  const file = new File([blob], path.basename(filePath), { type: contentType });
  const url = await fal.storage.upload(file);
  console.log(`Uploaded: ${url}`);
  return url;
}

async function generateStatue(style, faceZipUrl, primaryFaceUrl) {
  console.log(`\nGenerating ${style.name}...`);

  try {
    // Try with multiple faces first
    const result = await fal.subscribe("fal-ai/ip-adapter-face-id", {
      input: {
        prompt: style.prompt,
        face_image_url: primaryFaceUrl, // Primary reference
        model_type: "SDXL-v2-plus",
        negative_prompt: "blurry, low resolution, bad anatomy, ugly, deformed, cartoon, anime, illustration, painting, drawing, disfigured, mutated, extra limbs, bad proportions, watermark, text, logo, asian features override, change ethnicity",
        guidance_scale: 6.5, // Slightly lower for better face adherence
        num_inference_steps: 50,
        num_samples: 1,
        width: 1024,
        height: 1024,
        face_id_det_size: 640,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_QUEUE") {
          process.stdout.write(".");
        }
      },
    });

    if (result.data?.image?.url) {
      return result.data.image.url;
    }
    if (result.data?.images?.[0]?.url) {
      return result.data.images[0].url;
    }

    console.log("Unexpected result:", JSON.stringify(result.data, null, 2));
    return null;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, "../public/face-statues-v2");
  fs.mkdirSync(outputDir, { recursive: true });

  // Use the clearest front-facing photo (mirror selfie) as primary
  const primaryPhoto = facePhotos[2]; // The mirror selfie with clear face
  const primaryUrl = await uploadFile(primaryPhoto, "image/jpeg");

  console.log("\n=== Generating Better Face-Preserving Statues ===\n");

  const results = [];

  for (const style of statueStyles) {
    const url = await generateStatue(style, null, primaryUrl);
    if (url) {
      results.push({ name: style.name, url });
      console.log(`\n✓ ${style.name}: ${url}`);

      // Download
      const outputPath = path.join(outputDir, `${style.name}.png`);
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`  Saved to: ${outputPath}`);
      } catch (err) {
        console.error(`  Download failed: ${err.message}`);
      }
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(outputDir, "urls.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("\n=== Done ===\n");
  results.forEach((r) => console.log(`${r.name}: ${r.url}`));
}

main().catch(console.error);
