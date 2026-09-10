// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ActorDetails from "./ActorDetails.vue";
import { vuetify } from "@/test/vuetify";
import type { Actor } from "@/models/person";

const mountDetails = (actor: Partial<Actor>) => mount(ActorDetails, {
    global: { plugins: [vuetify] },
    props: { actor: actor as Actor },
});

describe("ActorDetails", () => {
    it("shows the poster only when one is given", () => {
        expect(mountDetails({ poster: "x.jpg" }).find(".preview-img").exists()).toBe(true);
        expect(mountDetails({}).find(".preview-img").exists()).toBe(false);
    });

    it("shows only the birthday when no other meta info is given", () => {
        const wrapper = mountDetails({ birthday: "12/03/1979" });

        expect(wrapper.text()).toContain("12/03/1979");
        expect(wrapper.find(".dot").exists()).toBe(false);
    });

    it("separates birthday and deathday with a dot when both are given", () => {
        const wrapper = mountDetails({ birthday: "12/03/1979", deathday: "01/01/2020" });

        expect(wrapper.findAll(".dot")).toHaveLength(1);
    });

    it("separates all three meta items with two dots when birthday, deathday and nationality are all given", () => {
        const wrapper = mountDetails({ birthday: "12/03/1979", deathday: "01/01/2020", nationality: "Américaine" });

        expect(wrapper.findAll(".dot")).toHaveLength(2);
        expect(wrapper.text()).toContain("Américaine");
    });

    it("shows nationality without a leading dot when it's the only meta info", () => {
        const wrapper = mountDetails({ nationality: "Américaine" });

        expect(wrapper.find(".dot").exists()).toBe(false);
        expect(wrapper.text()).toContain("Américaine");
    });

    it("shows the description section only when one is given", () => {
        expect(mountDetails({ description: "Bio..." }).find(".detail-section").exists()).toBe(true);
        expect(mountDetails({}).find(".detail-section").exists()).toBe(false);
    });
});
