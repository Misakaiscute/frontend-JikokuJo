import type { ApiResult } from "../../../src/lib/core/data/remote/apiResult.ts";
import type { RoutePathPoint } from "../../../src/lib/schedule/data/model/location.ts";
import type { Queryable } from "../../../src/lib/schedule/data/model/queryable.ts";
import type { StopDetailed } from "../../../src/lib/schedule/data/model/stopDetailed.ts";
import type { Trip } from "../../../src/lib/schedule/data/model/trip.ts";
import type TripsRepository from "../../../src/lib/schedule/data/repository/tripsRepository.ts";

export default class TripsRepositoryMock implements TripsRepository {
    private trips: Trip[] = [];
    constructor() {
        for (let i = 0; i < 26; i++) {
            const letter: string = String.fromCharCode(i + 65);
            this.trips.push({
                headsign: "Route to success",
                id: `${letter}-${i}`,
                route_id: `${letter}-${i}`,
                shape_id: `${letter}-${i}`,
                stops: [
                    {
                        id: "id_0",
                        name: "Stop No. 1",
                        location: {
                            lat: 0,
                            lon: 0
                        },
                        arrival_time: 650,
                        order: 0
                    },
                    {
                        id: "id_8",
                        name: "Stop No. 9",
                        location: {
                            lat: 0,
                            lon: 0
                        },
                        arrival_time: 650,
                        order: 8
                    }],
                wheelchair_accessible: 0,
                bikes_allowed: 0,
                direction_id: 0
            });
        }
    }
    mockGetTripsSuccess: boolean = false;

    getStops(trip: Trip): Promise<StopDetailed[]> {
        throw new Error("Method not implemented.");
    }
    getShapes(trip: Trip): Promise<RoutePathPoint[]> {
        throw new Error("Method not implemented.");
    }
    getTrips(selectedQueryable: Queryable, dateTime: Date): Promise<Trip[]> {
        return new Promise((resolve, reject) => {
            if (this.mockGetTripsSuccess) {
                resolve(this.trips);
            } else {
                reject(new Error("Trips mock error"));
            }
        });
    }
    openBroadcast(forTrip: Trip): Promise<void> {
        throw new Error("Method not implemented.");
    }
}