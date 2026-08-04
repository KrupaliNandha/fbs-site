import sharp, { OverlayOptions } from "sharp";

interface ImageInfo {
  buffer: Buffer;
  width: number;
  height: number;
  ratio: number;
}

export async function createAutoCollageBuffer(
  imageBuffers: Buffer[]
): Promise<Buffer> {
  if (!imageBuffers.length) {
    throw new Error("No images.");
  }

  if (imageBuffers.length === 1) {
    return imageBuffers[0];
  }

  const CANVAS_WIDTH = 1800;
  const PADDING = 10;
  const TARGET_ROW_HEIGHT = 350;

  const images: ImageInfo[] = [];

  for (const buffer of imageBuffers) {
    const meta = await sharp(buffer).metadata();

    images.push({
      buffer,
      width: meta.width || 1,
      height: meta.height || 1,
      ratio: (meta.width || 1) / (meta.height || 1),
    });
  }

  const rows: ImageInfo[][] = [];

  let currentRow: ImageInfo[] = [];
  let aspectSum = 0;

  for (const img of images) {
    currentRow.push(img);
    aspectSum += img.ratio;

    const estimatedWidth =
      aspectSum * TARGET_ROW_HEIGHT +
      (currentRow.length - 1) * PADDING;

    if (estimatedWidth >= CANVAS_WIDTH * 0.95) {
      rows.push(currentRow);
      currentRow = [];
      aspectSum = 0;
    }
  }

  if (currentRow.length) {
    rows.push(currentRow);
  }

  let totalHeight = PADDING;

  const overlays: OverlayOptions[] = [];

  for (const row of rows) {
    const rowAspect = row.reduce((a, b) => a + b.ratio, 0);

    const rowHeight =
      (CANVAS_WIDTH - (row.length + 1) * PADDING) /
      rowAspect;

    let left = PADDING;

    for (const img of row) {
      const width = Math.round(rowHeight * img.ratio);

      const resized = await sharp(img.buffer)
        .resize(width, Math.round(rowHeight), {
          fit: "cover",
          position: "centre",
        })
        .toBuffer();

      overlays.push({
        input: resized,
        left,
        top: totalHeight,
      });

      left += width + PADDING;
    }

    totalHeight += rowHeight + PADDING;
  }

  return sharp({
    create: {
      width: CANVAS_WIDTH,
      height: Math.ceil(totalHeight),
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1,
      },
    },
  })
    .composite(overlays)
    .jpeg({
      quality: 82,
      progressive: true,
    })
    .toBuffer();
}