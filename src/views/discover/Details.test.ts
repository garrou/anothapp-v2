// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Details from "./Details.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";
import { FriendStatus } from "@/types/types";

const searchComposableMocks = vi.hoisted(() => ({
    getCharacters: vi.fn(),
    getSerie: vi.fn(),
    getSerieImages: vi.fn(),
    getSimilarsSeries: vi.fn(),
}));
const friendComposableMocks = vi.hoisted(() => ({
    getFriends: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const stubs = {
    ButtonAddSerie: true,
    ButtonFavoriteSerie: true,
    ButtonListSerie: true,
    ButtonAddToPlaylist: true,
    ActorsRow: true,
    ImagesRow: true,
    FriendsRow: true,
};

const serie = (id: number, overrides: Partial<Serie> = {}): Serie => ({ id, title: "Breaking Bad", ...overrides } as Serie);

const mountView = async (id = 1, resolved: Serie = serie(id)) => {
    searchComposableMocks.getSerie.mockResolvedValue(resolved);
    const wrapper = mount(Details, {
        global: { plugins: [vuetify], stubs },
        props: { id },
    });
    await flushPromises();
    return wrapper;
};

const openTab = async (wrapper: Awaited<ReturnType<typeof mountView>>, tabIndex: number) => {
    const tabs = wrapper.findAllComponents({ name: "VTab" });
    await tabs[tabIndex].trigger("click");
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Details", () => {
    it("fetches and shows the serie for the given id", async () => {
        const wrapper = await mountView(42, serie(42, { title: "Dexter" }));

        expect(searchComposableMocks.getSerie).toHaveBeenCalledWith(42);
        expect(wrapper.text()).toContain("Dexter");
    });

    it("lazily fetches characters only when the Acteurs tab is opened, and only once", async () => {
        searchComposableMocks.getCharacters.mockResolvedValue([]);
        const wrapper = await mountView();

        expect(searchComposableMocks.getCharacters).not.toHaveBeenCalled();

        await openTab(wrapper, 2); // Acteurs
        await openTab(wrapper, 2);

        expect(searchComposableMocks.getCharacters).toHaveBeenCalledTimes(1);
        expect(searchComposableMocks.getCharacters).toHaveBeenCalledWith(1);
    });

    it("lazily fetches similar series only when that tab is opened, and only once", async () => {
        searchComposableMocks.getSimilarsSeries.mockResolvedValue([]);
        const wrapper = await mountView();

        await openTab(wrapper, 3); // Séries similaires
        await openTab(wrapper, 3);

        expect(searchComposableMocks.getSimilarsSeries).toHaveBeenCalledTimes(1);
    });

    it("lazily fetches images only when that tab is opened, and only once", async () => {
        searchComposableMocks.getSerieImages.mockResolvedValue([]);
        const wrapper = await mountView();

        await openTab(wrapper, 4); // Images
        await openTab(wrapper, 4);

        expect(searchComposableMocks.getSerieImages).toHaveBeenCalledTimes(1);
    });

    it("lazily fetches friends who watched it only when that tab is opened, and only once", async () => {
        friendComposableMocks.getFriends.mockResolvedValue({ viewed: [] });
        const wrapper = await mountView();

        await openTab(wrapper, 1); // Vue par
        await openTab(wrapper, 1);

        expect(friendComposableMocks.getFriends).toHaveBeenCalledTimes(1);
        expect(friendComposableMocks.getFriends).toHaveBeenCalledWith(FriendStatus.Viewed, 1);
    });

    it("resets every tab's cached data and re-fetches when the id prop changes", async () => {
        searchComposableMocks.getCharacters.mockResolvedValue([{ id: 1 }]);
        const wrapper = await mountView(1);
        await openTab(wrapper, 2);
        expect(searchComposableMocks.getCharacters).toHaveBeenCalledTimes(1);

        searchComposableMocks.getSerie.mockResolvedValue(serie(2, { title: "Dexter" }));
        await wrapper.setProps({ id: 2 });
        await flushPromises();

        expect(wrapper.text()).toContain("Dexter");

        await openTab(wrapper, 2);
        expect(searchComposableMocks.getCharacters).toHaveBeenCalledTimes(2);
        expect(searchComposableMocks.getCharacters).toHaveBeenLastCalledWith(2);
    });

    it("navigates back to /discover when the hero's back button is used", async () => {
        const wrapper = await mountView();

        await wrapper.findComponent({ name: "SerieHero" }).vm.$emit("back");

        expect(routerMocks.push).toHaveBeenCalledWith("/discover");
    });
});
