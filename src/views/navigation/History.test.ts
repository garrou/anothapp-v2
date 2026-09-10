// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import History from "./History.vue";
import { vuetify } from "@/test/vuetify";
import { parseLocalDate, toLocalDateKey } from "@/utils/date";
import type { SeasonTimeline } from "@/models/season";
import type { EpisodeTimeline } from "@/models/episodeTimeline";
import type { Platform } from "@/models/serie";

const searchComposableMocks = vi.hoisted(() => ({
    getPlatforms: vi.fn(),
}));
const seasonComposableMocks = vi.hoisted(() => ({
    getSeasonsTimeline: vi.fn(),
}));
const episodeComposableMocks = vi.hoisted(() => ({
    getEpisodesTimeline: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("@/composables/season", () => ({ useSeason: () => seasonComposableMocks }));
vi.mock("@/composables/episode", () => ({ useEpisode: () => episodeComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));

// The global RouterLink:true stub swallows its default slot, hiding the
// serie title/subtitle text these tests assert on.
const routerLinkStub = { props: ["to"], template: "<a :href=\"to\"><slot /></a>" };

const seasonItem = (showId: number, addedAt: string, overrides: Partial<SeasonTimeline> = {}): SeasonTimeline => ({
    addedAt,
    showId,
    showTitle: "Serie " + showId,
    season: { number: 1, episodes: 10, image: "" },
    ...overrides,
} as SeasonTimeline);

const episodeItem = (showId: number, watchedAt: string, overrides: Partial<EpisodeTimeline> = {}): EpisodeTimeline => ({
    showId,
    showTitle: "Serie " + showId,
    watchedAt,
    episode: { id: 1, title: "Pilot", code: "S01E01", number: 1, global: 1 },
    ...overrides,
} as EpisodeTimeline);

interface MountOptions {
    episodeTrackingEnabled?: boolean;
    seasons?: SeasonTimeline[];
    episodes?: EpisodeTimeline[];
    platforms?: Platform[];
}

const mountView = async ({
    episodeTrackingEnabled = false,
    seasons = [],
    episodes = [],
    platforms = [],
}: MountOptions = {}) => {
    userComposableMocks.getProfile.mockResolvedValue({ episodeTrackingEnabled });
    seasonComposableMocks.getSeasonsTimeline.mockResolvedValue(seasons);
    episodeComposableMocks.getEpisodesTimeline.mockResolvedValue(episodes);
    searchComposableMocks.getPlatforms.mockResolvedValue(platforms);
    const wrapper = mount(History, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, RouterLink: routerLinkStub } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("History", () => {
    it("shows an empty state when there's no history", async () => {
        const wrapper = await mountView();

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
    });

    it("shows season history by default (episode tracking disabled)", async () => {
        const wrapper = await mountView({
            episodeTrackingEnabled: false,
            seasons: [seasonItem(1, "2024-01-10T10:00:00.000Z")],
        });

        expect(seasonComposableMocks.getSeasonsTimeline).toHaveBeenCalledWith(0);
        expect(episodeComposableMocks.getEpisodesTimeline).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain("Saison 1");
    });

    it("shows episode history when episode tracking is enabled", async () => {
        const wrapper = await mountView({
            episodeTrackingEnabled: true,
            episodes: [episodeItem(1, "2024-01-10T10:00:00.000Z")],
        });

        expect(episodeComposableMocks.getEpisodesTimeline).toHaveBeenCalledWith(0);
        expect(seasonComposableMocks.getSeasonsTimeline).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain("S01E01");
    });

    it("selects a month, re-fetches, and updates the label", async () => {
        const wrapper = await mountView();

        await wrapper.findComponent({ name: "VMenu" }).vm.$emit("update:modelValue", true);
        const options = wrapper.findAll(".month-option");
        await options[2].trigger("click"); // "Depuis 2 mois" -> value 2
        await flushPromises();

        expect(seasonComposableMocks.getSeasonsTimeline).toHaveBeenLastCalledWith(2);
        expect(wrapper.find(".month-trigger span").text()).toBe("Depuis 2 mois");
    });

    it("resolves each card's platform by id", async () => {
        const netflix = { id: 1, name: "Netflix" } as Platform;
        const wrapper = await mountView({
            seasons: [seasonItem(1, "2024-01-10T10:00:00.000Z", { platformId: 1 })],
            platforms: [netflix, { id: 2, name: "Disney+" } as Platform],
        });

        expect(wrapper.findComponent({ name: "PlatformCard" }).props("platform")).toEqual(netflix);
    });

    it("groups items by local date and sorts groups most-recent-first", async () => {
        const older = "2024-01-05T10:00:00.000Z";
        const newer = "2024-01-20T10:00:00.000Z";
        const wrapper = await mountView({
            seasons: [seasonItem(1, older), seasonItem(2, newer)],
        });

        const badges = wrapper.findAllComponents({ name: "DayBadge" });
        const expectedNewerDay = parseLocalDate(toLocalDateKey(newer)).getDate();
        const expectedOlderDay = parseLocalDate(toLocalDateKey(older)).getDate();
        expect(badges[0].props("day")).toBe(expectedNewerDay);
        expect(badges[1].props("day")).toBe(expectedOlderDay);
    });

    it("groups same-day items from different shows together", async () => {
        const sameDate = "2024-01-10T10:00:00.000Z";
        const wrapper = await mountView({
            seasons: [seasonItem(1, sameDate), seasonItem(2, sameDate)],
        });

        expect(wrapper.findAllComponents({ name: "DayBadge" })).toHaveLength(1);
        expect(wrapper.text()).toContain("Serie 1");
        expect(wrapper.text()).toContain("Serie 2");
    });
});
