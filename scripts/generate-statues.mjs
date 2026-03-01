import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set FAL_KEY environment variable
process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

const sourceImagePath =
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/9/957FA93D-170A-42D4-8CB2-868B9E915F4A_1_105_c.jpeg";

// Statue style prompts
const statueStyles = [
  {
    name: "marble-classical",
    prompt:
      "A dramatic white marble statue of a young Indian man in a thoughtful pose with hand on chin, wearing flowing robes, in the style of ancient Greek sculpture, dramatic museum lighting, highly detailed marble texture, classical Roman bust style, renaissance masterpiece, dramatic shadows, photorealistic render",
  },
  {
    name: "bronze-modern",
    prompt:
      "A dramatic bronze statue of a young Indian man in a contemplative pose with hand touching chin, wearing elegant draped clothing, dark bronze patina with warm golden highlights, modern sculptural style, museum quality, dramatic side lighting, 8k detailed render",
  },
  {
    name: "stone-weathered",
    prompt:
      "An ancient weathered stone statue of a young Indian man in a mystical pose with hand on chin, covered partially with moss and lichen, carved from dark granite, ancient temple aesthetic, mysterious atmosphere, dramatic lighting through fog, archaeological artifact",
  },
  {
    name: "ethereal-glowing",
    prompt:
      "A luminescent ethereal statue of a young Indian man in a divine pose with hand on chin, glowing from within with soft blue and gold light, otherworldly presence, crystalline texture, surrounded by floating particles of light, celestial and divine aesthetic, 8k cinematic",
  },
];

// Pose variation prompts (same marble style, different poses)
const poseVariations = [
  {
    name: "pose-thinker",
    prompt:
      "A dramatic white marble statue of a young Indian man in the classic Thinker pose, fist under chin, leaning forward thoughtfully, wearing flowing classical robes, ancient Greek sculpture style, dramatic museum lighting, highly detailed marble texture, photorealistic",
  },
  {
    name: "pose-looking-up",
    prompt:
      "A dramatic white marble statue of a young Indian man looking upward with an expression of wonder, one hand on chest, wearing flowing classical robes, ancient Greek sculpture style, dramatic lighting from above, museum quality, photorealistic render",
  },
  {
    name: "pose-commanding",
    prompt:
      "A dramatic white marble statue of a young Indian man in a commanding stance, arm extended forward, wearing flowing robes and a laurel crown, ancient Roman emperor style, dramatic museum lighting, heroic pose, photorealistic",
  },
];

async function uploadImage(imagePath) {
  console.log("Uploading source image...");
  const imageBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  const file = new File([blob], "source.jpg", { type: "image/jpeg" });

  const url = await fal.storage.upload(file);
  console.log("Image uploaded:", url);
  return url;
}

async function generateStatue(style, imageUrl) {
  console.log(`Generating ${style.name}...`);

  try {
    // Using flux-general with image guidance for better style transfer
    const result = await fal.subscribe("fal-ai/flux-general", {
      input: {
        prompt: style.prompt,
        image_url: imageUrl,
        image_strength: 0.65, // Balance between original image and generation
        num_images: 1,
        image_size: "square_hd",
        num_inference_steps: 28,
        guidance_scale: 7.5,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log(`  ${log.message}`));
        }
      },
    });

    if (result.data?.images?.[0]?.url) {
      return result.data.images[0].url;
    }
    console.log(`Result for ${style.name}:`, JSON.stringify(result, null, 2));
    return null;
  } catch (error) {
    console.error(`Error generating ${style.name}:`, error.message);
    // Try fallback with regular flux schnell (text-to-image)
    try {
      console.log(`Trying text-to-image fallback for ${style.name}...`);
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: style.prompt,
          num_images: 1,
          image_size: "square_hd",
        },
        logs: true,
      });
      if (result.data?.images?.[0]?.url) {
        return result.data.images[0].url;
      }
    } catch (fallbackError) {
      console.error(`Fallback also failed:`, fallbackError.message);
    }
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, "../public/statue-variations");
  fs.mkdirSync(outputDir, { recursive: true });

  // Upload source image
  const imageUrl = await uploadImage(sourceImagePath);

  console.log("\n=== Generating Statue Style Variations ===\n");

  const results = [];

  // Generate all style variations
  for (const style of statueStyles) {
    const url = await generateStatue(style, imageUrl);
    if (url) {
      results.push({ name: style.name, url });
      console.log(`✓ ${style.name}: ${url}\n`);
    }
  }

  console.log("\n=== Generating Pose Variations ===\n");

  // Generate pose variations
  for (const pose of poseVariations) {
    const url = await generateStatue(pose, imageUrl);
    if (url) {
      results.push({ name: pose.name, url });
      console.log(`✓ ${pose.name}: ${url}\n`);
    }
  }

  // Save URLs to a JSON file for reference
  const resultsPath = path.join(outputDir, "generated-urls.json");
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${resultsPath}`);

  // Print summary
  console.log("\n=== Generated Statue URLs ===\n");
  results.forEach((r) => {
    console.log(`${r.name}: ${r.url}`);
  });
}

main().catch(console.error);
