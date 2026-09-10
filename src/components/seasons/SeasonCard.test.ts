// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SeasonCard from "./SeasonCard.vue";
import { vuetify } from "@/test/vuetify";
import type { Season } from "@/models/season";

const mountCard = (season: Partial<Season>, props: Record<string, unknown> = {}) => mount(SeasonCard, {
    global: { plugins: [vuetify] },
    props: { season: season as Season, ...props },
});

describe("SeasonCard", () => {
    it("shows the season number", () => {
        const wrapper = mountCard({ number: 3, episodes: 10 });

        expect(wrapper.text()).toContain("Saison 3");
    });

    it("shows the episode count without an interval when none is given", () => {
        const wrapper = mountCard({ number: 1, episodes: 10 });

        expect(wrapper.text()).toContain("10 épisodes");
        expect(wrapper.text()).not.toContain("(");
    });

    it("shows the episode count with the interval when given", () => {
        const wrapper = mountCard({ number: 1, episodes: 10, interval: "2021-2022" });

        expect(wrapper.text()).toContain("10 épisodes (2021-2022)");
    });

    it("pluralizes a single episode correctly", () => {
        const wrapper = mountCard({ number: 1, episodes: 1 });

        expect(wrapper.text()).toContain("1 épisode");
        expect(wrapper.text()).not.toContain("1 épisodes");
    });

    it("emits show when clicked", async () => {
        const season = { number: 1, episodes: 10 };
        const wrapper = mountCard(season);

        await wrapper.findComponent({ name: "PosterCard" }).trigger("click");

        expect(wrapper.emitted("show")).toEqual([[season]]);
    });

    it("uses the season image, falling back to the serie poster", () => {
        const withImage = mountCard({ number: 1, episodes: 10, image: "season.jpg" }, { seriePoster: "serie.jpg" });
        expect(withImage.findComponent({ name: "PosterCard" }).props("image")).toBe("season.jpg");

        const withoutImage = mountCard({ number: 1, episodes: 10 }, { seriePoster: "serie.jpg" });
        expect(withoutImage.findComponent({ name: "PosterCard" }).props("image")).toBe("serie.jpg");
    });
});
