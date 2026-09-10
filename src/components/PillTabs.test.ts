// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PillTabs from "./PillTabs.vue";
import { vuetify } from "@/test/vuetify";

const tabs = [
    { value: 1, label: "En cours" },
    { value: 2, label: "Tendances" },
    { value: 3, label: "Répartition", badge: 2 },
    { value: 4, label: "Succès" },
];

const mountTabs = (modelValue = 1) => mount(PillTabs, {
    global: { plugins: [vuetify] },
    props: { modelValue, tabs },
});

describe("PillTabs", () => {
    it("renders a tab per entry with its label", () => {
        const wrapper = mountTabs();

        const tabEls = wrapper.findAllComponents({ name: "VTab" });
        expect(tabEls).toHaveLength(4);
        expect(wrapper.text()).toContain("En cours");
        expect(wrapper.text()).toContain("Tendances");
        expect(wrapper.text()).toContain("Répartition");
        expect(wrapper.text()).toContain("Succès");
    });

    it("shows a badge when one is provided", () => {
        const wrapper = mountTabs();

        expect(wrapper.findComponent({ name: "VBadge" }).props("content")).toBe(2);
    });

    it("emits update:modelValue with the clicked tab's value", async () => {
        const wrapper = mountTabs(1);

        await wrapper.findAllComponents({ name: "VTab" })[1].trigger("click");

        expect(wrapper.emitted("update:modelValue")).toContainEqual([2]);
    });
});
