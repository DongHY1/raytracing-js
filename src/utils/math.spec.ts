import { describe, it, expect, beforeEach } from "vitest";
import {
	dotProduct,
	subtract,
	intersectRaySphere,
	canvasToViewport
} from "./math";
import { VIEWPORT, type Vector, type Sphere } from "../types";

describe("Vector operations", () => {
	let origin: Vector;
	let direction: Vector;
	let sphere: Sphere;
	beforeEach(() => {
		// 初始化变量
		origin = { x: 1, y: 2, z: 3 };
		direction = { x: 1, y: 1, z: 1 };
		sphere = {
			center: { x: 10, y: 10, z: 10 },
			radius: 2,
			color: [255, 255, 0],
		};
	});
	it("should subtract two vectors correctly", () => {
		expect(subtract(origin, direction)).toEqual({ x: 0, y: 1, z: 2 });
	});

	it("should calculate dot product of two vectors correctly", () => {
		expect(dotProduct(origin, direction)).toBe(6);
	});

	
	describe("Ray-Sphere Intersection", () => {
		it("should find intersections with a sphere correctly", () => {
			direction = { x: 0, y: 0, z: 1 }; // 特定测试调整方向
			sphere = {
				center: { x: 1, y: 2, z: 7 },
				radius: 2,
				color: [255, 255, 0],
			}; // 特定测试调整球体
			const result = intersectRaySphere(origin, direction, sphere);
			expect(result).toEqual([6, 2]);
		});
		it("should handle no intersections", () => {
			direction = { x: 0, y: 1, z: 0 }; // 射线垂直向上，而球心在远处
			sphere = {
				center: { x: 10, y: 10, z: 10 },
				radius: 2,
				color: [255, 255, 0],
			}; // 球心在不同的位置
			const result = intersectRaySphere(origin, direction, sphere);
			expect(result[0]).toBeNaN();
			expect(result[1]).toBeNaN();
		});
	});
	
	it("should convert canvas coordinates to viewport coordinates", () => {
		const mockCanvas = { width: 800, height: 600 } as HTMLCanvasElement;
		const x = 400;
		const y = 300;
		const result = canvasToViewport(x, y, mockCanvas);
		expect(result).toEqual({ x: 0.5, y: 0.5, z: VIEWPORT.DISTANCE });
	});
});
