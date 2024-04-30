import type { DiffuseReflectionLightType, Sphere, Vector } from "./type";

export enum VIEWPORT {
  WIDTH = 1,
  HEIGHT = 1,
  DISTANCE = 1,
}
export const DEFAULT_COLOR: Sphere["color"] = [255, 255, 255];
export const CAMERA_POSITION: Vector = {
  x: 0,
  y: 0,
  z: 0,
};

export const SPHERES: Sphere[] = [
  {
    center: { x: 0, y: -1, z: 3 },
    radius: 1,
    color: [255, 0, 0],
  },
  {
    center: { x: 2, y: 0, z: 4 },
    radius: 1,
    color: [0, 0, 255],
  },
  {
    center: { x: -2, y: 0, z: 4 },
    radius: 1,
    color: [0, 255, 0],
  },
  {
    center: { x: 0, y: -5001, z: 0 },
    radius: 5000,
    color: [255, 255, 0],
  },
];

export const DIFFUSE_REFLECTION_LIGHTS: DiffuseReflectionLightType[] = [
  {
    type: "ambient",
    intensity: 0.2,
  },
  {
    type: "point",
    intensity: 0.6,
    position: {
      x: 2,
      y: 1,
      z: 0,
    },
  },
  {
    type: "directional",
    intensity: 0.2,
    position: {
      x: 1,
      y: 4,
      z: 4,
    },
  },
];
