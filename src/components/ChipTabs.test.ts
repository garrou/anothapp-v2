// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ChipTabs from "./ChipTabs.vue";
import { vuetify } from "@/test/vuetify";

const tabs = [
    { value: 1, label: "Ajouter" },
    { value: 2, label: "Reçues", badge: 2 },
    { value: 3, label: "Envoyées" },
];

const mountTabs = (modelValue = 1) => mount(ChipTabs, {
    global: { plugins: [vuetify] },
    props: { modelValue, tabs },
});

describe("ChipTabs", () => {
    it("renders a tab per entry with its label", () => {
        const wrapper = mountTabs();

        expect(wrapper.findAll(".pill-tab")).toHaveLength(3);
        expect(wrapper.text()).toContain("Ajouter");
        expect(wrapper.text()).toContain("Reçues");
        expect(wrapper.text()).toContain("Envoyées");
    });

    it("marks the tab matching modelValue as active", () => {
        const wrapper = mountTabs(2);

        const tabEls = wrapper.findAll(".pill-tab");
        expect(tabEls[0].classes()).not.toContain("pill-tab--active");
        expect(tabEls[1].classes()).toContain("pill-tab--active");
    });

    it("shows a badge when one is provided", () => {
        const wrapper = mountTabs();

        expect(wrapper.findComponent({ name: "VBadge" }).props("content")).toBe(2);
    });

    it("emits update:modelValue with the clicked tab's value", async () => {
        const wrapper = mountTabs(1);

        await wrapper.findAll(".pill-tab")[2].trigger("click");

        expect(wrapper.emitted("update:modelValue")).toContainEqual([3]);
    });
});
