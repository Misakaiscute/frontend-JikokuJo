import type {Payload} from "./../../../core/data/remote/apiResponseStructure.ts";
import type {Route, Stop} from "../model/queryable.ts";
import type {StopDetailed} from "../model/stopDetailed.ts";
import type {RoutePathPoint} from "../model/location.ts";
import type {Trip} from "../model/trip.ts";

export interface GetQueryablesObj extends Payload {
    stops: Stop[],
    routes: Route[]
}

export interface GetStopsForTripObj extends Payload {
    stops: StopDetailed[]
}

export interface GetShapesForTripObj extends Payload {
    shape_id: string;
    points: RoutePathPoint[]
}

export interface GetTripsObj extends Payload {
    trips: Trip[]
}