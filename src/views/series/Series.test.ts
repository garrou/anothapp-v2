// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Series from "./Series.vue";
import { vuetify } from "@/test/vuetify";
import { useSerieStore } from "@/stores/serie";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    getSeries: vi.fn(),
}));
const routeMock = vi.hoisted(() => ({ fullPath: "/series" }));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const mountView = async (series: Partial<Serie>[] = []) => {
    serieComposableMocks.getSeries.mockResolvedValue(series);
    const wrapper = mount(Series, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
});

describe("Series", () => {
    it("fetches series on mount", async () => {
        await mountView();

        expect(serieComposableMocks.getSeries).toHaveBeenCalledTimes(1);
    });

    it("re-fetches when the title filter changes", async () => {
        await mountView();
        useSerieStore().filterTitle = "Breaking Bad";
        await flushPromises();

        expect(serieComposableMocks.getSeries).toHaveBeenCalledTimes(2);
    });

    it("re-fetches when the friends filter changes", async () => {
        await mountView();
        useSerieStore().filterFriends = [{ id: "f1", username: "Dexter", current: false } as never];
        await flushPromises();

        expect(serieComposableMocks.getSeries).toHaveBeenCalledTimes(2);
    });

    it("shows the series status tabs", async () => {
        const wrapper = await mountView();

        expect(wrapper.findComponent({ name: "SeriesTabs" }).exists()).toBe(true);
    });
});
