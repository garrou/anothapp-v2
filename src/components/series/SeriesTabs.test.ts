// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SeriesTabs from "./SeriesTabs.vue";
import { vuetify } from "@/test/vuetify";
import { NAV_SERIES_STATUS } from "@/constants/menus";

const routeMock = vi.hoisted(() => ({
    name: "series",
    query: {} as Record<string, string>,
}));

vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const mountTabs = () => mount(SeriesTabs, { global: { plugins: [vuetify] } });

beforeEach(() => {
    vi.resetAllMocks();
    routeMock.name = "series";
    routeMock.query = {};
});

describe("SeriesTabs", () => {
    it("renders a tab per series status plus the 'all' tab", () => {
        const wrapper = mountTabs();

        expect(wrapper.findAll(".pill-tab")).toHaveLength(NAV_SERIES_STATUS.length + 1);
    });

    it("marks the 'all' tab active when not on the series-status route", () => {
        const wrapper = mountTabs();

        const tabs = wrapper.findAll(".pill-tab");
        expect(tabs[0].classes()).toContain("pill-tab--active");
        tabs.slice(1).forEach((tab) => expect(tab.classes()).not.toContain("pill-tab--active"));
    });

    it("marks the matching status tab active on the series-status route", () => {
        routeMock.name = "series-status";
        routeMock.query = { status: NAV_SERIES_STATUS[0].status };
        const wrapper = mountTabs();

        const tabs = wrapper.findAll(".pill-tab");
        expect(tabs[0].classes()).not.toContain("pill-tab--active");
        expect(tabs[1].classes()).toContain("pill-tab--active");
    });
});
