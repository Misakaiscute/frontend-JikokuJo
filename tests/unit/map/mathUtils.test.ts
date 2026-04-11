import {describe, expect, it} from "vitest";
import type {Location} from "../../../src/lib/schedule/data/model/location.ts";
import mathUtils from "../../../src/lib/map/utils/mathUtils.ts";

describe("Coordinate geometry distance between two points", () => {
    it("should determine distance between two non-overlapping points correctly", () => {
        const p1: Location = { lat: 0, lon: 0 }
        const p2: Location = { lat: 3, lon: 4 }
        expect(mathUtils(p1.lat, p2.lat, p1.lon, p2.lon)).toBe(5);
    });
    it("should determine distance between two overlapping points correctly", () => {
        expect(mathUtils(0, 0, 3, 3)).toBe(0);
    });
});