import { describe, it, expect } from "vitest";
import { parseLocalDate, toLocalDateKey, isSameDay } from "./date";

describe("parseLocalDate", () => {
    it("parses a plain YYYY-MM-DD date into local date components", () => {
        const date = parseLocalDate("2024-03-15");

        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(2);
        expect(date.getDate()).toBe(15);
    });

    it("ignores any time/timezone suffix, using only the date portion", () => {
        const date = parseLocalDate("2024-03-15T23:59:59.000Z");

        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(2);
        expect(date.getDate()).toBe(15);
    });
});

describe("toLocalDateKey", () => {
    it("formats an ISO datetime as a local YYYY-MM-DD key", () => {
        const iso = "2024-03-15T12:00:00.000Z";
        const expected = new Date(iso);
        const expectedKey = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, "0")}-${String(expected.getDate()).padStart(2, "0")}`;

        expect(toLocalDateKey(iso)).toBe(expectedKey);
    });
});

describe("isSameDay", () => {
    it("returns true for two dates on the same day, different times", () => {
        const a = new Date(2024, 2, 15, 8, 0);
        const b = new Date(2024, 2, 15, 23, 0);

        expect(isSameDay(a, b)).toBe(true);
    });

    it("returns false for dates on different days", () => {
        const a = new Date(2024, 2, 15);
        const b = new Date(2024, 2, 16);

        expect(isSameDay(a, b)).toBe(false);
    });

    it("returns false for the same day/month in different years", () => {
        const a = new Date(2023, 2, 15);
        const b = new Date(2024, 2, 15);

        expect(isSameDay(a, b)).toBe(false);
    });
});
