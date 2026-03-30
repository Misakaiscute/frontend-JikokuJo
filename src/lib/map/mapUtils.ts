import type {Location, RoutePathPoint} from "../schedule/data/model/location.ts";
import type {StopDetailed} from "../schedule/data/model/stopDetailed.ts";

export const findCenterPoint = (points: RoutePathPoint[]): Location => {
    const centerX: number = points.reduce((previousValue: number, currentValue: RoutePathPoint) =>
        previousValue + currentValue.location.lat, 0
    ) / points.length;
    const centerY: number = points.reduce((previousValue: number, currentValue: RoutePathPoint) =>
        previousValue + currentValue.location.lon, 0
    ) / points.length;

    return { lat: centerX, lon: centerY };
}

export const findSwitchingPoint = (target: StopDetailed, points: RoutePathPoint[]): number => {
    let closestIndex: number = 0;
    let closestDistance: number = distanceBetweenPoints(target.location.lat, points[0].location.lat, target.location.lon, points[0].location.lon);
    for (let i = 1; i < points.length; i++) {
        if (closestDistance === 0){
            return closestIndex;
        } else {
            const currentDistance: number = distanceBetweenPoints(target.location.lat, points[i].location.lat, target.location.lon, points[i].location.lon);
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance;
                closestIndex = i;
            }
        }
    }
    return closestIndex;
}

const distanceBetweenPoints = (x1: number, x2: number, y1: number, y2: number): number => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}