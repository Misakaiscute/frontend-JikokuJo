import type {Location, RoutePathPoint} from "../schedule/data/model/location.ts";

export const findCenterPoint = (points: RoutePathPoint[]): Location => {
    const centerX: number = points.reduce((previousValue: number, currentValue: RoutePathPoint) =>
        previousValue + currentValue.location.lat, 0
    ) / points.length;
    const centerY: number = points.reduce((previousValue: number, currentValue: RoutePathPoint) =>
        previousValue + currentValue.location.lon, 0
    ) / points.length;

    return { lat: centerX, lon: centerY };
}