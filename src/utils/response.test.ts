import { describe, it, expect } from "vitest";
import { isSuccess, isError } from "./response";

describe("isSuccess", () => {
    it("returns true for 200, 201 and 204", () => {
        expect(isSuccess(200)).toBe(true);
        expect(isSuccess(201)).toBe(true);
        expect(isSuccess(204)).toBe(true);
    });

    it("returns false for any other status code", () => {
        expect(isSuccess(400)).toBe(false);
        expect(isSuccess(404)).toBe(false);
        expect(isSuccess(500)).toBe(false);
    });
});

describe("isError", () => {
    it("returns false for 200, 201 and 204", () => {
        expect(isError(200)).toBe(false);
        expect(isError(201)).toBe(false);
        expect(isError(204)).toBe(false);
    });

    it("returns true for any other status code", () => {
        expect(isError(400)).toBe(true);
        expect(isError(404)).toBe(true);
        expect(isError(500)).toBe(true);
    });
});
