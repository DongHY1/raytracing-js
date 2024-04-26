import type { Sphere } from "../types";

export class CanvasRenderer {
	private canvas: HTMLCanvasElement;
	private canvasContext: CanvasRenderingContext2D;
	private canvasBuffer: ImageData;

	constructor(canvasId: string) {
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.canvasContext = this.canvas.getContext(
			"2d",
		) as CanvasRenderingContext2D;
		this.canvasBuffer = this.canvasContext.getImageData(
			0,
			0,
			this.canvas.width,
			this.canvas.height,
		);
	}
	public getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}
	public putPixel(x: number, y: number, color: Sphere["color"]) {
		const x1 = this.canvas.width / 2 + x;
		const y1 = this.canvas.height / 2 - y - 1;
		if (
			x1 < 0 ||
			x1 >= this.canvas.width ||
			y1 < 0 ||
			y1 >= this.canvas.height
		) {
			return;
		}
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
