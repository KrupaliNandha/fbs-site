import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");

// Ensure upload directory exists
export async function ensureUploadDirs() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
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
  const filename = `${filenamePrefix}_${timestamp}.webp`;
  const thumbFilename = `${filenamePrefix}_${timestamp}_thumb.webp`;
  const filePath = path.join(UPLOADS_DIR, filename);
  const thumbPath = path.join(UPLOADS_DIR, thumbFilename);

  const metadata = await sharp(imageBuffer).metadata();
  const rawWidth = metadata.width || 1200;
  const rawHeight = metadata.height || 800;

  // Max dimensions bound to accelerate Sharp processing & save network bandwidth
  const maxW = 2400;
  let pipeline = sharp(imageBuffer);
  if (rawWidth > maxW) {
    pipeline = pipeline.resize(maxW, undefined, { fit: "inside", withoutEnlargement: true });
  }

  const width = Math.min(rawWidth, maxW);
  const height = Math.round((rawHeight / rawWidth) * width);

  if (watermarkEnabled) {
    const watermarkSvg = buildWatermarkSvgPattern(
      width,
      height,
      watermarkText || "DRAFT REVIEW",
    );
    await pipeline
      .composite([{ input: watermarkSvg, blend: "over" }])
      .webp({ quality: 80, effort: 3 })
      .toFile(filePath);
  } else {
    await pipeline
      .webp({ quality: 80, effort: 3 })
      .toFile(filePath);
  }

  // Create lightweight 400px thumbnail for instant dashboard load
  await sharp(imageBuffer)
    .resize(400, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 75, effort: 3 })
    .toFile(thumbPath);

  return {
    originalUrl: `/uploads/${filename}`,
    watermarkedUrl: `/uploads/${filename}`,
    thumbnailUrl: `/uploads/${thumbFilename}`,
  };
}

export async function deleteUploadFilesByUrls(urls: (string | null | undefined)[]): Promise<void> {
  const uniqueUrls = Array.from(new Set(urls.filter((u): u is string => Boolean(u && u.startsWith("/uploads/")))));
  for (const url of uniqueUrls) {
    try {
      const relPath = url.replace(/^\/uploads\//, "");
      const fullPath = path.join(UPLOADS_DIR, relPath);
      await fs.unlink(fullPath);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}
