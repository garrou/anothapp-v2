// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import EpisodesChecklist from "./EpisodesChecklist.vue";
import { vuetify } from "@/test/vuetify";
import type { UserEpisode } from "@/models/userEpisode";
import { formatDate, toDatetimeLocalInput } from "@/utils/format";

const episodeComposableMocks = vi.hoisted(() => ({
    getEpisodesBySeasonId: vi.fn(),
    addEpisodeViewing: vi.fn(),
    updateEpisodeViewing: vi.fn(),
    deleteEpisodeViewing: vi.fn(),
}));

vi.mock("@/composables/episode", () => ({ useEpisode: () => episodeComposableMocks }));

const PAST_DATE = "2020-01-01T10:00:00.000Z";
const FUTURE_DATE = "2099-01-01T10:00:00.000Z";

const unaired: UserEpisode = { id: null, episodeId: 1, title: "Unaired", code: "S01E01", number: 1, global: 1, date: FUTURE_DATE, watchedAt: null };
const airedUnwatched: UserEpisode = { id: null, episodeId: 2, title: "To watch", code: "S01E02", number: 2, global: 2, date: PAST_DATE, watchedAt: null };
const watched: UserEpisode = { id: 99, episodeId: 3, title: "Watched", code: "S01E03", number: 3, global: 3, date: PAST_DATE, watchedAt: PAST_DATE };

const mountChecklist = async (episodes: UserEpisode[]) => {
    episodeComposableMocks.getEpisodesBySeasonId.mockResolvedValue(episodes);
    const wrapper = mount(EpisodesChecklist, {
        global: { plugins: [vuetify] },
        props: { userSeasonId: 7 },
    });
    await flushPromises();
    await wrapper.find(".v-expansion-panel-title").trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("EpisodesChecklist", () => {
    it("fetches episodes for the given user season on mount", async () => {
        await mountChecklist([]);

        expect(episodeComposableMocks.getEpisodesBySeasonId).toHaveBeenCalledWith(7);
    });

    it("shows an 'à venir' chip for an unaired episode", async () => {
        const wrapper = await mountChecklist([unaired]);

        expect(wrapper.text()).toContain("À venir");
        expect(wrapper.find(".episode-entry-btn").exists()).toBe(false);
    });

    it("shows an add button for an aired, unwatched episode", async () => {
        const wrapper = await mountChecklist([airedUnwatched]);

        expect(wrapper.text()).not.toContain("À venir");
        expect(wrapper.find(".episode-entry-btn").exists()).toBe(true);
    });

    it("shows the watched date and edit/delete buttons for a watched episode", async () => {
        const wrapper = await mountChecklist([watched]);

        expect(wrapper.text()).toContain(formatDate(PAST_DATE));
        expect(wrapper.findAll(".episode-entry-btn")).toHaveLength(2);
    });

    it("adds a viewing, reloads, and emits refresh when the add button is clicked", async () => {
        episodeComposableMocks.addEpisodeViewing.mockResolvedValue(undefined);
        const wrapper = await mountChecklist([airedUnwatched]);
        episodeComposableMocks.getEpisodesBySeasonId.mockResolvedValue([watched]);

        await wrapper.find(".episode-entry-btn").trigger("click");
        await flushPromises();

        expect(episodeComposableMocks.addEpisodeViewing).toHaveBeenCalledWith(7, 2);
        expect(episodeComposableMocks.getEpisodesBySeasonId).toHaveBeenCalledTimes(2);
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("opens a confirm dialog and deletes the viewing when confirmed", async () => {
        episodeComposableMocks.deleteEpisodeViewing.mockResolvedValue(undefined);
        const wrapper = await mountChecklist([watched]);

        const buttons = wrapper.findAll(".episode-entry-btn");
        await buttons[buttons.length - 1].trigger("click");

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Confirmer");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(episodeComposableMocks.deleteEpisodeViewing).toHaveBeenCalledWith(99);
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("toggles edit mode and pre-fills the date input from the episode's watchedAt", async () => {
        const wrapper = await mountChecklist([watched]);

        const buttons = wrapper.findAll(".episode-entry-btn");
        await buttons[0].trigger("click");

        expect(wrapper.find(".episode-entry-edit").exists()).toBe(true);
        expect((wrapper.find("input[type='datetime-local']").element as HTMLInputElement).value).toBe(toDatetimeLocalInput(PAST_DATE));

        await buttons[0].trigger("click");
        expect(wrapper.find(".episode-entry-edit").exists()).toBe(false);
    });

    it("saves the edited watched date, reloads, and exits edit mode", async () => {
        episodeComposableMocks.updateEpisodeViewing.mockResolvedValue(undefined);
        const wrapper = await mountChecklist([watched]);

        await wrapper.find(".episode-entry-btn").trigger("click");
        await wrapper.find("input[type='datetime-local']").setValue("2021-06-15T09:30");
        await wrapper.find(".episode-entry-edit .v-btn").trigger("click");
        await flushPromises();

        expect(episodeComposableMocks.updateEpisodeViewing).toHaveBeenCalledWith(99, new Date("2021-06-15T09:30").toISOString());
        expect(wrapper.find(".episode-entry-edit").exists()).toBe(false);
    });
});
