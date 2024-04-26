import {
	DEFAULT_COLOR,
	VIEWPORT,
	spheres,
	type Sphere,
	type Vector,
} from "../types";

export function subtract(v1: Vector, v2: Vector): Vector {
	return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
}

export function dotProduct(v1: Vector, v2: Vector): number {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

// a = <D,D>,b = 2<CO,D>,c = <CO,CO> - r^2,a*t^2+b*t+c=0 求解 t 二元一次方程求解
export function intersectRaySphere(
	origin: Vector,
	direction: Vector,
	sphere: Sphere,
): [number, number] {
	const oc: Vector = subtract(origin, sphere.center);
	const a: number = dotProduct(direction, direction); // a = <D,D>
	const b: number = 2 * dotProduct(oc, direction); // b = 2<CO,D>
	const c: number = dotProduct(oc, oc) - sphere.radius ** 2; // c = <CO,CO> - r^2
	const discriminant: number = b * b - 4 * a * c; // b^2 - 4*a*c
	const t1: number = (-b + Math.sqrt(discriminant)) / (2 * a);
	const t2: number = (-b - Math.sqrt(discriminant)) / (2 * a);
	return [t1, t2];
}

// 2D canvas coordinates to 3D viewport coordinates.
export function canvasToViewport(
	x: number,
	y: number,
	canvas: HTMLCanvasElement,
): Vector {
	return {
		x: (x * VIEWPORT.WIDTH) / canvas.width,
		y: (y * VIEWPORT.HEIGHT) / canvas.height,
		z: VIEWPORT.DISTANCE,
	};
}

// P=O+t(V−O) min<t<max
export function traceRay(
	origin: Vector,
	direction: Vector,
	minT: number,
	maxT: number,
) {
	let closestT = Number.POSITIVE_INFINITY;
	let closestSphere: Sphere | null = null;
	for (let i = 0; i < spheres.length; i++) {
		const ts = intersectRaySphere(origin, direction, spheres[i]);
		// 找符合t>1距离最近的点
		if (ts[0] < closestT && ts[0] > minT && ts[0] < maxT) {
			closestT = ts[0];
			closestSphere = spheres[i];
		}
		if (ts[1] < closestT && ts[1] > minT && ts[1] < maxT) {
			closestT = ts[1];
			closestSphere = spheres[i];
		}
	}

	return closestSphere ? closestSphere.color : DEFAULT_COLOR;
}
