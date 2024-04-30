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

export type DiffuseReflectionLightType =
  | { type: "ambient"; intensity: number }
  | { type: "point" | "directional"; intensity: number; position: Vector };
