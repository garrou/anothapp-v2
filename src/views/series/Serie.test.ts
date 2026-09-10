// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Serie from "./Serie.vue";
import { vuetify } from "@/test/vuetify";
import { useStateStore } from "@/stores/state";
import type { SerieInfo } from "@/models/serie";
import type { Season } from "@/models/season";
import type { User } from "@/models/user";

const serieComposableMocks = vi.hoisted(() => ({
    deleteSerie: vi.fn(),
    getSerieInfos: vi.fn(),
    updateField: vi.fn(),
    getSerieFromCache: vi.fn(),
}));
const seasonComposableMocks = vi.hoisted(() => ({
    addSeason: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getSeasonsBySerieId: vi.fn(),
    getPlatforms: vi.fn(),
    getNotes: vi.fn(),
}));
const friendComposableMocks = vi.hoisted(() => ({
    getFriends: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/season", () => ({ useSeason: () => seasonComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const stubs = {
    SerieHero: true,
    SeasonsRow: true,
    SeasonDetails: true,
    SeasonEpisodes: true,
    FriendsRow: true,
    ButtonWatchSerie: true,
    ButtonFavoriteSerie: true,
    ButtonDetailsSerie: true,
    ButtonUpdateSerie: true,
    ButtonRemoveSerie: true,
    ButtonAddToPlaylist: true,
};

const serieInfo = (overrides: Partial<SerieInfo["serie"]> = {}, infoOverrides: Partial<SerieInfo> = {}): SerieInfo => ({
    serie: {
        id: 1,
        title: "Breaking Bad",
        seasons: 5,
        episodes: 62,
        duration: 45,
        favorite: false,
        watch: false,
        ...overrides,
    } as SerieInfo["serie"],
    seasons: [],
    time: 120,
    episodes: 10,
    ...infoOverrides,
} as SerieInfo);

const mountView = async (id = 1, info: SerieInfo = serieInfo(), foundInCache = true) => {
    serieComposableMocks.getSerieFromCache.mockResolvedValue(foundInCache ? info.serie : undefined);
    serieComposableMocks.getSerieInfos.mockResolvedValue(info);
    searchComposableMocks.getPlatforms.mockResolvedValue([]);
    searchComposableMocks.getNotes.mockResolvedValue([]);
    searchComposableMocks.getSeasonsBySerieId.mockResolvedValue([]);
    const wrapper = mount(Serie, {
        global: { plugins: [vuetify], stubs },
        props: { id },
    });
    await flushPromises();
    return wrapper;
};

// BaseMenu's content (the "Amis qui regardent..." item, etc.) is lazy like
// every other Vuetify overlay in this app: open it before finding items.
const openActionsMenu = async (wrapper: Awaited<ReturnType<typeof mountView>>) => {
    await wrapper.find(".actions-row button").trigger("click");
    return wrapper;
};

// ButtonUpdateSerie is stubbed for isolation; it's the real trigger for
// updateModal in production, so emit its "update" event directly here.
const openUpdateDateModal = async (wrapper: Awaited<ReturnType<typeof mountView>>) => {
    await openActionsMenu(wrapper);
    await wrapper.findComponent({ name: "ButtonUpdateSerie" }).vm.$emit("update");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
});

describe("Serie", () => {
    it("redirects to /series when the serie isn't found in cache", async () => {
        await mountView(1, serieInfo(), false);

        expect(routerMocks.push).toHaveBeenCalledWith("/series");
        expect(serieComposableMocks.getSerieInfos).not.toHaveBeenCalled();
    });

    it("shows the serie once loaded", async () => {
        const wrapper = await mountView(1, serieInfo({ title: "Dexter" }));

        expect(wrapper.findComponent({ name: "SerieHero" }).props("title")).toBe("Dexter");
    });

    it("computes viewingPercent from distinct episodes when available", async () => {
        const wrapper = await mountView(1, serieInfo({ episodes: 10 }, { distinctEpisodes: 5 }));

        expect(wrapper.find(".ring-value").text()).toBe("50%");
    });

    it("caps viewingPercent at 100% even if distinct episodes exceed the total", async () => {
        const wrapper = await mountView(1, serieInfo({ episodes: 10 }, { distinctEpisodes: 15 }));

        expect(wrapper.find(".ring-value").text()).toBe("100%");
    });

    it("falls back to seasons-based viewingPercent when distinctEpisodes is unavailable", async () => {
        const wrapper = await mountView(1, serieInfo(
            { seasons: 4 },
            { distinctEpisodes: undefined, seasons: [{ number: 1 }, { number: 2 }] as Season[] },
        ));

        expect(wrapper.find(".ring-value").text()).toBe("50%");
    });

    it("shows 0% when the serie has no season count at all", async () => {
        const wrapper = await mountView(1, serieInfo({ seasons: undefined }, { distinctEpisodes: undefined, seasons: [] }));

        expect(wrapper.find(".ring-value").text()).toBe("0%");
    });

    it("shows the remaining-time tile only when seasons are missing", async () => {
        const complete = await mountView(1, serieInfo({ seasons: 1 }, { seasons: [{ number: 1 }] as Season[] }));
        expect(complete.findAllComponents({ name: "StatTile" }).some((t) => t.props("label") === "Temps restant")).toBe(false);

        const incomplete = await mountView(1, serieInfo({ seasons: 3 }, { seasons: [{ number: 1 }] as Season[] }));
        expect(incomplete.findAllComponents({ name: "StatTile" }).some((t) => t.props("label") === "Temps restant")).toBe(true);
    });

    it("shows the meta block only when there's network/description/language/creation", async () => {
        const bare = await mountView(1, serieInfo({ network: undefined, description: undefined, creation: undefined, language: undefined, country: "USA" }));
        expect(bare.find(".serie-meta").exists()).toBe(false);

        const withMeta = await mountView(1, serieInfo({ network: "AMC", country: "USA" }));
        expect(withMeta.find(".serie-meta").exists()).toBe(true);
    });

    it("loads seasons once, the first time the 'Ajouter' tab is opened", async () => {
        const wrapper = await mountView();

        await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", 2);
        await flushPromises();
        await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", 1);
        await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", 2);
        await flushPromises();

        expect(searchComposableMocks.getSeasonsBySerieId).toHaveBeenCalledTimes(1);
    });

    it("adds a season, reloads, and opens it in watched (non-addable) mode", async () => {
        seasonComposableMocks.addSeason.mockResolvedValue(undefined);
        const wrapper = await mountView();
        await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", 2);
        await flushPromises();

        const season = { number: 2, episodes: 8 } as Season;
        await wrapper.findAllComponents({ name: "SeasonsRow" })[1].vm.$emit("addSeason", season);
        await flushPromises();

        expect(seasonComposableMocks.addSeason).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), season);
        expect(serieComposableMocks.getSerieInfos).toHaveBeenCalledTimes(2);
        expect(wrapper.findComponent({ name: "BaseModal" }).props("modelValue")).toBe(true);
    });

    it("loads friends who watch only once when the friends modal is opened repeatedly", async () => {
        friendComposableMocks.getFriends.mockResolvedValue({ viewed: [{ id: "f1" } as User] });
        const wrapper = await openActionsMenu(await mountView());

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();
        await openActionsMenu(wrapper);
        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(friendComposableMocks.getFriends).toHaveBeenCalledTimes(1);
    });

    it("rejects an added-at date in the future without calling updateField", async () => {
        const wrapper = await openUpdateDateModal(await mountView());
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

        await wrapper.find('input[type="datetime-local"]').setValue(futureDate);
        const saveBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Enregistrer");
        await saveBtn!.trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Date d'ajout invalide");
        expect(serieComposableMocks.updateField).not.toHaveBeenCalled();
    });

    it("updates the added-at date and shows a success toast on save", async () => {
        serieComposableMocks.updateField.mockResolvedValue(true);
        const wrapper = await openUpdateDateModal(await mountView());
        const pastDate = "2020-01-01T10:00";

        await wrapper.find('input[type="datetime-local"]').setValue(pastDate);
        const saveBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Enregistrer");
        await saveBtn!.trigger("click");
        await flushPromises();

        expect(serieComposableMocks.updateField).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), "addedAt", expect.any(String));
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Date d'ajout de la série modifiée");
    });

    it("shows an error toast when updating the added-at date fails", async () => {
        serieComposableMocks.updateField.mockResolvedValue(false);
        const wrapper = await openUpdateDateModal(await mountView());

        await wrapper.find('input[type="datetime-local"]').setValue("2020-01-01T10:00");
        const saveBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Enregistrer");
        await saveBtn!.trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Impossible de modifier la date d'ajout de la série");
    });

    it("resets tab/friends/seasons and reloads when the id prop changes", async () => {
        friendComposableMocks.getFriends.mockResolvedValue({ viewed: [{ id: "f1" } as User] });
        const wrapper = await openActionsMenu(await mountView(1));
        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        serieComposableMocks.getSerieFromCache.mockResolvedValue(serieInfo({ id: 2, title: "Dexter" }).serie);
        serieComposableMocks.getSerieInfos.mockResolvedValue(serieInfo({ id: 2, title: "Dexter" }));
        await wrapper.setProps({ id: 2 });
        await flushPromises();

        expect(wrapper.findComponent({ name: "SerieHero" }).props("title")).toBe("Dexter");
        expect(serieComposableMocks.getSerieFromCache).toHaveBeenCalledWith(2);
    });

    it("deletes the serie when the delete confirmation is confirmed", async () => {
        serieComposableMocks.deleteSerie.mockResolvedValue(undefined);
        const wrapper = await mountView(1, serieInfo({ title: "Breaking Bad" }));
        useStateStore().confirmModal = true;
        await flushPromises();

        await wrapper.findComponent({ name: "BaseConfirm" }).vm.$emit("confirm");
        await flushPromises();

        expect(serieComposableMocks.deleteSerie).toHaveBeenCalledWith(expect.objectContaining({ title: "Breaking Bad" }));
    });
});
