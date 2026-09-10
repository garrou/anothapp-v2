// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Discover from "./Discover.vue";
import { vuetify } from "@/test/vuetify";
import { useSearchStore } from "@/stores/search";
import type { Serie } from "@/models/serie";
import type { Kind } from "@/models/serie";

const searchComposableMocks = vi.hoisted(() => ({
    getSeries: vi.fn(),
}));
const routeMock = vi.hoisted(() => ({ fullPath: "/discover" }));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const mountView = async (series: Partial<Serie>[] = []) => {
    searchComposableMocks.getSeries.mockResolvedValue(series);
    const wrapper = mount(Discover, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, FriendRecommendations: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
});

describe("Discover", () => {
    it("fetches series on mount", async () => {
        await mountView();

        expect(searchComposableMocks.getSeries).toHaveBeenCalledTimes(1);
    });

    it("re-fetches when a search filter changes", async () => {
        await mountView();
        useSearchStore().filterTitle = "Breaking Bad";
        await flushPromises();

        expect(searchComposableMocks.getSeries).toHaveBeenCalledTimes(2);
    });

    it("re-fetches when the platform or kind filters change", async () => {
        await mountView();
        useSearchStore().filterKinds = [{ name: "Drame", value: "drama" } as Kind];
        await flushPromises();

        expect(searchComposableMocks.getSeries).toHaveBeenCalledTimes(2);
    });

    it("shows friend recommendations when there are no active filters", async () => {
        const wrapper = await mountView();

        expect(wrapper.findComponent({ name: "FriendRecommendations" }).exists()).toBe(true);
    });

    it("hides friend recommendations once a filter is active", async () => {
        const wrapper = await mountView();

        useSearchStore().filterTitle = "Breaking Bad";
        await flushPromises();

        expect(wrapper.findComponent({ name: "FriendRecommendations" }).exists()).toBe(false);
    });
});
