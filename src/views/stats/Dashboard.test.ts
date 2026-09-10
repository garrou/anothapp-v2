// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Dashboard from "./Dashboard.vue";
import { vuetify } from "@/test/vuetify";
import { useSerieStore } from "@/stores/serie";
import { ChartGroupedType } from "@/types/types";
import type { GlobalStat } from "@/models/stat";
import type { Playlist } from "@/models/playlist";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    getSeries: vi.fn(),
}));
const statisticComposableMocks = vi.hoisted(() => ({
    getStats: vi.fn(),
}));
const playlistComposableMocks = vi.hoisted(() => ({
    getPlaylists: vi.fn(),
}));
const routeMock = vi.hoisted(() => ({ fullPath: "/dashboard" }));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/statistic", () => ({ useStatistic: () => statisticComposableMocks }));
vi.mock("@/composables/playlist", () => ({ usePlaylist: () => playlistComposableMocks }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const stubs = {
    BaseAppBar: true,
    Chart: true,
    SeriesKinds: true,
    SeriesNotes: true,
    SeriesCountries: true,
    EpisodesHeatmap: true,
    FriendSeries: true,
    FriendPlatforms: true,
    FriendFavoriteActors: true,
    PlaylistCover: true,
    BadgesGrid: true,
};

const stat = (overrides: Partial<GlobalStat> = {}): GlobalStat => ({
    monthTime: 100,
    totalTime: 1000,
    nbSeries: 10,
    nbSeasons: 20,
    nbEpisodes: 200,
    currentStreak: 3,
    longestStreak: 10,
    ...overrides,
} as GlobalStat);

const mountView = async (props: Record<string, unknown> = {}, resolvedStat: GlobalStat = stat()) => {
    statisticComposableMocks.getStats.mockResolvedValue(resolvedStat);
    const wrapper = mount(Dashboard, {
        global: { plugins: [vuetify], stubs },
        props,
    });
    await flushPromises();
    return wrapper;
};

// Nested VWindowItem content is lazy (eager: false), same as everywhere
// else in this app: switch to the tab before asserting on its content.
const openStatsTab = async (wrapper: Awaited<ReturnType<typeof mountView>>, value: number) => {
    await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", value);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
    playlistComposableMocks.getPlaylists.mockResolvedValue([]);
});

describe("Dashboard", () => {
    it("defaults to the stats section when there's no userId", async () => {
        const wrapper = await mountView();

        expect(wrapper.text()).toContain("En cours");
    });

    it("defaults to the series section and loads playlists when a userId is given", async () => {
        const wrapper = await mountView({ userId: "friend-1" });

        expect(playlistComposableMocks.getPlaylists).toHaveBeenCalledWith("friend-1");
        expect(wrapper.findComponent({ name: "FriendSeries" }).exists()).toBe(true);
    });

    it("does not load playlists when there's no userId", async () => {
        await mountView();

        expect(playlistComposableMocks.getPlaylists).not.toHaveBeenCalled();
    });

    it("fetches stats for the given user, or the current user when no userId is given", async () => {
        await mountView({ userId: "friend-1" });
        expect(statisticComposableMocks.getStats).toHaveBeenCalledWith("friend-1");

        vi.clearAllMocks();
        await mountView();
        expect(statisticComposableMocks.getStats).toHaveBeenCalledWith(undefined);
    });

    it("uses preloadedStat instead of fetching when given", async () => {
        const wrapper = await mountView({ preloadedStat: Promise.resolve(stat({ nbSeries: 42 })) });

        expect(statisticComposableMocks.getStats).not.toHaveBeenCalled();
        expect(wrapper.findAllComponents({ name: "StatTile" }).some((t) => t.props("value") === 42)).toBe(true);
    });

    it("shows a stat tile per KPI, hiding the best-month tile when there's no best month", async () => {
        const wrapper = await mountView({}, stat({ bestMonth: undefined }));

        const tiles = wrapper.findAllComponents({ name: "StatTile" });
        expect(tiles).toHaveLength(7);
    });

    it("shows the best-month tile when a best month is given", async () => {
        const wrapper = await mountView({}, stat({ bestMonth: { label: "Mars", value: 500 } } as Partial<GlobalStat>));

        expect(wrapper.findAllComponents({ name: "StatTile" })).toHaveLength(8);
    });

    it.each([
        [ChartGroupedType.Countries, "Belgique", 'Séries du pays "Belgique"'],
        [ChartGroupedType.Kinds, "Drame", 'Séries du genre "Drame"'],
        [ChartGroupedType.Notes, "Chef d'oeuvre", 'Séries notées "Chef d\'oeuvre"'],
    ])("applies the right store filter and modal title for a %s chart click", async (kind, name, expectedTitle) => {
        serieComposableMocks.getSeries.mockResolvedValue([{ id: 1, title: "X" } as Serie]);
        const wrapper = await openStatsTab(await mountView(), 3);
        const serieStore = useSerieStore();

        await wrapper.findComponent({ name: "SeriesKinds" }).vm.$emit("click", { kind, id: 1, name, value: 5 });
        await flushPromises();

        expect(wrapper.findComponent({ name: "BaseModal" }).props("title")).toBe(expectedTitle);
        expect(serieComposableMocks.getSeries).toHaveBeenCalled();
        if (kind === ChartGroupedType.Countries) expect(serieStore.filterCountries).toEqual([name]);
        if (kind === ChartGroupedType.Kinds) expect(serieStore.filterKinds).toEqual([{ name, value: name }]);
        if (kind === ChartGroupedType.Notes) expect(serieStore.filterNotes).toEqual([{ id: 1, name }]);
    });

    it("resets the serie store's filters when the modal is closed", async () => {
        serieComposableMocks.getSeries.mockResolvedValue([]);
        const wrapper = await openStatsTab(await mountView(), 3);
        const serieStore = useSerieStore();

        await wrapper.findComponent({ name: "SeriesKinds" }).vm.$emit("click", { kind: ChartGroupedType.Kinds, id: 1, name: "Drame", value: 1 });
        await flushPromises();
        expect(serieStore.filterKinds.length).toBeGreaterThan(0);

        await wrapper.findComponent({ name: "BaseModal" }).vm.$emit("update:modelValue", false);
        await flushPromises();

        expect(serieStore.filterKinds).toEqual([]);
    });

    it("renders a card per playlist when browsing a friend's playlists", async () => {
        playlistComposableMocks.getPlaylists.mockResolvedValue([{ id: "p1", name: "Playlist" } as Playlist]);
        const wrapper = await openStatsTab(await mountView({ userId: "friend-1" }), 3);

        expect(wrapper.findAllComponents({ name: "PlaylistCover" })).toHaveLength(1);
    });

    it("shows a 'Succès' tab with the full badges grid on your own dashboard, after Répartition", async () => {
        const wrapper = await openStatsTab(await mountView(), 4);

        expect(wrapper.findComponent({ name: "BadgesGrid" }).props("userId")).toBeUndefined();
    });

    it("shows a top-level 'Succès' tab with the friend's unlocked-only badges grid, next to Playlists", async () => {
        const wrapper = await openStatsTab(await mountView({ userId: "friend-1" }), 4);

        expect(wrapper.findComponent({ name: "BadgesGrid" }).props("userId")).toBe("friend-1");
    });
});
