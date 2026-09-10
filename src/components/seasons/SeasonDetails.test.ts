// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import SeasonDetails from "./SeasonDetails.vue";
import { vuetify } from "@/test/vuetify";
import type { SeasonDetail } from "@/models/season";
import type { Platform } from "@/models/serie";
import type { User } from "@/models/user";

const seasonComposableMocks = vi.hoisted(() => ({
    deleteSeason: vi.fn(),
    getSeasonInfosBySerieIdByNumber: vi.fn(),
    getSeasonWatchedTime: vi.fn(),
    updateSeason: vi.fn(),
    updateWatchedWith: vi.fn(),
}));
const episodeComposableMocks = vi.hoisted(() => ({
    addAllEpisodesViewing: vi.fn(),
}));
const serieComposableMocks = vi.hoisted(() => ({
    getSerie: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getPlatforms: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));
const platformComposableMocks = vi.hoisted(() => ({
    getUserPlatforms: vi.fn(),
}));
const friendComposableMocks = vi.hoisted(() => ({
    getCachedFriends: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
}));

vi.mock("@/composables/season", () => ({ useSeason: () => seasonComposableMocks }));
vi.mock("@/composables/episode", () => ({ useEpisode: () => episodeComposableMocks }));
vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/platform", () => ({ usePlatform: () => platformComposableMocks }));
vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const platform1: Platform = { id: 1, name: "Netflix" } as Platform;
const friend1: User = { id: "f1", username: "Ami1", current: false } as User;

const subSeason = (id: number, overrides: Partial<SeasonDetail> = {}): SeasonDetail => ({
    id,
    addedAt: "2023-05-01T10:00:00.000Z",
    platform: platform1,
    watchedWith: [friend1],
    ...overrides,
});

interface MountOptions {
    seasons?: SeasonDetail[];
    episodeTrackingEnabled?: boolean;
    justAdded?: boolean;
    watchedTime?: number | null;
    serieDuration?: number;
}

const mountDetails = async ({
    seasons = [subSeason(501)],
    episodeTrackingEnabled = false,
    justAdded = false,
    watchedTime = 120,
    serieDuration = 45,
}: MountOptions = {}) => {
    seasonComposableMocks.getSeasonInfosBySerieIdByNumber.mockResolvedValue(seasons);
    seasonComposableMocks.getSeasonWatchedTime.mockResolvedValue(watchedTime);
    searchComposableMocks.getPlatforms.mockResolvedValue([platform1]);
    userComposableMocks.getProfile.mockResolvedValue({ episodeTrackingEnabled });
    platformComposableMocks.getUserPlatforms.mockResolvedValue([1]);
    friendComposableMocks.getCachedFriends.mockResolvedValue([friend1]);
    serieComposableMocks.getSerie.mockResolvedValue({ duration: serieDuration });

    const wrapper = mount(SeasonDetails, {
        global: { plugins: [vuetify], stubs: { EpisodesChecklist: true } },
        props: { id: 1, season: { episodes: 10, image: "x", number: 1 }, justAdded },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("SeasonDetails", () => {
    it("renders nothing when there are no seasons", async () => {
        const wrapper = await mountDetails({ seasons: [] });

        expect(wrapper.find(".season-entry").exists()).toBe(false);
        expect(wrapper.find(".season-details-total").exists()).toBe(false);
    });

    it("computes total time from the serie's duration when episode tracking is disabled", async () => {
        const wrapper = await mountDetails({ episodeTrackingEnabled: false, serieDuration: 45 });

        expect(serieComposableMocks.getSerie).toHaveBeenCalledWith({ id: 1 });
        expect(seasonComposableMocks.getSeasonWatchedTime).not.toHaveBeenCalled();
        expect(wrapper.find(".season-details-total").text()).toContain("7 h 30");
    });

    it("computes total time from watched episodes when episode tracking is enabled", async () => {
        const wrapper = await mountDetails({ episodeTrackingEnabled: true, watchedTime: 125 });

        expect(seasonComposableMocks.getSeasonWatchedTime).toHaveBeenCalledWith(1, 1);
        expect(wrapper.find(".season-details-total").text()).toContain("2 h 5");
    });

    it("offers a bulk-mark prompt for the last season when justAdded and episode tracking is enabled", async () => {
        const wrapper = await mountDetails({
            seasons: [subSeason(501), subSeason(502)],
            episodeTrackingEnabled: true,
            justAdded: true,
        });

        expect(wrapper.text()).toContain("Marquer tous les épisodes diffusés de cette saison comme vus ?");
    });

    it("does not offer the bulk-mark prompt when episode tracking is disabled", async () => {
        const wrapper = await mountDetails({ episodeTrackingEnabled: false, justAdded: true });

        expect(wrapper.text()).not.toContain("Marquer tous les épisodes diffusés");
    });

    it("marks all episodes watched, refreshes the time, and emits refreshStats on bulk accept", async () => {
        episodeComposableMocks.addAllEpisodesViewing.mockResolvedValue(undefined);
        const wrapper = await mountDetails({
            seasons: [subSeason(501)],
            episodeTrackingEnabled: true,
            justAdded: true,
            watchedTime: 60,
        });

        const acceptBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Tout marquer");
        await acceptBtn!.trigger("click");
        await flushPromises();

        expect(episodeComposableMocks.addAllEpisodesViewing).toHaveBeenCalledWith(501);
        expect(seasonComposableMocks.getSeasonWatchedTime).toHaveBeenCalledTimes(2);
        expect(wrapper.emitted("refreshStats")).toHaveLength(1);
        expect(wrapper.text()).not.toContain("Marquer tous les épisodes diffusés");
    });

    it("dismisses the bulk-mark prompt without side effects", async () => {
        const wrapper = await mountDetails({
            seasons: [subSeason(501)],
            episodeTrackingEnabled: true,
            justAdded: true,
        });

        const declineBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Non merci");
        await declineBtn!.trigger("click");

        expect(episodeComposableMocks.addAllEpisodesViewing).not.toHaveBeenCalled();
        expect(wrapper.text()).not.toContain("Marquer tous les épisodes diffusés");
    });

    it("enters edit mode and hides the edit button once editing", async () => {
        const wrapper = await mountDetails();

        expect(wrapper.find(".season-entry-edit").exists()).toBe(false);
        expect(wrapper.findAll(".season-entry-btn")).toHaveLength(2);

        await wrapper.findAll(".season-entry-btn")[0].trigger("click");

        expect(wrapper.find(".season-entry-edit").exists()).toBe(true);
        expect(wrapper.findAll(".season-entry-btn")).toHaveLength(1);
    });

    it("saves the (unchanged, pre-filled) platform and watched-with when the edit form is submitted", async () => {
        seasonComposableMocks.updateSeason.mockResolvedValue(true);
        seasonComposableMocks.updateWatchedWith.mockResolvedValue(undefined);
        const wrapper = await mountDetails();

        const buttons = wrapper.findAll(".season-entry-btn");
        await buttons[0].trigger("click");

        const saveBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Enregistrer");
        await saveBtn!.trigger("click");
        await flushPromises();

        expect(seasonComposableMocks.updateSeason).toHaveBeenCalledWith(501, 1, "2023-05-01T10:00");
        expect(seasonComposableMocks.updateWatchedWith).toHaveBeenCalledWith(501, ["f1"]);
    });

    it("opens a confirm dialog and deletes the season on confirm, emitting refresh", async () => {
        seasonComposableMocks.deleteSeason.mockResolvedValue(undefined);
        const wrapper = await mountDetails();

        const buttons = wrapper.findAll(".season-entry-btn");
        await buttons[buttons.length - 1].trigger("click");

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Confirmer");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(seasonComposableMocks.deleteSeason).toHaveBeenCalledWith(501);
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
