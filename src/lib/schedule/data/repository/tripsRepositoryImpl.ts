import type TripsRepository from "./tripsRepository.ts";
import type { ApiResult } from "../../../core/data/remote/apiResult.ts";
import type { Queryable } from "../model/queryable.ts";
import type { StopDetailed } from "../model/stopDetailed.ts";
import type { Trip } from "../model/trip.ts";
import type { RootResponse } from "../../../core/data/remote/apiResponseStructure.ts";
import type { GetShapesForTripObj, GetStopsForTripObj, GetTripsObj } from "../remote/apiResponseStructure.ts";
import type { RoutePathPoint } from "../model/location.ts";
import {timeFormatter} from "../../../core/utils/timeFormatter.ts";
import axios, {type AxiosError} from "axios";

export default class TripsRepositoryImpl implements TripsRepository {
    public shapes: Map<string, ApiResult<RoutePathPoint[] | null>> = new Map<string, ApiResult<RoutePathPoint[] | null>>();
    public stops: Map<string, ApiResult<StopDetailed[] | null>> = new Map<string, ApiResult<StopDetailed[] | null>>();

    async getStops(trip: Trip): Promise<StopDetailed[]> {
        if (this.stops.has(trip.id) && this.stops.get(trip.id)!!.kind === "fulfill") {
            return this.stops.get(trip.id)!!.data!!;
        }
        try {
            return await axios.get<RootResponse<GetStopsForTripObj>>(`/api/trip/${trip.id}/stops`)
                .then((res) => {
                    this.stops.set(trip.id, {
                        kind: "fulfill",
                        data: res.data.data.stops,
                        errors: []
                    });
                    return this.stops.get(trip.id)!!.data!!;
                }).catch((err: AxiosError<RootResponse<GetShapesForTripObj>>) => {
                    this.stops.set(trip.id, {
                        kind: "reject",
                        data: null,
                        errors: err.response?.data?.errors ?? ["Valami hiba történt."]
                    });
                    throw new Error(this.stops.get(trip.id)?.errors[0]);
                })
        } catch {
            throw new Error("Valami hiba történt.");
        }
    }
    async getShapes(trip: Trip): Promise<RoutePathPoint[]> {
        if (this.shapes.has(trip.shape_id) && this.shapes.get(trip.shape_id)!!.kind === "fulfill") {
            return this.shapes.get(trip.shape_id)!!.data!!;
        }
        try {
            return await axios.get<RootResponse<GetShapesForTripObj>>(`/api/trip/${trip.id}/shapes`)
                .then((res) => {
                    this.shapes.set(trip.shape_id, {
                        kind: "fulfill",
                        data: res.data.data.points,
                        errors: []
                    });
                    return this.shapes.get(trip.shape_id)!!.data!!;
                }).catch((err: AxiosError<RootResponse<GetShapesForTripObj>>) => {
                    this.shapes.set(trip.shape_id, {
                        kind: "reject",
                        data: null,
                        errors: err.response?.data?.errors ?? ["Valami hiba történt."]
                    });
                    throw new Error(this.shapes.get(trip.shape_id)!!.errors[0]);
                })
        } catch {
            throw new Error("Valami hiba történt.");
        }
    }
    async getTrips(selectedQueryable: Queryable, dateTime: Date): Promise<Trip[]> {
        const dateFormatted: string = dateTime.getFullYear() + String(dateTime.getMonth() + 1).padStart(2, '0') + String(dateTime.getDate()).padStart(2, '0');
        const timeFormatted: string = timeFormatter(dateTime.getHours() * 60 + dateTime.getMinutes(), false);

        if (selectedQueryable.kind === "stop") {
            try {
                return await axios.post<RootResponse<GetTripsObj>>("/api/stop/trip", {
                    ids: selectedQueryable.ids,
                    date: dateFormatted,
                    time: timeFormatted
                }).then((res) => {
                    return res.data.data.trips;
                }).catch((err: AxiosError<RootResponse<GetTripsObj>>) => {
                    throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
                });
            } catch {
                throw new Error("Szerver nem elérhető.")
            }
        } else {
            try {
                return await axios.get(`/api/route/${selectedQueryable.route_id}/time/${dateFormatted}/${timeFormatted}`)
                    .then((res) => {
                        return res.data.data.trips;
                    }).catch((err: AxiosError<RootResponse<GetTripsObj>>) => {
                        throw new Error(err.response?.data?.errors[0] ?? "Valami hiba történt.");
                    });
            } catch {
                throw new Error("Szerver nem elérhető.")
            }
        }
    }
}