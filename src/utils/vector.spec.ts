import { describe, it, expect, beforeEach } from "vitest";
import type { Vector } from "../types";
import { computeNormal, dotProduct, normalize, subtract } from "./vector";

describe("Vector operations", () => {
  let origin: Vector;
  let direction: Vector;
  let vector: Vector;
  beforeEach(() => {
    // 初始化变量
    origin = { x: 1, y: 2, z: 3 };
    direction = { x: 1, y: 1, z: 1 };
    vector = { x: 3, y: 4, z: 0 };
  });
  it("should subtract two vectors correctly", () => {
    expect(subtract(origin, direction)).toEqual({ x: 0, y: 1, z: 2 });
  });

  it("should calculate dot product of two vectors correctly", () => {
    expect(dotProduct(origin, direction)).toBe(6);
  });

  it("should normalize a vector correctly", () => {
    expect(normalize(vector)).toEqual({ x: 0.6, y: 0.8, z: 0 });
  });

  it("should compute normal correctly for off-center sphere", () => {
    const center: Vector = { x: 2, y: 2, z: 2 };
    const point: Vector = { x: 2, y: 2, z: 10 };
    expect(computeNormal(point, center)).toEqual({ x: 0, y: 0, z: 1 }); // 预期是单位向量
  });

  it("should throw an error when trying to normalize a zero-length vector", () => {
    const center: Vector = { x: 1, y: 1, z: 1 };
    const point: Vector = { x: 1, y: 1, z: 1 };
    expect(() => computeNormal(point, center)).toThrowError();
  });
});
