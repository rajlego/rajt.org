// Shared config for all experiment swarm scripts
// v1 — 2026-02-20
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const FAL_KEY = "05e70dd5-3f83-480b-9738-8bd087a2d104:7a37ddc0dd5ec0bf49b1f5dc44d16fe0";

// Source photos
export const PHOTOS = {
  kimono_full: "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/1/1B430110-001E-457F-849C-7C7D539C2152_1_105_c.jpeg",
  kimono_close: "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/9/957FA93D-170A-42D4-8CB2-868B9E915F4A_1_105_c.jpeg",
  mirror_selfie: "/Users/rajthimmiah/Pictures/Photos Library.photoslibrary/resources/derivatives/masters/4/402C3759-966A-4C07-AA77-AF1C770A3CBE_4_5005_c.jpeg",
};

// 28 style prompts across 3 categories
export const STYLES = [
  // Sculpture (12)
  { name: "marble", category: "sculpture", prompt: "portrait as a white marble sculpture bust, classical greco-roman style, museum lighting, dramatic shadows, dark background, hyper realistic marble texture, masterpiece quality" },
  { name: "bronze", category: "sculpture", prompt: "portrait as a bronze sculpture bust, dark patina with golden highlights, museum quality, dramatic warm lighting, dark background, hyper realistic bronze metal texture" },
  { name: "granite", category: "sculpture", prompt: "portrait as a granite sculpture bust, rough hewn grey stone texture, powerful monolithic feel, dramatic directional lighting, museum pedestal, dark background" },
  { name: "ethereal-crystal", category: "sculpture", prompt: "portrait with glowing ethereal crystalline skin, luminescent blue and gold light emanating from within, divine celestial being, floating light particles, dark background" },
  { name: "obsidian", category: "sculpture", prompt: "portrait as a polished obsidian sculpture, volcanic glass with razor-sharp edges, deep black with purple reflections, dramatic rim lighting, mystical dark background" },
  { name: "jade", category: "sculpture", prompt: "portrait as a carved jade sculpture, translucent green jade with inner glow, imperial Chinese craftsmanship, ornate details, silk backdrop, warm museum lighting" },
  { name: "gold-gilded", category: "sculpture", prompt: "portrait as a solid gold sculpture bust, 24 karat gold with mirror polish, ornate baroque detailing, dramatic golden light, royal museum setting, dark velvet background" },
  { name: "terracotta", category: "sculpture", prompt: "portrait as a terracotta sculpture bust, warm orange-brown clay, ancient craftsmanship, fine detail, archaeological museum lighting, earth tones" },
  { name: "ice-frost", category: "sculpture", prompt: "portrait as an ice sculpture, frozen crystal-clear ice with frost patterns, blue-white luminescence, cold mist emanating, winter aurora background, magical frozen art" },
  { name: "porcelain", category: "sculpture", prompt: "portrait as fine porcelain sculpture, delicate white china with blue accents, Meissen quality, translucent edges, soft museum lighting, pristine white background" },
  { name: "copper-verdigris", category: "sculpture", prompt: "portrait as a copper sculpture with verdigris patina, green oxidation on aged copper, Statue of Liberty aesthetic, dramatic sky background, weathered noble metal" },
  { name: "onyx", category: "sculpture", prompt: "portrait as a carved onyx sculpture, layered black and white banded stone, exquisite lapidary detail, dramatic side lighting, gemstone quality polish" },

  // Art styles (8)
  { name: "renaissance", category: "art", prompt: "portrait in Renaissance oil painting style, Leonardo da Vinci technique, sfumato, dramatic chiaroscuro lighting, rich colors, ornate gilded frame, museum masterpiece quality" },
  { name: "baroque-chiaroscuro", category: "art", prompt: "portrait in Baroque style, extreme Caravaggio chiaroscuro, dramatic light and shadow, rich dark background, oil painting texture, emotional intensity, museum quality" },
  { name: "art-deco", category: "art", prompt: "portrait in Art Deco style, geometric patterns, gold and black color palette, streamlined glamour, 1920s elegance, Tamara de Lempicka inspired, sleek metallic accents" },
  { name: "cyberpunk-neon", category: "art", prompt: "portrait in cyberpunk style, neon pink and blue lighting, holographic skin overlay, circuit patterns, rain-slicked city reflection, futuristic chrome accents, high contrast" },
  { name: "ukiyo-e", category: "art", prompt: "portrait in Japanese ukiyo-e woodblock print style, bold outlines, flat color areas, traditional Japanese aesthetics, cherry blossoms, wave patterns, Hokusai inspired" },
  { name: "pop-art", category: "art", prompt: "portrait in Andy Warhol pop art style, bold primary colors, halftone dots, screen print aesthetic, multiple color variations, graphic bold outlines, cultural icon treatment" },
  { name: "vaporwave", category: "art", prompt: "portrait in vaporwave aesthetic, pink and purple gradient, Roman bust remix, glitch effects, retrowave grid, palm trees, sunset colors, 80s nostalgia, chrome text" },
  { name: "ghibli-anime", category: "art", prompt: "portrait in Studio Ghibli anime style, soft watercolor backgrounds, warm lighting, detailed expressive eyes, Hayao Miyazaki character design, gentle wind effect, natural beauty" },

  // Fantasy (8)
  { name: "glitch-art", category: "fantasy", prompt: "portrait as glitch art, digital corruption effects, RGB channel splitting, pixel sorting, data moshing, cybernetic distortion, matrix-style digital rain overlay, screen artifacts" },
  { name: "steampunk-brass", category: "fantasy", prompt: "portrait as steampunk brass automaton, intricate clockwork mechanisms, Victorian engineering, copper gears and pipes, steam vents, amber glass eyes, workshop lighting" },
  { name: "bioluminescent", category: "fantasy", prompt: "portrait with bioluminescent deep sea creature aesthetic, glowing blue-green spots, translucent skin with light beneath, dark ocean depths, ethereal underwater lighting, jellyfish tendrils" },
  { name: "nebula-cosmic", category: "fantasy", prompt: "portrait composed of nebula gas clouds and stars, cosmic entity, galaxy swirls forming features, constellation eyes, stellar nursery colors, deep space background, astronomical wonder" },
  { name: "stained-glass", category: "fantasy", prompt: "portrait as a stained glass window, leaded glass segments, rich jewel-tone colors, cathedral light streaming through, gothic arch frame, medieval craftsmanship, backlit radiance" },
  { name: "tarot-card", category: "fantasy", prompt: "portrait as a major arcana tarot card, ornate border design, mystical symbols, gold foil accents, celestial motifs, Art Nouveau styling, mystical and prophetic mood" },
  { name: "egyptian-pharaoh", category: "fantasy", prompt: "portrait as an Egyptian pharaoh, golden nemes headdress, lapis lazuli and gold jewelry, kohl-lined eyes, hieroglyphic background, tomb painting meets photorealism, divine ruler aesthetic" },
  { name: "samurai-armor", category: "fantasy", prompt: "portrait wearing ornate samurai armor, kabuto helmet with maedate crest, lacquered plates, silk cords, menpo face guard lowered, dramatic battlefield lighting, warrior nobility" },
];

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

export async function uploadImage(fal, imagePath) {
  const buffer = fs.readFileSync(imagePath);
  const blob = new Blob([buffer], { type: "image/jpeg" });
  const file = new File([blob], path.basename(imagePath), { type: "image/jpeg" });
  return await fal.storage.upload(file);
}
