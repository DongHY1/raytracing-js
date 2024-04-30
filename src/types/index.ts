export interface Vector {
  x: number;
  y: number;
  z: number;
}

export interface Sphere {
  center: Vector;
  radius: number;
  color: [number, number, number];
}

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
export const spheres: Sphere[] = [
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
];
