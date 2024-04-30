export interface Vector {
	x: number;
	y: number;
	z: number;
}

export interface Sphere {
	center: Vector;
	radius: number;
	color: [number, number, number];
	specular: number; //反光，作为 (cosa)^x 的系数 x
}

export type DiffuseReflectionLightType =
	| { type: "ambient"; intensity: number }
	| { type: "point" | "directional"; intensity: number; position: Vector };
