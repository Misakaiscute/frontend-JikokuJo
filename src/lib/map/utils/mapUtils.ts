import type {Location, RoutePathPoint} from "../../schedule/data/model/location.ts";
import type {StopDetailed} from "../../schedule/data/model/stopDetailed.ts";
import distanceBetweenPoints from "./mathUtils.ts";

export default class MapUtils {
    findCenterPoint = (points: RoutePathPoint[]): Location => {
        if (points.length < 1) {
            throw new Error("Points must be greater than 1");
        }
        const centerX: number = points.reduce((previousValue: number, currentValue: RoutePathPoint) =>
            previousValue + currentValue.location.lat, 0
        ) / points.length;
        const centerY: number = points.reduce((previousValue: number, currentValue: RoutePathPoint) =>
            previousValue + currentValue.location.lon, 0
        ) / points.length;

        return { lat: centerX, lon: centerY };
    }

    findSwitchingPoint = (target: StopDetailed, points: RoutePathPoint[]): number => {
        if (points.length < 1) {
            throw new Error("Points must be greater than 1");
        }
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
}
