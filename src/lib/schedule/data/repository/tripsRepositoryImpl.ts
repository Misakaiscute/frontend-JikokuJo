import type TripsRepository from "./tripsRepository.ts";
import type { ApiResult } from "../../../core/data/remote/apiResult.ts";
import type {Queryable, Route, Stop} from "../model/queryable.ts";
import type { StopDetailed } from "../model/stopDetailed.ts";
import type { Trip } from "../model/trip.ts";
import type { RootResponse } from "../../../core/data/remote/apiResponseStructure.ts";
import type {GetShapesForTripObj, GetStopsForTripObj, GetTripsObj} from "../remote/apiResponseStructure.ts";
import type { RoutePathPoint } from "../model/location.ts";
import Api from "../../../core/data/remote/api.ts";

export default class TripsRepositoryImpl implements TripsRepository {
    public shapes: Map<string, ApiResult<RoutePathPoint[] | null>> = new Map<string, ApiResult<RoutePathPoint[] | null>>();
    public stops: Map<string, ApiResult<StopDetailed[] | null>> = new Map<string, ApiResult<StopDetailed[] | null>>();
    public trips: ApiResult<Trip[] | null> | null = null;

    async getStops(tripId: string): Promise<void> {
        if (this.stops.has(tripId) && this.stops.get(tripId)!!.kind === "fulfill") {
            return;
        }
        const url: string = Api.api + `trip/${tripId}/stops`;

        let response!: Response;
        try {
            response = await fetch(url);
        } catch (e) {
            throw new Error("Szerver nem elérhető.")
        }
        const body = await response.json() as RootResponse<GetStopsForTripObj>;
        if (!response.ok) {
            this.stops.set(tripId, {
                kind: "reject",
                data: null,
                errors: body.errors
            });
            throw new Error(this.stops.get(tripId)?.errors[0] ?? "Valami hiba történt.");
        } else {
            this.stops.set(tripId, {
                kind: "fulfill",
                data: body.data.stops,
                errors: []
            });
            return;
        }
    }
    async getShapes(tripId: string): Promise<void> {
        if (this.shapes.has(tripId) && this.shapes.get(tripId)!!.kind === "fulfill") {
            return;
        }
        const url: string = Api.api + `trip/${tripId}/shapes`;

        let response!: Response;
        try {
            response = await fetch(url);
        } catch (e) {
            throw new Error("Szerver nem elérhető.")
        }
        const body = await response.json() as RootResponse<GetShapesForTripObj>;
        if (!response.ok) {
            this.shapes.set(tripId, {
                kind: "reject",
                data: null,
                errors: body.errors
            });
            throw new Error(this.shapes.get(tripId)?.errors[0] ?? "Valami hiba történt.");
        } else {
            this.shapes.set(tripId, {
                kind: "fulfill",
                data: body.data.shapes,
                errors: []
            });
            return;
        }
    }
    async getTrips(selectedQueryable: Queryable, dateTime: Date): Promise<void> {
        const dateFormatted: string = dateTime.getFullYear() + String(dateTime.getMonth() + 1).padStart(2, '0') + String(dateTime.getDate()).padStart(2, '0');
        const timeFormatted: string = String(dateTime.getHours()).padStart(2, '0') + String(dateTime.getMinutes()).padStart(2, '0');

        let url: string;
        let response!: Response;
        if (selectedQueryable.kind === "stop"){
            url = Api.api + "stop/trip";
            const reqBody = {
                ids: selectedQueryable.ids,
                date: dateFormatted,
                time: timeFormatted
            };
            try {
                response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reqBody)
                });
            } catch (e) {
                throw new Error("Szerver nem elérhető.")
            }
        } else {
            url = Api.api + `route/${selectedQueryable.route_id}/time/${dateFormatted}/${timeFormatted}`;
            try {
                response = await fetch(url);
            } catch (e) {
                throw new Error("Szerver nem elérhető.")
            }
        }

        const body = await response.json() as RootResponse<GetTripsObj>;
        if (!response.ok) {
            this.trips = {
                kind: "reject",
                data: null,
                errors: body.errors
            };
            throw new Error(this.trips.errors[0] ?? "Valami hiba történt.");
        } else {
            this.trips = {
                kind: "fulfill",
                data: body.data.trips,
                errors: []
            };
            return;
        }
    }
}