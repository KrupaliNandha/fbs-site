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
  const filePath = path.join(UPLOADS_DIR, filename);

  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  if (watermarkEnabled) {
    const watermarkSvg = buildWatermarkSvgPattern(
      width,
      height,
      watermarkText || "DRAFT REVIEW",
    );
    await sharp(imageBuffer)
      .composite([{ input: watermarkSvg, blend: "over" }])
      .webp({ quality: 90 })
      .toFile(filePath);
  } else {
    await sharp(imageBuffer)
      .webp({ quality: 90 })
      .toFile(filePath);
  }

  const singleUrl = `/uploads/${filename}`;

  return {
    originalUrl: singleUrl,
    watermarkedUrl: singleUrl,
    thumbnailUrl: singleUrl,
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
