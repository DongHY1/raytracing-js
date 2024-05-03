import {
	DEFAULT_COLOR,
	VIEWPORT,
	SPHERES,
	type Sphere,
	type Vector,
	DIFFUSE_REFLECTION_LIGHTS,
	MAX_DISTANCE,
	CAMERA_POSITION,
	MIN_DISTANCE,
} from "../types";
import {
	addition,
	computeNormal,
	multiply,
	dotProduct,
	magnitude,
	reflectRay,
	subtract,
	additionArray,
	multiplyArray,
} from "./vector";

// see: https://gabrielgambetta.com/computer-graphics-from-scratch/01-common-concepts.html
export function translateToCenterCoordinates(
	canvasWidth: number,
	canvasHeight: number,
	x: number,
	y: number,
) {
	return {
		x1: canvasWidth / 2 + x,
		y1: canvasHeight / 2 - y,
	};
}
// a = <D,D>,b = 2<CO,D>,c = <CO,CO> - r^2,a*t^2+b*t+c=0 求解 t 二元一次方程求解
export function intersectRaySphere(
	rayOrigin: Vector, // 射线原点
	rayDirection: Vector, // 射线方向
	sphere: Sphere, // 球体对象
): [number, number] {
	const oc: Vector = subtract(rayOrigin, sphere.center); // 射线原点到球心的向量
	const a: number = dotProduct(rayDirection, rayDirection); // D向量的点积
	const b: number = 2 * dotProduct(oc, rayDirection); // 2倍的<OC, D>点积
	const c: number = dotProduct(oc, oc) - sphere.radius ** 2; // OC向量的点积减去半径的平方
	const discriminant: number = b * b - 4 * a * c; // 判别式
	const t1: number = (-b + Math.sqrt(discriminant)) / (2 * a); // 一元二次方程的根
	const t2: number = (-b - Math.sqrt(discriminant)) / (2 * a);
	return [t1, t2];
}

// 将2D画布坐标转换为3D视口坐标
export function canvasToViewport(
	x: number, // 画布上的x坐标
	y: number, // 画布上的y坐标
	canvas: HTMLCanvasElement, // HTML画布元素
): Vector {
	return {
		x: (x * VIEWPORT.WIDTH) / canvas.width,
		y: (y * VIEWPORT.HEIGHT) / canvas.height,
		z: VIEWPORT.DISTANCE,
	};
}

function closestIntersection(
	rayOrigin: Vector,
	rayDirection: Vector,
	tMin: number,
	tMax: number,
) {
	let closestIntersectionDistance = tMax;
	let closestIntersectedSphere: Sphere | null = null;
	for (const sphere of SPHERES) {
		const intersectionDistances = intersectRaySphere(
			rayOrigin,
			rayDirection,
			sphere,
		);
		for (const distance of intersectionDistances) {
			if (
				distance < closestIntersectionDistance &&
				distance > tMin &&
				distance < tMax
			) {
				closestIntersectionDistance = distance;
				closestIntersectedSphere = sphere;
			}
		}
	}
	return { closestIntersectionDistance, closestIntersectedSphere };
}
// P=O+t(V−O) min<t<max
// 追踪射线，寻找最近的交点并计算颜色
export function traceRay(
	rayOrigin: Vector, // 射线的起点
	rayDirection: Vector, // 射线的方向
	tMin: number,
	tMax: number,
	recursionDepth: number, // 反射递归深度
): Sphere["color"] {
	const { closestIntersectionDistance, closestIntersectedSphere } =
		closestIntersection(rayOrigin, rayDirection, tMin, tMax);
	if (closestIntersectedSphere) {
		const intersectionPoint = addition(
			rayOrigin,
			multiply(subtract(rayDirection, rayOrigin), closestIntersectionDistance),
		);
		const normalAtIntersection = computeNormal(
			intersectionPoint,
			closestIntersectedSphere.center,
		); // 计算交点处的法线
		const viewDirection = subtract(multiply(rayDirection, -1), CAMERA_POSITION); // 计算视线方向
		const lightingIntensity = computeLighting(
			normalAtIntersection,
			intersectionPoint,
			viewDirection,
			closestIntersectedSphere.specular,
		); // 计算光照强度
		const localColor = multiplyArray(
			closestIntersectedSphere.color,
			lightingIntensity,
		);

		// 计算反射光
		const reflective = closestIntersectedSphere.reflective;
		if (reflective <= 0 || recursionDepth <= 0) {
			return localColor;
		}
		// 从交点出发向光源处作射线
		const reflectColor = traceRay(
			intersectionPoint,
			reflectRay(viewDirection, normalAtIntersection),
			0.001,
			MAX_DISTANCE,
			recursionDepth - 1,
		);
		return additionArray(
			multiplyArray(localColor, 1 - reflective),
			multiplyArray(reflectColor, reflective),
		);
	}
	return DEFAULT_COLOR;
}

// 根据光照模型计算光照强度
export function computeLighting(
	normalVector: Vector, // 交点处的法线向量
	intersectionPoint: Vector, // 射线与物体的交点
	viewDirection: Vector, // 从相机到交点的视线方向
	specularExponent: number, // 镜面高光系数
) {
	let totalIntensity = 0; // 初始化总光照强度
	let lightDirection: Vector; // 光源方向向量
	let normalDotLight: number; // 法线与光源方向的点积结果
	let reflectionVector: Vector; // 反射向量
	let reflectionDotView: number; // 反射向量与视线方向的点积结果
	let tMax: number;
	for (const light of DIFFUSE_REFLECTION_LIGHTS) {
		const type = light.type;
		if (type === "ambient") {
			totalIntensity += light.intensity;
		} else {
			if (type === "point") {
				lightDirection = subtract(light.position, intersectionPoint);
				tMax = 1;
			} else {
				lightDirection = light.position;
				tMax = MAX_DISTANCE;
			}
			// 阴影部分
			const { closestIntersectedSphere: closestIntersectedShadowSphere } =
				closestIntersection(intersectionPoint, lightDirection, 0.001, tMax);
			if (!closestIntersectedShadowSphere) {
				// 漫反射部分
				normalDotLight = dotProduct(normalVector, lightDirection);
				if (normalDotLight > 0) {
					totalIntensity +=
						(light.intensity * normalDotLight) /
						(magnitude(normalVector) * magnitude(lightDirection));
				}
				// 镜面反射部分
				if (specularExponent > 0) {
					reflectionVector = subtract(
						multiply(normalVector, 2 * normalDotLight),
						lightDirection,
					);
					reflectionDotView = dotProduct(reflectionVector, viewDirection);
					if (reflectionDotView > 0) {
						totalIntensity +=
							light.intensity *
							(reflectionDotView /
								(magnitude(reflectionVector) * magnitude(viewDirection))) **
								specularExponent;
					}
				}
			}
		}
	}
	return totalIntensity;
}
