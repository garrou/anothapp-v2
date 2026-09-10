// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import BaseAppBar from "./BaseAppBar.vue";
import { vuetify } from "@/test/vuetify";
import { useSearchStore } from "@/stores/search";
import { useSerieStore } from "@/stores/serie";
import { DEFAULT_LIMIT } from "@/constants/services";

const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getKinds: vi.fn(),
    getPlatforms: vi.fn(),
    getNotes: vi.fn(),
}));
const serieComposableMocks = vi.hoisted(() => ({
    getCountries: vi.fn(),
}));
const platformComposableMocks = vi.hoisted(() => ({
    getUserPlatforms: vi.fn(),
}));
const friendComposableMocks = vi.hoisted(() => ({
    getCachedFriends: vi.fn(),
}));
const authComposableMocks = vi.hoisted(() => ({
    logout: vi.fn(),
}));
const routeMock = vi.hoisted(() => ({
    path: "/series",
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));
vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/platform", () => ({ usePlatform: () => platformComposableMocks }));
vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const mountAppBar = async (props: Record<string, unknown> = {}) => {
    userComposableMocks.getProfile.mockResolvedValue({ id: "1", username: "Dexter" });
    searchComposableMocks.getKinds.mockResolvedValue([]);
    searchComposableMocks.getPlatforms.mockResolvedValue([]);
    searchComposableMocks.getNotes.mockResolvedValue([]);
    serieComposableMocks.getCountries.mockResolvedValue([]);
    platformComposableMocks.getUserPlatforms.mockResolvedValue([]);
    friendComposableMocks.getCachedFriends.mockResolvedValue([]);

    const wrapper = mount(BaseAppBar, {
        global: { plugins: [vuetify], stubs: { NotificationBell: true } },
        props,
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
    routeMock.path = "/series";
});

describe("BaseAppBar", () => {
    it("shows a search field only when search is true", async () => {
        expect((await mountAppBar({ search: true })).find("form").exists()).toBe(true);
        expect((await mountAppBar({ search: false })).find("form").exists()).toBe(false);
    });

    it("filters the serie store's title on submit when not in discover mode", async () => {
        const wrapper = await mountAppBar({ search: true });
        const serieStore = useSerieStore();

        await wrapper.find("input").setValue("Breaking Bad");
        await wrapper.find("form").trigger("submit");

        expect(serieStore.filterTitle).toBe("Breaking Bad");
    });

    it("filters the search store's title on submit in discover mode", async () => {
        const wrapper = await mountAppBar({ search: true, discover: true });
        const searchStore = useSearchStore();

        await wrapper.find("input").setValue("Breaking Bad");
        await wrapper.find("form").trigger("submit");

        expect(searchStore.filterTitle).toBe("Breaking Bad");
    });

    it("does not live-update the title while typing unless autoSearch is set", async () => {
        const wrapper = await mountAppBar({ search: true, autoSearch: false });
        const serieStore = useSerieStore();

        await wrapper.find("input").setValue("Bre");

        expect(serieStore.filterTitle).toBeUndefined();
    });

    it("live-updates the title while typing when autoSearch is set", async () => {
        const wrapper = await mountAppBar({ search: true, autoSearch: true });
        const serieStore = useSerieStore();

        await wrapper.find("input").trigger("input");

        expect(serieStore.filterTitle).toBe("");
    });

    it("resets the search store and the limit input when 'Effacer tous les filtres' is clicked (discover mode)", async () => {
        const wrapper = await mountAppBar({ search: true, discover: true });
        const searchStore = useSearchStore();
        searchStore.filterTitle = "something";

        const filterBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-filter");
        await filterBtn!.trigger("click");

        const tab3 = wrapper.findAllComponents({ name: "VTab" }).find((t) => t.props("value") === 3);
        await tab3!.trigger("click");

        const resetBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Effacer tous les filtres");
        await resetBtn!.trigger("click");

        expect(searchStore.filterTitle).toBeUndefined();
    });

    it("logs out when 'Se déconnecter' is clicked", async () => {
        authComposableMocks.logout.mockResolvedValue(undefined);
        const wrapper = await mountAppBar();

        const logoutItem = wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.text().includes("Se déconnecter"));
        await logoutItem!.trigger("click");

        expect(authComposableMocks.logout).toHaveBeenCalled();
    });
});
