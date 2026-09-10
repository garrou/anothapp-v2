// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ButtonUpdateSerie from "./ButtonUpdateSerie.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const mountButton = (serie: Partial<Serie>, props: Record<string, unknown> = {}) => mount(ButtonUpdateSerie, {
    global: { plugins: [vuetify] },
    props: { serie: serie as Serie, ...props },
});

describe("ButtonUpdateSerie", () => {
    it("renders nothing when the serie has no addedAt", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad" });

        expect(wrapper.find("button").exists()).toBe(false);
        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(false);
    });

    it("emits update from the tooltip button", async () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" });

        await wrapper.find("button").trigger("click");

        expect(wrapper.emitted("update")).toHaveLength(1);
    });

    it("emits update from the menu item", async () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", addedAt: "2025-01-01" }, { menuItem: true });

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");

        expect(wrapper.emitted("update")).toHaveLength(1);
    });
});
