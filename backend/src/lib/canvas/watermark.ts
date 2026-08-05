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
  const rawText = (text || "CONFIDENTIAL REVIEW").trim() || "CONFIDENTIAL REVIEW";
  const safeText = escapeXml(rawText);

  // Font size scales with image, but stays moderate so text stays readable without crowding
  const fontSize = Math.max(18, Math.min(42, Math.floor(Math.min(width, height) / 32)));

  // Approximate rendered width of bold Arial (~0.62em per character)
  const estimatedTextWidth = Math.ceil(fontSize * 0.62 * rawText.length);

  // Pattern cell must be larger than the text so tiles don't stack on each other
  // Horizontal gap ≈ 1.4× text width; vertical gap ≈ 3.5× font size (diagonal spacing)
  const patternW = Math.max(
    estimatedTextWidth + fontSize * 4,
    Math.floor(width / 2.5),
    320,
  );
  const patternH = Math.max(fontSize * 3.5, Math.floor(height / 5), 140);

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="wmPattern"
          width="${patternW}"
          height="${patternH}"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-28 ${width / 2} ${height / 2})"
        >
          <!-- Single centered label per cell — large cell = clear spacing between repeats -->
          <text
            x="${patternW / 2}"
            y="${patternH / 2}"
            font-family="Arial, Helvetica, sans-serif"
            font-size="${fontSize}"
            font-weight="700"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="rgba(0, 0, 0, 0.12)"
            stroke-width="0.8"
            text-anchor="middle"
            dominant-baseline="middle"
            letter-spacing="1.5"
          >${safeText}</text>
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
