import {describe, expect, it} from "vitest";
import {dateHelpers} from "../../../src/lib/schedule/utils/dateHelpers.ts";

describe("Date helper function factory", () => {
    it("should return the start of day correctly", () => {
        let date: Date = new Date(2025, 2, 23, 0, 0, 0, 1);
        let res: Date = dateHelpers(date).getStartOfDay();

        expect(res.getDate()).toBe(23);
        expect(res.getHours() + res.getMinutes() + res.getSeconds() + res.getMilliseconds()).toBe(0);

        date = new Date(2020, 2, 21, 23, 59, 59, 999);
        res = dateHelpers(date).getStartOfDay();

        expect(res.getDate()).toBe(21);
        expect(res.getHours() + res.getMinutes() + res.getSeconds() + res.getMilliseconds()).toBe(0);

        date = new Date(2088, 7, 1, 0, 0, 0, 0);
        res = dateHelpers(date).getStartOfDay();

        expect(res.getDate()).toBe(1);
        expect(res.getHours() + res.getMinutes() + res.getSeconds() + res.getMilliseconds()).toBe(0);
    });
    it("should add the number of days correctly", () => {
        const daysToAdd: number[] = [-4, -1, 0, 1, 4];
        const expectedDays: number[] = [28, 31, 1, 2, 5];
        let startDate: Date = new Date(2088, 7, 1, 12, 14, 54, 875);

        for (let i = 0; i < daysToAdd.length; i++) {
            const afterDate: Date = dateHelpers(startDate).addDays(daysToAdd[i]);
            expect(afterDate.getDate()).toBe(expectedDays[i]);
        }
    });
    it("should determine if it is the same day correctly", () => {
        const targetDate: Date = new Date(2000, 0, 23, 21, 0, 0, 0);
        const comparedDatesWithExpected = [
            { date: new Date(1999, 8, 22, 23, 59, 59, 999), expected: false },
            { date: new Date(2000, 0, 22, 23, 59, 59, 999), expected: false },
            { date: new Date(2000, 0, 23, 0, 0, 0, 0), expected: true },
            { date: new Date(2000, 0, 23, 21, 0, 0, 1), expected: true },
            { date: new Date(2000, 0, 23, 23, 59, 59, 999), expected: true },
            { date: new Date(2000, 0, 24, 0, 0, 0, 0), expected: false },
            { date: new Date(2002, 2, 24, 0, 0, 0, 0), expected: false }
        ];
        for (let i = 0; i < comparedDatesWithExpected.length; i++) {
            const isSameDay: boolean = dateHelpers(comparedDatesWithExpected[i].date).sameDayAs(targetDate);
            expect(isSameDay).toBe(comparedDatesWithExpected[i].expected);
        }
    });
    it("should return the date in minutes correctly", () => {
        const comparedDatesWithExpected = [
            { date: new Date(2000, 0, 22, 23, 59), expected: 23 * 60 + 59 },
            { date: new Date(2000, 0, 23, 0, 0), expected: 0 },
            { date: new Date(2000, 0, 23, 0, 34), expected: 34 },
            { date: new Date(2000, 0, 23, 23, 0), expected: 23 * 60 },
        ];
        for (let i = 0; i < comparedDatesWithExpected.length; i++) {
            const inMinutes: number = dateHelpers(comparedDatesWithExpected[i].date).dayInMinutes();
            expect(inMinutes).toBe(comparedDatesWithExpected[i].expected);
        }
    });
    it("should determine if it is a past day correctly", () => {
        const targetDate: Date = new Date(2000, 8, 23, 17, 36);
        const comparedDatesWithExpected = [
            { date: new Date(1999, 1, 11, 23, 59,), expected: true },
            { date: new Date(2000, 7, 7, 23, 59,), expected: true },
            { date: new Date(2000, 8, 23, 0, 0), expected: false },
            { date: new Date(2000, 8, 23, 17, 36), expected: false },
            { date: new Date(2000, 8, 23, 23, 59), expected: false },
            { date: new Date(2000, 9, 24, 13, 22), expected: false },
            { date: new Date(2002, 2, 24, 16, 57), expected: false }
        ];
        for (let i = 0; i < comparedDatesWithExpected.length; i++) {
            const isPastDay: boolean = dateHelpers(targetDate).isPastDay(comparedDatesWithExpected[i].date);
            expect(isPastDay).toBe(comparedDatesWithExpected[i].expected);
        }
    });
});