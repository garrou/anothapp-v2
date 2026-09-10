// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EmptyState from "./EmptyState.vue";
import { vuetify } from "@/test/vuetify";

describe("EmptyState", () => {
    it("shows the title but no description when none is given", () => {
        const wrapper = mount(EmptyState, {
            global: { plugins: [vuetify] },
            props: { icon: "mdi-movie-open-outline", title: "Aucune série" },
        });

        expect(wrapper.text()).toContain("Aucune série");
        expect(wrapper.find(".empty-state-text").exists()).toBe(false);
    });

    it("shows the description when given", () => {
        const wrapper = mount(EmptyState, {
            global: { plugins: [vuetify] },
            props: { icon: "mdi-movie-open-outline", title: "Aucune série", description: "Rien pour l'instant." },
        });

        expect(wrapper.text()).toContain("Rien pour l'instant.");
    });

    it("shows the action area only when given a default slot", () => {
        const withSlot = mount(EmptyState, {
            global: { plugins: [vuetify] },
            props: { icon: "mdi-movie-open-outline", title: "Aucune série" },
            slots: { default: "<button>Découvrir</button>" },
        });
        expect(withSlot.find(".empty-state-action").exists()).toBe(true);

        const withoutSlot = mount(EmptyState, {
            global: { plugins: [vuetify] },
            props: { icon: "mdi-movie-open-outline", title: "Aucune série" },
        });
        expect(withoutSlot.find(".empty-state-action").exists()).toBe(false);
    });
});
