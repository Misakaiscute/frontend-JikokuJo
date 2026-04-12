import {describe, expect, it} from "vitest";
import MapUtils from "../../../src/lib/map/utils/mapUtils.ts";
import type {Location, RoutePathPoint} from "../../../src/lib/schedule/data/model/location.ts";
import type {StopDetailed} from "../../../src/lib/schedule/data/model/stopDetailed.ts";

const mapUtils: MapUtils = new MapUtils();

describe("Utility functions for the map", () => {
    describe("Finding center point of a route in geolocation", () => {
        it("should return the correct center point", () => {
            const points: RoutePathPoint[] = [
                { distance_traveled: 0, location: { lat: 0, lon: 0 } },
                { distance_traveled: 10, location: { lat: 10, lon: 10 } },
                { distance_traveled: 30, location: { lat: 30, lon: 20 } },
                { distance_traveled: 40, location: { lat: 40, lon: 50 } },
                { distance_traveled: 70, location: { lat: 70, lon: 60 } }
            ];
            const res: Location = mapUtils.findCenterPoint(points);
            expect(res.lat).toBe(30);
            expect(res.lon).toBe(28);
        });
        it("should throw an error for an empty array of points", () => {
            expect(() => mapUtils.findCenterPoint([])).toThrow();
        });
    });
    describe("Find the switching point of a route", () => {
        const target: StopDetailed = {
            id: "ID",
            name: "NAME",
            location: {
                lat: 30,
                lon: 30
            },
            arrival_time: 560,
            order: 8
        }

        it("should return the correct index for an exact match", () => {
            const points: RoutePathPoint[] = [
                { distance_traveled: 0, location: { lat: 0, lon: 0 } },
                { distance_traveled: 10, location: { lat: 10, lon: 10 } },
                { distance_traveled: 30, location: { lat: 30, lon: 20 } },
                { distance_traveled: 40, location: { lat: 40, lon: 50 } },
                { distance_traveled: 70, location: { lat: 70, lon: 60 } }
            ];

            expect(mapUtils.findSwitchingPoint(target, points)).toBe(2);
        });
        it("should return the correct index for a not exact match", () => {
            const points: RoutePathPoint[] = [
                { distance_traveled: 0, location: { lat: 0, lon: 0 } },
                { distance_traveled: 10, location: { lat: 10, lon: 10 } },
                { distance_traveled: 30, location: { lat: 28, lon: 28 } },
                { distance_traveled: 40, location: { lat: 36, lon: 36 } },
                { distance_traveled: 70, location: { lat: 40, lon: 40 } }
            ];
            expect(mapUtils.findSwitchingPoint(target, points)).toBe(2);
        });
        it("should throw an error for an empty array of points", () => {
            expect(() => mapUtils.findSwitchingPoint(target, [])).toThrow();
        });
    });
});