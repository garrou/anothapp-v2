// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseMenu from "./BaseMenu.vue";
import { vuetify } from "@/test/vuetify";

describe("BaseMenu", () => {
    it("keeps its slot content mounted even before the menu is ever opened (eager)", () => {
        // Without `eager`, v-menu only mounts its slot content while active, and tears it
        // back down when it closes. A menu item that owns a nested dialog (e.g.
        // ButtonAddToPlaylist, ButtonModalSerieDetails) gets destroyed - dialog included -
        // the instant the menu auto-closes on that same click (close-on-content-click
        // defaults to true), so the dialog flashes and disappears before the user can use
        // it. `eager` keeps the content mounted throughout, so a nested dialog survives.
        const wrapper = mount(BaseMenu, {
            global: { plugins: [vuetify] },
            slots: { default: '<div class="menu-item-marker">Item</div>' },
        });

        expect(wrapper.find(".menu-item-marker").exists()).toBe(true);
    });
});
