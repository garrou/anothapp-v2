// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ButtonModalSerieDetails from "./ButtonModalSerieDetails.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const serie = { id: 1, title: "Breaking Bad", description: "Un prof de chimie..." } as Serie;

const mountButton = (props: Record<string, unknown> = {}) => mount(ButtonModalSerieDetails, {
    global: { plugins: [vuetify] },
    props: { serie, ...props },
});

describe("ButtonModalSerieDetails", () => {
    it("renders nothing when the serie has no description", () => {
        const wrapper = mountButton({ serie: { ...serie, description: undefined } });

        expect(wrapper.find("button").exists()).toBe(false);
        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(false);
    });

    it("opens the details modal from the tooltip button", async () => {
        const wrapper = mountButton();

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(false);

        await wrapper.find("button").trigger("click");

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(true);
        expect(wrapper.text()).toContain("Breaking Bad");
    });

    it("opens the details modal from the menu item", async () => {
        const wrapper = mountButton({ menuItem: true });

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(true);
    });
});
