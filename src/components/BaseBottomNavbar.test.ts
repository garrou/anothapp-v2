// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import BaseBottomNavbar from "./BaseBottomNavbar.vue";
import { vuetify } from "@/test/vuetify";
import { NAV_MENU } from "@/constants/menus";

const pendingCount = vi.hoisted(() => ({ value: 0 }));
const pendingInvitesCount = vi.hoisted(() => ({ value: 0 }));
const routeMock = vi.hoisted(() => ({ name: "series" }));

vi.mock("@/composables/pendingFriendRequests", async () => {
    const { ref } = await import("vue");
    return { usePendingFriendRequests: () => ref(pendingCount.value) };
});
vi.mock("@/composables/pendingWatchTogetherInvites", async () => {
    const { ref } = await import("vue");
    return { usePendingWatchTogetherInvites: () => ({ pendingInvites: ref(pendingInvitesCount.value), refresh: vi.fn() }) };
});
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const mountNav = () => mount(BaseBottomNavbar, { global: { plugins: [vuetify] } });

beforeEach(() => {
    pendingCount.value = 0;
    pendingInvitesCount.value = 0;
    routeMock.name = "series";
});

describe("BaseBottomNavbar", () => {
    it("hides itself on pages without the bottom navbar", () => {
        routeMock.name = "login";
        const wrapper = mountNav();

        expect(wrapper.findComponent({ name: "VBottomNavigation" }).exists()).toBe(false);
    });

    it("shows one button per menu entry on other pages", () => {
        const wrapper = mountNav();

        expect(wrapper.findAllComponents({ name: "VBtn" })).toHaveLength(NAV_MENU.length);
    });

    it("shows a badge with the pending friend request count only when there are some", () => {
        pendingCount.value = 5;
        const wrapper = mountNav();

        expect(wrapper.findComponent({ name: "VBadge" }).props("content")).toBe(5);
    });

    it("combines pending friend requests and pending watch-together invites in the badge", () => {
        pendingCount.value = 2;
        pendingInvitesCount.value = 3;
        const wrapper = mountNav();

        expect(wrapper.findComponent({ name: "VBadge" }).props("content")).toBe(5);
    });

    it("shows the badge from watch-together invites alone", () => {
        pendingInvitesCount.value = 1;
        const wrapper = mountNav();

        expect(wrapper.findComponent({ name: "VBadge" }).props("modelValue")).toBe(true);
    });
});
