// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ButtonDetailsSerie from "./ButtonDetailsSerie.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const mountButton = (serie: Partial<Serie>, props: Record<string, unknown> = {}) => mount(ButtonDetailsSerie, {
    global: { plugins: [vuetify], stubs: { RouterLink: true } },
    props: { serie: serie as Serie, ...props },
});

describe("ButtonDetailsSerie", () => {
    it("renders nothing when the serie has no addedAt", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad" });

        expect(wrapper.find("button").exists()).toBe(false);
        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(false);
    });

    it("renders a tooltip button when addedAt is set", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" });

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Page des détails");
    });

    it("renders as a menu item when menuItem is set", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" }, { menuItem: true });

        expect(wrapper.findComponent({ name: "VListItem" }).props("title")).toBe("Page des détails");
    });
});
