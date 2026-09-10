// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Achievements from "./Achievements.vue";
import { vuetify } from "@/test/vuetify";

describe("Achievements", () => {
    it("shows the page title and embeds the badges grid for the current user", () => {
        const wrapper = mount(Achievements, {
            global: { plugins: [vuetify], stubs: { BaseAppBar: true, BadgesGrid: true } },
        });

        expect(wrapper.text()).toContain("Succès");
        expect(wrapper.findComponent({ name: "BadgesGrid" }).props("userId")).toBeUndefined();
    });
});
