import type {ApiResult} from "../../../core/data/remote/apiResult.ts";
import type {StopDetailed} from "../model/stopDetailed.ts";
import type {Trip} from "../model/trip.ts";
import type {RoutePathPoint} from "../model/location.ts";
import type {Queryable} from "../model/queryable.ts";

export default interface TripsRepository{
    shapes: Map<string, ApiResult<RoutePathPoint[] | null>>;
    stops: Map<string, ApiResult<StopDetailed[] | null>>;
    trips: ApiResult<Trip[] | null> | null;

    getStops(tripId: string): void;
    getShapes(tripId: string): void;
    getTrips(selectedQueryable: Queryable, dateTime: Date): void;
}