import {describe, expect, it} from "vitest";
import {timeFormatter} from "../../../src/lib/core/utils/timeFormatter.ts";

describe("Date formatter", () => {
    it("should return time formatted", () => {
        const time1: number = 7 * 60 + 2;
        expect(timeFormatter(time1)).toBe("07:02");
        const time2: number = 21 * 60 + 9;
        expect(timeFormatter(time2)).toBe("21:09");
        const time3: number = 2 * 60 + 38;
        expect(timeFormatter(time3)).toBe("02:38");
        const time4: number = 12 * 60 + 21;
        expect(timeFormatter(time4)).toBe("12:21");
    });
    it("should return time formatted without a colon", () => {
        const time1: number = 7 * 60 + 2;
        expect(timeFormatter(time1, false)).toBe("0702");
        const time2: number = 21 * 60 + 9;
        expect(timeFormatter(time2, false)).toBe("2109");
        const time3: number = 2 * 60 + 38;
        expect(timeFormatter(time3, false)).toBe("0238");
        const time4: number = 12 * 60 + 21;
        expect(timeFormatter(time4, false)).toBe("1221");
    });
    it("should return 00:00 for midnight (1440 * k, where k is a positive integer)", () => {
        expect(timeFormatter(0)).toBe("00:00");
        expect(timeFormatter(1440)).toBe("00:00");
        expect(timeFormatter(1440 * 5)).toBe("00:00");
    });
    it("should throw an error for a negative integer", () => {
        expect(() => timeFormatter(-1)).toThrow();
        expect(() => timeFormatter(-1440)).toThrow();
    });
});