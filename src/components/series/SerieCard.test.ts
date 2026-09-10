// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SerieCard from "./SerieCard.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const stubs = {
    ButtonAddSerie: true,
    ButtonFavoriteSerie: true,
    ButtonListSerie: true,
    ButtonWatchSerie: true,
    ButtonModalSerieDetails: true,
};

const mountCard = (serie: Partial<Serie>, props: Record<string, unknown> = {}) => mount(SerieCard, {
    global: { plugins: [vuetify], stubs },
    props: { serie: serie as Serie, ...props },
});

describe("SerieCard", () => {
    it("links to /series/:id when the serie is already added", () => {
        const wrapper = mountCard({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" });

        expect(wrapper.findComponent({ name: "PosterCard" }).props("to")).toBe("/series/1");
    });

    it("links to /discover/:id when the serie hasn't been added", () => {
        const wrapper = mountCard({ id: 1, title: "Breaking Bad" });

        expect(wrapper.findComponent({ name: "PosterCard" }).props("to")).toBe("/discover/1");
    });

    it("shows the add button only when the serie hasn't been added yet", () => {
        expect(mountCard({ id: 1, title: "X" }).findComponent({ name: "ButtonAddSerie" }).exists()).toBe(true);
        expect(mountCard({ id: 1, title: "X", addedAt: "2025-01-01" }).findComponent({ name: "ButtonAddSerie" }).exists()).toBe(false);
    });

    it("shows the actions menu with watch when watchStatus is set", async () => {
        const wrapper = mountCard({ id: 1, title: "X", addedAt: "2025-01-01" }, { watchStatus: true });

        expect(wrapper.findComponent({ name: "BaseMenu" }).exists()).toBe(true);
        await wrapper.find("button").trigger("click");
        expect(wrapper.findComponent({ name: "ButtonWatchSerie" }).exists()).toBe(true);
    });

    it("shows the details button in the menu unless hideDetailsButton is set", async () => {
        const shown = mountCard({ id: 1, title: "X", description: "..." }, { watchStatus: true });
        await shown.find("button").trigger("click");
        expect(shown.findComponent({ name: "ButtonModalSerieDetails" }).exists()).toBe(true);

        const hidden = mountCard({ id: 1, title: "X", description: "..." }, { watchStatus: true, hideDetailsButton: true });
        await hidden.find("button").trigger("click");
        expect(hidden.findComponent({ name: "ButtonModalSerieDetails" }).exists()).toBe(false);
    });

    it("hides the actions menu entirely when there's nothing to show in it", () => {
        const wrapper = mountCard({ id: 1, title: "X" }, { hideDetailsButton: true, watchStatus: false });

        expect(wrapper.findComponent({ name: "BaseMenu" }).exists()).toBe(false);
    });
});
