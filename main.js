import { subtract, dotProduct } from "./utils";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
const canvasPitch = canvasBuffer.width * 4; // [R,G,B,A] 四个字节

// viewport 大小
const Vw = 1;
const Vh = 1;
// 摄像机距离
const d = 1;

// 摄像机位置
const cameraPosition = [0, 0, 0];

// 默认颜色
const backgroundColor = [255, 255, 255];

const spheres = [
	{
		center: [0, -1, 3],
		radius: 1,
		color: [255, 0, 0],
	},
	{
		center: [2, 0, 4],
		radius: 1,
		color: [0, 0, 255],
	},
	{
		center: [-2, 0, 4],
		radius: 1,
		color: [0, 255, 0],
	},
];

// Converts 2D canvas coordinates to 3D viewport coordinates.
// [Vx,Vy,Vz]
function canvasToViewport(x, y) {
	return [(x * Vw) / canvas.width, (y * Vh) / canvas.height, d];
}

// a = <D,D>
// b = 2<CO,D>
// c = <CO,CO> - r^2
// a*t^2+b*t+c=0
// 求解 t 二元一次方程求解
function intersectRaySphere(origin, direction, sphere) {
	const oc = subtract(origin, sphere.center);
	const k1 = dotProduct(direction, direction);
	const k2 = 2 * dotProduct(oc, direction);
	const k3 = dotProduct(oc, oc) - sphere.radius ** 2;
	const discriminant = k2 * k2 - 4 * k1 * k3; // b^2 - 4ac
	const t1 = (-k2 + Math.sqrt(discriminant)) / (2 * k1);
	const t2 = (-k2 - Math.sqrt(discriminant)) / (2 * k1);
	return [t1, t2];
}

// P=O+t(V−O) min<t<max
function traceRay(origin, direction, minT, maxT) {
	let closestT = Number.POSITIVE_INFINITY;
	let closestSphere = null;
	for (let i = 0; i < spheres.length; i++) {
		const ts = intersectRaySphere(origin, direction, spheres[i]);
		// 找到两个点，在射线范围 t > 1 内距离最近的
		if (ts[0] < closestT && ts[0] > minT && ts[0] < maxT) {
			closestT = ts[0];
			closestSphere = spheres[i];
		}
		if (ts[1] < closestT && ts[1] > minT && ts[1] < maxT) {
			closestT = ts[1];
			closestSphere = spheres[i];
		}
	}
	return closestSphere ? closestSphere.color : backgroundColor;
}

function putPixel(x, y, color) {
	const x1 = canvas.width / 2 + x;
	const y1 = canvas.height / 2 - y - 1;
	if (x1 < 0 || x1 >= canvas.width || y1 < 0 || y1 >= canvas.height) {
		return;
	}
	// 使用 canvasPitch 可以帮助我们在 ImageData 的 .data 数组中定位任何一个像素的起始位置。
	// 给定一个像素的 (x, y) 坐标，该像素在数组中的起始索引可以通过以下公式计算得到：
	// x * 4 是因为每个像素由四个字节组成（R、G、B 和 A），而 y * canvasPitch 计算了到达当前行之前需要跳过的所有字节。
	let offset = 4 * x1 + canvasPitch * y1;
	canvasBuffer.data[offset++] = color[0];
	canvasBuffer.data[offset++] = color[1];
	canvasBuffer.data[offset++] = color[2];
	canvasBuffer.data[offset++] = 255; // Alpha = 255 (full opacity)
}

function init() {
	for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
		for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
			const direction = canvasToViewport(x, y);
			const color = traceRay(cameraPosition, direction, 1, Number.POSITIVE_INFINITY);
			putPixel(x, y, color);
		}
	}
	ctx.putImageData(canvasBuffer, 0, 0);
}
init();
