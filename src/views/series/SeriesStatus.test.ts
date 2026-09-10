// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import SeriesStatus from "./SeriesStatus.vue";
import { vuetify } from "@/test/vuetify";
import { SerieStatus } from "@/types/types";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    getSeriesByStatus: vi.fn(),
}));
const routeMock = vi.hoisted(() => ({ fullPath: "/series-status" }));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const serie = (id: number): Partial<Serie> => ({ id, title: "Serie " + id });

const mountView = async (status: SerieStatus, series: Partial<Serie>[] = [serie(1)]) => {
    serieComposableMocks.getSeriesByStatus.mockResolvedValue(series);
    const wrapper = mount(SeriesStatus, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, SerieCard: true } },
        props: { status },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
});

describe("SeriesStatus", () => {
    it("fetches series for the given status", async () => {
        await mountView(SerieStatus.Favorite);

        expect(serieComposableMocks.getSeriesByStatus).toHaveBeenCalledWith(SerieStatus.Favorite);
    });

    it("re-fetches when the status prop changes", async () => {
        const wrapper = await mountView(SerieStatus.Favorite);
        serieComposableMocks.getSeriesByStatus.mockResolvedValue([serie(2)]);

        await wrapper.setProps({ status: SerieStatus.Finished });
        await flushPromises();

        expect(serieComposableMocks.getSeriesByStatus).toHaveBeenCalledWith(SerieStatus.Finished);
    });

    it.each([
        [SerieStatus.Continue, true],
        [SerieStatus.Stopped, true],
        [SerieStatus.Favorite, false],
        [SerieStatus.Finished, false],
    ])("shows the watch status only for continue/stopped (%s -> %s)", async (status, expected) => {
        const wrapper = await mountView(status);

        expect(wrapper.findComponent({ name: "SeriesRow" }).props("watchStatus")).toBe(expected);
    });

    it.each([
        [SerieStatus.Favorite, "Aucun favori"],
        [SerieStatus.Continue, "Rien à continuer"],
        [SerieStatus.Stopped, "Aucune série arrêtée"],
        [SerieStatus.Finished, "Aucune série terminée"],
        [SerieStatus.Watchlist, "Votre liste est vide"],
    ])("uses the right empty-state copy for %s", async (status, expectedTitle) => {
        const wrapper = await mountView(status);

        expect(wrapper.findComponent({ name: "SeriesRow" }).props("emptyTitle")).toBe(expectedTitle);
    });

    it("removes a favorited serie from the list when unfavorited on the Favorite tab", async () => {
        const wrapper = await mountView(SerieStatus.Favorite, [serie(1), serie(2)]);

        await wrapper.findComponent({ name: "SeriesRow" }).vm.$emit("refresh", 1, "favorite");

        expect(wrapper.findComponent({ name: "SeriesRow" }).props("series")).toEqual([serie(2)]);
    });

    it("does not remove a serie for a refresh kind unrelated to the current status", async () => {
        const wrapper = await mountView(SerieStatus.Favorite, [serie(1)]);

        await wrapper.findComponent({ name: "SeriesRow" }).vm.$emit("refresh", 1, "list");

        expect(wrapper.findComponent({ name: "SeriesRow" }).props("series")).toEqual([serie(1)]);
    });
});
