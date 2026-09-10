// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SerieDetail from "./SerieDetail.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const mountDetail = (serie: Partial<Serie>) => mount(SerieDetail, {
    global: { plugins: [vuetify] },
    props: { serie: serie as Serie },
});

describe("SerieDetail", () => {
    it("shows a tag per kind, only when kinds are given", () => {
        expect(mountDetail({ duration: 40, kinds: ["Drame", "Thriller"] }).findAllComponents({ name: "BaseTag" })).toHaveLength(2);
        expect(mountDetail({ duration: 40 }).findAllComponents({ name: "BaseTag" })).toHaveLength(0);
    });

    it("shows 'Terminée' when finished, 'En cours' otherwise", () => {
        expect(mountDetail({ duration: 40, finished: true }).text()).toContain("Terminée");
        expect(mountDetail({ duration: 40, finished: false }).text()).toContain("En cours");
    });

    it("computes total duration from episode duration and count", () => {
        const wrapper = mountDetail({ duration: 45, episodes: 10 });

        expect(wrapper.text()).toContain("7 h 30");
    });

    it("shows the network and a separating dot only when a network is given", () => {
        const withNetwork = mountDetail({ duration: 40, network: "AMC", country: "USA" });
        expect(withNetwork.text()).toContain("AMC");
        expect(withNetwork.findAll(".dot").length).toBeGreaterThanOrEqual(1);

        const withoutNetwork = mountDetail({ duration: 40, country: "USA" });
        expect(withoutNetwork.find(".dot").exists()).toBe(false);
    });

    it("shows the note formatted to 2 decimals only when given", () => {
        const wrapper = mountDetail({ duration: 40, note: 4.5 });

        expect(wrapper.text()).toContain("4.50 / 5");
    });

    it("does not show a note section when no note is given", () => {
        const wrapper = mountDetail({ duration: 40 });

        expect(wrapper.text()).not.toContain("/ 5");
    });

    it("shows the creation year prefixed with 'Depuis' only when given", () => {
        expect(mountDetail({ duration: 40, creation: 2008 }).text()).toContain("Depuis 2008");
        expect(mountDetail({ duration: 40 }).text()).not.toContain("Depuis");
    });

    it("shows the description section only when given", () => {
        expect(mountDetail({ duration: 40, description: "Synopsis..." }).text()).toContain("Synopsis");
        expect(mountDetail({ duration: 40 }).find(".detail-section").exists()).toBe(false);
    });

    it("shows a platform card per available platform, only when platforms are given", () => {
        const withPlatforms = mountDetail({
            duration: 40,
            platforms: [{ id: 1, name: "Netflix" }, { id: 2, name: "Disney+" }] as Serie["platforms"],
        });
        expect(withPlatforms.findAllComponents({ name: "PlatformCard" })).toHaveLength(2);
        expect(withPlatforms.text()).toContain("Netflix");

        expect(mountDetail({ duration: 40 }).findAllComponents({ name: "PlatformCard" })).toHaveLength(0);
    });
});
