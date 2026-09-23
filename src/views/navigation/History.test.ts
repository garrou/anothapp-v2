// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import History from "./History.vue";
import { vuetify } from "@/test/vuetify";
import { parseLocalDate, toLocalDateKey } from "@/utils/date";
import type { EpisodeTimeline } from "@/models/episodeTimeline";
import type { Platform } from "@/models/serie";

const searchComposableMocks = vi.hoisted(() => ({
    getPlatforms: vi.fn(),
}));
const episodeComposableMocks = vi.hoisted(() => ({
    getEpisodesTimeline: vi.fn(),
}));
const routeMock = vi.hoisted(() => ({ fullPath: "/history" }));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("@/composables/episode", () => ({ useEpisode: () => episodeComposableMocks }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

// The global RouterLink:true stub swallows its default slot, hiding the
// serie title/subtitle text these tests assert on.
const routerLinkStub = { props: ["to"], template: "<a :href=\"to\"><slot /></a>" };

const episodeItem = (showId: number, watchedAt: string, overrides: Partial<EpisodeTimeline> = {}): EpisodeTimeline => ({
    showId,
    showTitle: "Serie " + showId,
    watchedAt,
    episode: { id: 1, title: "Pilot", code: "S01E01", number: 1, global: 1 },
    ...overrides,
} as EpisodeTimeline);

interface MountOptions {
    episodes?: EpisodeTimeline[];
    platforms?: Platform[];
}

const mountView = async ({
    episodes = [],
    platforms = [],
}: MountOptions = {}) => {
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
    setActivePinia(createPinia());
});

describe("History", () => {
    it("shows an empty state when there's no history", async () => {
        const wrapper = await mountView();

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
    });

    it("fetches and shows episode history", async () => {
        const wrapper = await mountView({
            episodes: [episodeItem(1, "2024-01-10T10:00:00.000Z")],
        });

        expect(episodeComposableMocks.getEpisodesTimeline).toHaveBeenCalledWith(0);
        expect(wrapper.text()).toContain("S01E01");
    });

    it("selects a month, re-fetches, and updates the label", async () => {
        const wrapper = await mountView();

        await wrapper.findComponent({ name: "VMenu" }).vm.$emit("update:modelValue", true);
        const options = wrapper.findAll(".month-option");
        await options[2].trigger("click"); // "Depuis 2 mois" -> value 2
        await flushPromises();

        expect(episodeComposableMocks.getEpisodesTimeline).toHaveBeenLastCalledWith(2);
        expect(wrapper.find(".month-trigger span").text()).toBe("Depuis 2 mois");
    });

    it("resolves each card's platform by id", async () => {
        const netflix = { id: 1, name: "Netflix" } as Platform;
        const wrapper = await mountView({
            episodes: [episodeItem(1, "2024-01-10T10:00:00.000Z", { platformId: 1 })],
            platforms: [netflix, { id: 2, name: "Disney+" } as Platform],
        });

        expect(wrapper.findComponent({ name: "PlatformCard" }).props("platform")).toEqual(netflix);
    });

    it("groups items by local date and sorts groups most-recent-first", async () => {
        const older = "2024-01-05T10:00:00.000Z";
        const newer = "2024-01-20T10:00:00.000Z";
        const wrapper = await mountView({
            episodes: [episodeItem(1, older), episodeItem(2, newer)],
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
            episodes: [episodeItem(1, sameDate), episodeItem(2, sameDate)],
        });

        expect(wrapper.findAllComponents({ name: "DayBadge" })).toHaveLength(1);
        expect(wrapper.text()).toContain("Serie 1");
        expect(wrapper.text()).toContain("Serie 2");
    });

    it("keeps the selected month across a remount, since it lives in the history store", async () => {
        const wrapper = await mountView();
        await wrapper.findComponent({ name: "VMenu" }).vm.$emit("update:modelValue", true);
        await wrapper.findAll(".month-option")[2].trigger("click"); // "Depuis 2 mois" -> value 2
        await flushPromises();

        wrapper.unmount();
        const remounted = await mountView();

        expect(episodeComposableMocks.getEpisodesTimeline).toHaveBeenLastCalledWith(2);
        expect(remounted.find(".month-trigger span").text()).toBe("Depuis 2 mois");
    });
});
