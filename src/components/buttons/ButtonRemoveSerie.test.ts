// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ButtonRemoveSerie from "./ButtonRemoveSerie.vue";
import { useStateStore } from "@/stores/state";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const mountButton = (serie: Partial<Serie>, props: Record<string, unknown> = {}) => mount(ButtonRemoveSerie, {
    global: { plugins: [vuetify] },
    props: { serie: serie as Serie, ...props },
});

beforeEach(() => {
    setActivePinia(createPinia());
});

describe("ButtonRemoveSerie", () => {
    it("renders nothing when the serie has no addedAt", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad" });

        expect(wrapper.find("button").exists()).toBe(false);
        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(false);
    });

    it("opens the confirm modal from the tooltip button", async () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" });

        await wrapper.find("button").trigger("click");

        expect(useStateStore().confirmModal).toBe(true);
    });

    it("opens the confirm modal from the menu item, styled as an error action", async () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" }, { menuItem: true });

        const item = wrapper.findComponent({ name: "VListItem" });
        expect(item.classes()).toContain("text-error");

        await item.trigger("click");

        expect(useStateStore().confirmModal).toBe(true);
    });
});
