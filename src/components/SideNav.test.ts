// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SideNav from "./SideNav.vue";
import { vuetify } from "@/test/vuetify";

const pendingCount = vi.hoisted(() => ({ value: 0 }));
const routeMock = vi.hoisted(() => ({ name: "series", path: "/series" }));

vi.mock("@/composables/pendingFriendRequests", async () => {
    const { ref } = await import("vue");
    return { usePendingFriendRequests: () => ref(pendingCount.value) };
});
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

// The global RouterLink:true stub (see src/test/setup.ts) swallows its
// default slot entirely, hiding the badge/icon content and the href these
// tests assert on. Use a minimal real-ish stub instead for this file.
const routerLinkStub = {
    props: ["to"],
    template: "<a :href=\"to\"><slot /></a>",
};

const mountNav = () => mount(SideNav, {
    global: { plugins: [vuetify], stubs: { RouterLink: routerLinkStub } },
});

beforeEach(() => {
    pendingCount.value = 0;
    routeMock.name = "series";
    routeMock.path = "/series";
});

describe("SideNav", () => {
    it("hides itself on pages without the bottom navbar", () => {
        routeMock.name = "login";
        const wrapper = mountNav();

        expect(wrapper.find("nav").exists()).toBe(false);
    });

    it("shows the nav on other pages", () => {
        const wrapper = mountNav();

        expect(wrapper.find("nav").exists()).toBe(true);
    });

    it("marks the link matching the current route as active", () => {
        routeMock.path = "/series";
        const wrapper = mountNav();

        const links = wrapper.findAll(".side-nav-link");
        const activeLinks = links.filter((l) => l.classes().includes("side-nav-link--active"));
        expect(activeLinks).toHaveLength(1);
        expect(activeLinks[0].attributes("href")).toBe("/series");
    });

    it("marks a link active for a nested sub-route", () => {
        routeMock.path = "/series/status";
        const wrapper = mountNav();

        const active = wrapper.findAll(".side-nav-link").filter((l) => l.classes().includes("side-nav-link--active"));
        expect(active[0].attributes("href")).toBe("/series");
    });

    it("shows a badge with the pending friend request count only when there are some", () => {
        pendingCount.value = 3;
        const wrapper = mountNav();

        expect(wrapper.findComponent({ name: "VBadge" }).props("content")).toBe(3);
    });
});
