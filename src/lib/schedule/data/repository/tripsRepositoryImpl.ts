import type TripsRepository from "./tripsRepository.ts";
import type { ApiResult } from "../../../core/data/remote/apiResult.ts";
import type { Queryable, Route, Stop } from "../model/queryable.ts";
import type { StopDetailed } from "../model/stopDetailed.ts";
import type { Trip } from "../model/trip.ts";
import type { RootResponse } from "../../../core/data/remote/apiResponseStructure.ts";
import type { GetShapesForTripObj, GetStopsForTripObj, GetTripsObj } from "../remote/apiResponseStructure.ts";
import type { RoutePathPoint } from "../model/location.ts";
import Api from "../../../core/data/remote/api.ts";
import {timeFormatter} from "../../../core/utils/timeFormatter.ts";

export default class TripsRepositoryImpl implements TripsRepository {
    public shapes: Map<string, ApiResult<RoutePathPoint[] | null>> = new Map<string, ApiResult<RoutePathPoint[] | null>>();
    public stops: Map<string, ApiResult<StopDetailed[] | null>> = new Map<string, ApiResult<StopDetailed[] | null>>();

    async getStops(trip: Trip): Promise<StopDetailed[]> {
        if (this.stops.has(trip.id) && this.stops.get(trip.id)!!.kind === "fulfill") {
            return this.stops.get(trip.id)!!.data!!;
        }
        const url: string = Api.api + `trip/${trip.id}/stops`;

        let response!: Response;
        try {
            response = await fetch(url);
        } catch (e) {
            throw new Error("Szerver nem elérhető.")
        }
        const body = await response.json() as RootResponse<GetStopsForTripObj>;
        if (!response.ok) {
            this.stops.set(trip.id, {
                kind: "reject",
                data: null,
                errors: body.errors
            });
            throw new Error(this.stops.get(trip.id)?.errors[0] ?? "Valami hiba történt.");
        } else {
            this.stops.set(trip.id, {
                kind: "fulfill",
                data: body.data.stops,
                errors: []
            });
            return this.stops.get(trip.id)!!.data!!;
        }
    }
    async getShapes(trip: Trip): Promise<RoutePathPoint[]> {
        if (this.shapes.has(trip.shape_id) && this.shapes.get(trip.shape_id)!!.kind === "fulfill") {
            return this.shapes.get(trip.shape_id)!!.data!!;
        }
        const url: string = Api.api + `trip/${trip.id}/shapes`;

        let response!: Response;
        try {
            response = await fetch(url);
        } catch (e) {
            throw new Error("Szerver nem elérhető.")
        }
        const body = await response.json() as RootResponse<GetShapesForTripObj>;
        if (!response.ok) {
            this.shapes.set(trip.shape_id, {
                kind: "reject",
                data: null,
                errors: body.errors
            });
            throw new Error(this.shapes.get(trip.shape_id)?.errors[0] ?? "Valami hiba történt.");
        } else {
            this.shapes.set(trip.shape_id, {
                kind: "fulfill",
                data: body.data.points,
                errors: []
            });
            return this.shapes.get(trip.shape_id)!!.data!!;
        }
    }
    async getTrips(selectedQueryable: Queryable, dateTime: Date): Promise<Trip[]> {
        const dateFormatted: string = dateTime.getFullYear() + String(dateTime.getMonth() + 1).padStart(2, '0') + String(dateTime.getDate()).padStart(2, '0');
        const timeFormatted: string = timeFormatter(dateTime.getHours() * 60 + dateTime.getMinutes(), false);

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
            throw new Error(body.errors[0] ?? "Valami hiba történt.");
        } else {
            return body.data.trips;
        }
    }
}