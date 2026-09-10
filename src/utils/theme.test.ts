// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { applyThemeClass, THEME_ANOTHAPP, THEME_ANOTHAPP_DARK } from "./theme";

beforeEach(() => {
    document.documentElement.className = "";
});

describe("applyThemeClass", () => {
    it("adds the theme class for the given theme name", () => {
        applyThemeClass(THEME_ANOTHAPP);

        expect(document.documentElement.classList.contains(`v-theme--${THEME_ANOTHAPP}`)).toBe(true);
    });

    it("removes the other known theme class when switching themes", () => {
        applyThemeClass(THEME_ANOTHAPP);
        applyThemeClass(THEME_ANOTHAPP_DARK);

        expect(document.documentElement.classList.contains(`v-theme--${THEME_ANOTHAPP}`)).toBe(false);
        expect(document.documentElement.classList.contains(`v-theme--${THEME_ANOTHAPP_DARK}`)).toBe(true);
    });

    it("does not remove unrelated classes already on the element", () => {
        document.documentElement.classList.add("some-other-class");

        applyThemeClass(THEME_ANOTHAPP);

        expect(document.documentElement.classList.contains("some-other-class")).toBe(true);
    });
});
