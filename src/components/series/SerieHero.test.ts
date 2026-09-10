// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SerieHero from "./SerieHero.vue";
import { vuetify } from "@/test/vuetify";

const mountHero = (props: { title: string; kinds?: string[]; poster?: string }) => mount(SerieHero, {
    global: { plugins: [vuetify] },
    props,
});

describe("SerieHero", () => {
    it("shows the title", () => {
        const wrapper = mountHero({ title: "Breaking Bad" });

        expect(wrapper.text()).toContain("Breaking Bad");
    });

    it("sets the background image only when a poster is given", () => {
        const withPoster = mountHero({ title: "X", poster: "poster.jpg" });
        expect(withPoster.find(".hero").attributes("style")).toContain("poster.jpg");

        const withoutPoster = mountHero({ title: "X" });
        expect(withoutPoster.find(".hero").attributes("style")).toBeFalsy();
    });

    it("shows a tag per kind, only when kinds are given", () => {
        expect(mountHero({ title: "X", kinds: ["Drame", "Thriller"] }).findAllComponents({ name: "BaseTag" })).toHaveLength(2);
        expect(mountHero({ title: "X" }).findAllComponents({ name: "BaseTag" })).toHaveLength(0);
    });

    it("emits back when the back button is clicked", async () => {
        const wrapper = mountHero({ title: "X" });

        await wrapper.find(".back-btn").trigger("click");

        expect(wrapper.emitted("back")).toHaveLength(1);
    });
});
