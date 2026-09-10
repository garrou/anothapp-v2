// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ButtonAddToPlaylist from "./ButtonAddToPlaylist.vue";
import { vuetify } from "@/test/vuetify";

const playlistComposableMocks = vi.hoisted(() => ({
    getPlaylists: vi.fn(),
    addShowToPlaylist: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/composables/playlist", () => ({ usePlaylist: () => playlistComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const playlists = [
    { id: "p1", name: "Mes séries", visible: false },
    { id: "p2", name: "Animes", visible: true },
];

const mountButton = (props: Record<string, unknown> = {}) => mount(ButtonAddToPlaylist, {
    global: { plugins: [vuetify], stubs: { RouterLink: true } },
    props: { serieId: 1, ...props },
});

beforeEach(() => {
    vi.resetAllMocks();
    playlistComposableMocks.getPlaylists.mockResolvedValue(playlists);
});

describe("ButtonAddToPlaylist", () => {
    it("fetches the user's playlists only when the modal is opened", async () => {
        const wrapper = mountButton();

        expect(playlistComposableMocks.getPlaylists).not.toHaveBeenCalled();

        await wrapper.find("button").trigger("click");
        await flushPromises();

        expect(playlistComposableMocks.getPlaylists).toHaveBeenCalledTimes(1);
        expect(wrapper.text()).toContain("Mes séries");
        expect(wrapper.text()).toContain("Animes");
    });

    it("doesn't refetch on a second open", async () => {
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();
        await wrapper.find("button").trigger("click");
        await flushPromises();

        expect(playlistComposableMocks.getPlaylists).toHaveBeenCalledTimes(1);
    });

    it("shows an empty state with a link to /playlists when there are none", async () => {
        playlistComposableMocks.getPlaylists.mockResolvedValue([]);
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();

        expect(wrapper.text()).toContain("Vous n'avez pas encore de playlist");
    });

    it("adds the show to a playlist and marks it as added", async () => {
        playlistComposableMocks.addShowToPlaylist.mockResolvedValue(undefined);
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();

        const items = wrapper.findAllComponents({ name: "VListItem" });
        await items[0].trigger("click");
        await flushPromises();

        expect(playlistComposableMocks.addShowToPlaylist).toHaveBeenCalledWith("p1", 1);
        expect(items[0].props("disabled")).toBe(true);
    });

    it("shows an error toast when adding fails", async () => {
        playlistComposableMocks.addShowToPlaylist.mockRejectedValue(new Error("Requête invalide"));
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();
        await wrapper.findAllComponents({ name: "VListItem" })[0].trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalled();
    });

    it("renders as a menu item when menuItem is set", () => {
        const wrapper = mountButton({ menuItem: true });

        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(true);
    });
});
