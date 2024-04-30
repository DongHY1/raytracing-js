import type { Sphere } from "../types";
import { translateToCenterCoordinates } from "./math";

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private canvasBuffer: ImageData;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvasContext = this.canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    this.canvasBuffer = this.canvasContext.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
  public putPixel(x: number, y: number, color: Sphere["color"]) {
    // Transform the coordinate (x, y) into the canvas coordinate system (x1, y1)
    // x1 and y1 are centered around the middle of the canvas:
    // This moves the origin (0, 0) from the top-left corner to the center of the canvas
    const { x1, y1 } = translateToCenterCoordinates(
      this.canvas.width,
      this.canvas.height,
      x,
      y
    );
    if (
      x1 < 0 ||
      x1 >= this.canvas.width ||
      y1 < 0 ||
      y1 >= this.canvas.height
    ) {
      return;
    }
    // Calculate the offset for the pixel data in the canvasBuffer:
    // 1. '4 * x1' accounts for each pixel taking up 4 bytes (RGBA)
    // 2. 'this.canvasBuffer.width * 4 * y1' calculates the start of the row for y1
    //    and multiplies by 4 because each pixel in the row takes up 4 bytes
    let offset = 4 * x1 + this.canvasBuffer.width * 4 * y1;
    this.canvasBuffer.data[offset++] = color[0];
    this.canvasBuffer.data[offset++] = color[1];
    this.canvasBuffer.data[offset++] = color[2];
    this.canvasBuffer.data[offset++] = 255;
  }

  public refreshCanvas() {
    this.canvasContext.putImageData(this.canvasBuffer, 0, 0);
  }
}
