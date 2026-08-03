import sharp, { type OverlayOptions } from "sharp";

export async function createAutoCollageBuffer(imageBuffers: Buffer[]): Promise<Buffer> {
  if (imageBuffers.length === 0) {
    throw new Error("At least one image buffer is required to create a collage.");
  }
  if (imageBuffers.length === 1) {
    return imageBuffers[0];
  }

  const canvasWidth = 1600;
  const canvasHeight = 1200;
  const padding = 20;

  const count = imageBuffers.length;
  let cols = Math.ceil(Math.sqrt(count));
  let rows = Math.ceil(count / cols);

  const availableWidth = canvasWidth - padding * (cols + 1);
  const availableHeight = canvasHeight - padding * (rows + 1);

  const tileWidth = Math.floor(availableWidth / cols);
  const tileHeight = Math.floor(availableHeight / rows);

  const compositeInputs: OverlayOptions[] = [];

  for (let i = 0; i < count; i++) {
    const colIndex = i % cols;
    const rowIndex = Math.floor(i / cols);

    const left = padding + colIndex * (tileWidth + padding);
    const top = padding + rowIndex * (tileHeight + padding);

    // Rescale image buffer to fit nicely inside tile maintaining aspect ratio
    const resizedTile = await sharp(imageBuffers[i])
      .resize(tileWidth, tileHeight, {
        fit: "contain",
        background: { r: 245, g: 247, b: 250, alpha: 1 },
      })
      .toBuffer();

    compositeInputs.push({
      input: resizedTile,
      left,
      top,
    });
  }

  // Create clean white background canvas and composite tiles
  return sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite(compositeInputs)
    .png()
    .toBuffer();
}
