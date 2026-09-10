// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendSeries from "./FriendSeries.vue";
import { vuetify } from "@/test/vuetify";
import { SerieStatus } from "@/types/types";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    getSeriesByStatus: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));

const mountFriendSeries = async (
    series: Partial<Serie>[],
    type: SerieStatus.All | SerieStatus.Shared | SerieStatus.Favorite,
    userId = "friend-1",
) => {
    serieComposableMocks.getSeriesByStatus.mockResolvedValue(series);
    const wrapper = mount(FriendSeries, {
        global: { plugins: [vuetify] },
        props: { userId, type },
    });
    await flushPromises();
    return wrapper;
};

const openPanel = async (wrapper: Awaited<ReturnType<typeof mountFriendSeries>>) => {
    await wrapper.find(".v-expansion-panel-title").trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendSeries", () => {
    it("fetches series for the given type and friend on mount", async () => {
        await mountFriendSeries([{ id: 1, title: "Breaking Bad" }], SerieStatus.Shared, "friend-1");

        expect(serieComposableMocks.getSeriesByStatus).toHaveBeenCalledWith(SerieStatus.Shared, "friend-1");
    });

    it("passes the fetched series to series-link-list", async () => {
        const series = [{ id: 1, title: "Breaking Bad" }, { id: 2, title: "Dexter" }];
        const wrapper = await openPanel(await mountFriendSeries(series, SerieStatus.Shared));

        expect(wrapper.findComponent({ name: "SeriesLinkList" }).props("series")).toEqual(series);
    });

    it("uses /series as the base path for shared series", async () => {
        const wrapper = await openPanel(await mountFriendSeries([], SerieStatus.Shared));

        expect(wrapper.findComponent({ name: "SeriesLinkList" }).props("basePath")).toBe("/series");
    });

    it("uses /discover as the base path for non-shared series", async () => {
        const wrapper = await openPanel(await mountFriendSeries([], SerieStatus.Favorite));

        expect(wrapper.findComponent({ name: "SeriesLinkList" }).props("basePath")).toBe("/discover");
    });

    it("labels the panel with the count and the singular/plural, type-specific wording", async () => {
        const zero = await mountFriendSeries([], SerieStatus.All);
        expect(zero.text()).toContain("0 série vue");

        const one = await mountFriendSeries([{ id: 1, title: "X" }], SerieStatus.Shared);
        expect(one.text()).toContain("1 série commune");

        const many = await mountFriendSeries([{ id: 1, title: "X" }, { id: 2, title: "Y" }], SerieStatus.Favorite);
        expect(many.text()).toContain("2 séries favorites");
    });
});
