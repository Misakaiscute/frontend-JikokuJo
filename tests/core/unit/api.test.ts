import {describe, expect, it, vi} from "vitest";
import api from "../../../src/lib/core/data/remote/api.ts";

describe("Api formatting", () => {
    it("should be correct format", () => {
        vi.stubEnv("VITE_API_PROTOCOL", "https");
        vi.stubEnv("VITE_API_HOST", "example.com");
        vi.stubEnv("VITE_API_PORT", "443");
        expect(api()).toBe("https://example.com:443");
    });
    it("should throw error if a value unset", () => {
        vi.stubEnv("VITE_API_PROTOCOL", "");
        vi.stubEnv("VITE_API_HOST", "example.com");
        vi.stubEnv("VITE_API_PORT", "80");
        expect(() => api()).toThrow();

        vi.stubEnv("VITE_API_PROTOCOL", "http");
        vi.stubEnv("VITE_API_HOST", "");
        vi.stubEnv("VITE_API_PORT", "80");
        expect(() => api()).toThrow();

        vi.stubEnv("VITE_API_PROTOCOL", "http");
        vi.stubEnv("VITE_API_HOST", "example.com");
        vi.stubEnv("VITE_API_PORT", "");
        expect(() => api()).toThrow();
    });
});