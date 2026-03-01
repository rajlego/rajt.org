import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set FAL_KEY environment variable
process.env.FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

const sourceImagePath =
  "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/9/957FA93D-170A-42D4-8CB2-868B9E915F4A_1_105_c.jpeg";

// All 4 styles with commanding pose
const commandingStyles = [
  {
    name: "commanding-marble",
    prompt:
      "A dramatic white marble statue of a young Indian man in a commanding heroic stance, arm extended forward pointing, wearing flowing classical robes and a laurel crown, ancient Roman emperor style, dramatic museum lighting with strong shadows, highly detailed marble texture, renaissance masterpiece quality, photorealistic render, full body statue on pedestal, 8k",
  },
  {
    name: "commanding-bronze",
    prompt:
      "A dramatic bronze statue of a young Indian man in a commanding heroic stance, arm raised forward, wearing elegant draped toga, dark bronze patina with warm golden and orange highlights, modern sculptural masterpiece, museum quality, dramatic side lighting, full body statue on stone pedestal, 8k detailed render",
  },
  {
    name: "commanding-stone",
    prompt:
      "An ancient weathered stone statue of a young Indian man in a commanding heroic pose, arm extended forward, carved from dark granite, covered partially with moss and lichen, ancient temple ruins aesthetic, mysterious foggy atmosphere, dramatic lighting through mist, archaeological treasure, full body statue, 8k",
  },
  {
    name: "commanding-ethereal",
    prompt:
      "A luminescent ethereal statue of a young Indian man in a commanding heroic stance, arm raised forward, glowing from within with soft blue and gold light, otherworldly divine presence, crystalline translucent texture, surrounded by floating particles of light and energy, celestial god aesthetic, full body statue, 8k cinematic",
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
    const result = await fal.subscribe("fal-ai/flux-general", {
      input: {
        prompt: style.prompt,
        image_url: imageUrl,
        image_strength: 0.55, // Slightly more creative freedom for pose change
        num_images: 1,
        image_size: "portrait_4_3",
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
    return null;
  } catch (error) {
    console.error(`Error generating ${style.name}:`, error.message);
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, "../public/statue-variations");
  fs.mkdirSync(outputDir, { recursive: true });

  const imageUrl = await uploadImage(sourceImagePath);

  console.log("\n=== Generating Commanding Pose in All Styles ===\n");

  const results = [];

  for (const style of commandingStyles) {
    const url = await generateStatue(style, imageUrl);
    if (url) {
      results.push({ name: style.name, url });
      console.log(`✓ ${style.name}: ${url}\n`);
    }
  }

  // Save URLs
  const resultsPath = path.join(outputDir, "commanding-urls.json");
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log("\n=== Generated Commanding Statue URLs ===\n");
  results.forEach((r) => {
    console.log(`${r.name}: ${r.url}`);
  });
}

main().catch(console.error);
