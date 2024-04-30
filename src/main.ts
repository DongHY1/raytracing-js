import { CAMERA_POSITION } from "./types";
import { CanvasRenderer, canvasToViewport, traceRay } from "./utils";

function init() {
	const canvasRenderer = new CanvasRenderer("canvas");
	const canvas = canvasRenderer.getCanvas();
	for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
		for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
			const direction = canvasToViewport(x, y, canvas);
			const color = traceRay(CAMERA_POSITION, direction);
			canvasRenderer.putPixel(x, y, color);
		}
	}
	canvasRenderer.refreshCanvas();
}
init();
