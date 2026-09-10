// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PlaylistCover from "./PlaylistCover.vue";
import { vuetify } from "@/test/vuetify";

const mountCover = (posters: string[] = []) => mount(PlaylistCover, {
    global: { plugins: [vuetify] },
    props: { posters },
});

describe("PlaylistCover", () => {
    it("shows a placeholder icon when there are no posters", () => {
        const wrapper = mountCover([]);

        expect(wrapper.find(".cover-placeholder").exists()).toBe(true);
        expect(wrapper.findAll(".cover-tile")).toHaveLength(0);
        expect(wrapper.find(".playlist-cover").classes()).toContain("covers-0");
    });

    it("renders a single tile for one poster", () => {
        const wrapper = mountCover(["poster1.jpg"]);

        expect(wrapper.find(".cover-placeholder").exists()).toBe(false);
        expect(wrapper.findAll(".cover-tile")).toHaveLength(1);
        expect(wrapper.find(".playlist-cover").classes()).toContain("covers-1");
    });

    it("renders one tile per poster, up to four", () => {
        const wrapper = mountCover(["a.jpg", "b.jpg", "c.jpg", "d.jpg"]);

        expect(wrapper.findAll(".cover-tile")).toHaveLength(4);
        expect(wrapper.find(".playlist-cover").classes()).toContain("covers-4");
    });
});
