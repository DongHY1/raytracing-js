import type { Vector } from "../types";

export function addition(v1: Vector, v2: Vector): Vector {
	return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
}

export function subtract(v1: Vector, v2: Vector): Vector {
	return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
}
export function dotProduct(v1: Vector, v2: Vector) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
export function crossProduct(v: Vector, index: number) {
	return { x: v.x * index, y: v.y * index, z: v.z * index };
}

export function magnitude(v: Vector): number {
	return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

export function normalize(v: Vector): Vector {
	const len = magnitude(v);
	if (len === 0) {
		throw new Error("Cannot normalize a zero-length vector");
	}
	return { x: v.x / len, y: v.y / len, z: v.z / len };
}

export function computeNormal(
	v: Vector,
	center: Vector = { x: 0, y: 0, z: 0 },
): Vector {
	// Subtract the center from v to get the vector pointing from the center to the point
	const fromCenterToPoint = subtract(v, center);
	// Normalize this vector to get the unit normal vector
	return normalize(fromCenterToPoint);
}
