import type {ApiResult} from "../../../core/data/remote/apiResult.ts";
import type {StopDetailed} from "../model/stopDetailed.ts";
import type {Trip} from "../model/trip.ts";
import type {RoutePathPoint} from "../model/location.ts";
import type {Queryable} from "../model/queryable.ts";

export default interface TripsRepository{
    shapes: Map<string, ApiResult<RoutePathPoint[] | null>>;
    stops: Map<string, ApiResult<StopDetailed[] | null>>;

    getStops(trip: Trip): Promise<StopDetailed[]>;
    getShapes(trip: Trip): Promise<RoutePathPoint[]>;
    getTrips(selectedQueryable: Queryable, dateTime: Date): Promise<Trip[]>;
    openBroadcast(forTrip: Trip): Promise<void>;
}