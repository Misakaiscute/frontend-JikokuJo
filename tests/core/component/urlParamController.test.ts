import {describe, expect, it} from "vitest";
import URLParamController from "../../../src/lib/core/utils/urlParamController.ts";

describe("URL Parameter manipulation", () => {
    it("should set a the query parameter", () => {
        let key: string = "test";
        let value: string = "test_value";
        URLParamController.set(key, value);
        expect(new URLSearchParams(window.location.search).get(key)).toBe(value);

        key = "test";
        value = "áéőúóüöŁłđĐíÍÁŐÚÓÜÖ";
        URLParamController.set(key, value);
        expect(new URLSearchParams(window.location.search).get(key)).toBe(value);
    });
    it("should clear the query parameter", () => {
        const key: string = "test";
        URLParamController.set(key, "1111111");
        URLParamController.remove(key);
        expect(new URLSearchParams(window.location.search).get(key)).toBeNull();
    });
    it("should confirm correctly is a query parameter is present", () => {
        const key: string = "test";
        URLParamController.set(key, "1111111");
        expect(URLParamController.contains(key)).toBe(true);
    });
    it("should remove all query parameters", () => {
        const key1: string = "diabetes";
        const key2: string = "meow";
        URLParamController.set(key1, "McDonalds");
        URLParamController.set(key2, "kitty");

        URLParamController.purge();
        expect(new URLSearchParams(window.location.search).get(key1)).toBeNull()
        expect(new URLSearchParams(window.location.search).get(key2)).toBeNull()
    });
});