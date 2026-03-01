import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set FAL_KEY environment variable
process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

const sourceImagePath =
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/9/957FA93D-170A-42D4-8CB2-868B9E915F4A_1_105_c.jpeg";

// Statue style prompts - will preserve the user's actual face
const statueStyles = [
  {
    name: "marble-classical",
    prompt:
      "dramatic white marble statue sculpture, ancient Greek Roman style, museum lighting, dramatic shadows, classical bust, renaissance masterpiece, highly detailed marble texture, dramatic pose with hand on chin, thoughtful expression, dark background, photorealistic sculpture, 8k",
  },
  {
    name: "bronze-modern",
    prompt:
      "dramatic bronze statue sculpture, dark bronze patina with warm golden highlights, modern museum sculpture, dramatic side lighting, elegant classical pose, hand touching chin thoughtfully, dark background, photorealistic bronze sculpture, 8k detailed",
  },
  {
    name: "stone-weathered",
    prompt:
      "ancient weathered stone statue sculpture, dark granite carving, moss and lichen texture, mysterious temple statue, dramatic foggy lighting, contemplative pose with hand on chin, archaeological artifact, photorealistic stone sculpture, 8k",
  },
  {
    name: "ethereal-glowing",
    prompt:
      "luminescent ethereal glowing statue sculpture, translucent crystalline texture, soft blue and gold inner light, divine celestial being, floating light particles, dramatic pose hand on chin, otherworldly presence, dark background, photorealistic 8k",
  },
];

async function uploadImage(imagePath) {
  console.log("Uploading source face image...");
  const imageBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  const file = new File([blob], "face.jpg", { type: "image/jpeg" });

  const url = await fal.storage.upload(file);
  console.log("Face image uploaded:", url);
  return url;
}

async function generateFaceStatue(style, faceImageUrl) {
  console.log(`\nGenerating ${style.name} with your face...`);

  try {
    const result = await fal.subscribe("fal-ai/ip-adapter-face-id", {
      input: {
        prompt: style.prompt,
        face_image_url: faceImageUrl,
        model_type: "SDXL-v2-plus", // Best quality for face preservation
        negative_prompt: "blurry, low resolution, bad anatomy, ugly, deformed, cartoon, anime, illustration, painting, drawing, low quality, pixelated, watermark, text",
        guidance_scale: 7.5,
        num_inference_steps: 50,
        num_samples: 1,
        width: 1024,
        height: 1024,
        face_id_det_size: 640,
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

    // Handle different response formats
    if (result.data?.images?.[0]?.url) {
      return result.data.images[0].url;
    }
    if (result.data?.image?.url) {
      return result.data.image.url;
    }

    console.log("Result:", JSON.stringify(result.data, null, 2));
    return null;
  } catch (error) {
    console.error(`Error generating ${style.name}:`, error.message);
    if (error.body) {
      console.error("Error details:", JSON.stringify(error.body, null, 2));
    }
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, "../public/face-statues");
  fs.mkdirSync(outputDir, { recursive: true });

  // Upload face image
  const faceImageUrl = await uploadImage(sourceImagePath);

  console.log("\n=== Generating Face-Preserving Statue Variations ===\n");

  const results = [];

  for (const style of statueStyles) {
    const url = await generateFaceStatue(style, faceImageUrl);
    if (url) {
      results.push({ name: style.name, url });
      console.log(`✓ ${style.name}: ${url}\n`);

      // Download the image
      const outputPath = path.join(outputDir, `${style.name}.png`);
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`  Downloaded to: ${outputPath}`);
      } catch (err) {
        console.error(`  Failed to download: ${err.message}`);
      }
    }
  }

  // Save results
  const resultsPath = path.join(outputDir, "face-statue-urls.json");
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log("\n=== Generated Face-Preserving Statue URLs ===\n");
  results.forEach((r) => {
    console.log(`${r.name}: ${r.url}`);
  });
}

main().catch(console.error);
