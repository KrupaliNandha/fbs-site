import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");

// Ensure upload directories exist
export async function ensureUploadDirs() {
  await fs.mkdir(path.join(UPLOADS_DIR, "originals"), { recursive: true });
  await fs.mkdir(path.join(UPLOADS_DIR, "watermarked"), { recursive: true });
  await fs.mkdir(path.join(UPLOADS_DIR, "thumbnails"), { recursive: true });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildWatermarkSvgPattern(
  width: number,
  height: number,
  text: string,
): Buffer {
  const safeText = escapeXml(text || "CONFIDENTIAL REVIEW");
  const fontSize = Math.max(24, Math.floor(width / 20));
  const patternSize = Math.max(250, Math.floor(width / 4));

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wmPattern" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <text 
            x="${patternSize / 2}" 
            y="${patternSize / 2}" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="${fontSize}" 
            font-weight="bold" 
            fill="rgba(255, 255, 255, 0.28)" 
            stroke="rgba(0, 0, 0, 0.15)"
            stroke-width="1"
            text-anchor="middle" 
            dominant-baseline="central">
            ${safeText}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wmPattern)" />
    </svg>
  `;

  return Buffer.from(svg);
}

export async function processCanvasImage(
  imageBuffer: Buffer,
  filenamePrefix: string,
  watermarkEnabled: boolean,
  watermarkText?: string,
): Promise<{
  originalUrl: string;
  watermarkedUrl: string;
  thumbnailUrl: string;
}> {
  await ensureUploadDirs();

  const timestamp = Date.now();
  const baseFilename = `${filenamePrefix}_${timestamp}`;

  const originalFilename = `${baseFilename}_orig.webp`;
  const watermarkedFilename = `${baseFilename}_wm.webp`;
  const thumbnailFilename = `${baseFilename}_thumb.webp`;

  const originalPath = path.join(UPLOADS_DIR, "originals", originalFilename);
  const watermarkedPath = path.join(UPLOADS_DIR, "watermarked", watermarkedFilename);
  const thumbnailPath = path.join(UPLOADS_DIR, "thumbnails", thumbnailFilename);

  // 1. Save pristine original image as WebP
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  await sharp(imageBuffer).webp({ quality: 90 }).toFile(originalPath);

  // 2. Generate Watermarked Image
  if (watermarkEnabled) {
    const watermarkSvg = buildWatermarkSvgPattern(
      width,
      height,
      watermarkText || "DRAFT REVIEW",
    );
    await sharp(imageBuffer)
      .composite([{ input: watermarkSvg, blend: "over" }])
      .webp({ quality: 88 })
      .toFile(watermarkedPath);
  } else {
    await sharp(imageBuffer).webp({ quality: 88 }).toFile(watermarkedPath);
  }

  // 3. Generate Thumbnail Image
  await sharp(imageBuffer)
    .resize(400, 300, { fit: "inside" })
    .webp({ quality: 80 })
    .toFile(thumbnailPath);

  return {
    originalUrl: `/uploads/originals/${originalFilename}`,
    watermarkedUrl: `/uploads/watermarked/${watermarkedFilename}`,
    thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`,
  };
}

export async function deleteUploadFilesByUrls(urls: (string | null | undefined)[]): Promise<void> {
  for (const url of urls) {
    if (!url || !url.startsWith("/uploads/")) continue;
    try {
      const relPath = url.replace(/^\/uploads\//, "");
      const fullPath = path.join(UPLOADS_DIR, relPath);
      await fs.unlink(fullPath);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}
