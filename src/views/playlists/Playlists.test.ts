// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Playlists from "./Playlists.vue";
import { vuetify } from "@/test/vuetify";
import type { Playlist } from "@/models/playlist";

const playlistComposableMocks = vi.hoisted(() => ({
    getPlaylists: vi.fn(),
    createPlaylist: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
}));

vi.mock("@/composables/playlist", () => ({ usePlaylist: () => playlistComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const playlist = (id: string, name: string): Playlist => ({ id, name, visible: true } as Playlist);

const mountView = async (playlists: Playlist[] = []) => {
    playlistComposableMocks.getPlaylists.mockResolvedValue(playlists);
    const wrapper = mount(Playlists, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Playlists", () => {
    it("fetches playlists on mount", async () => {
        await mountView();

        expect(playlistComposableMocks.getPlaylists).toHaveBeenCalled();
    });

    it("shows an empty state when there are no playlists", async () => {
        const wrapper = await mountView([]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
    });

    it("renders a card per playlist", async () => {
        const wrapper = await mountView([playlist("p1", "Comédies"), playlist("p2", "Drames")]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
        expect(wrapper.findAllComponents({ name: "PlaylistCover" })).toHaveLength(2);
    });

    it("opens the create-playlist modal when the button is clicked", async () => {
        const wrapper = await mountView();

        await wrapper.find("button").trigger("click");

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(true);
    });

    it("prepends the newly created playlist and closes the modal on save", async () => {
        const created = playlist("p3", "New");
        playlistComposableMocks.createPlaylist.mockResolvedValue(created);
        const wrapper = await mountView([playlist("p1", "Existing")]);

        await wrapper.findComponent({ name: "PlaylistFormModal" }).vm.$emit("save", "New", true);
        await flushPromises();

        expect(playlistComposableMocks.createPlaylist).toHaveBeenCalledWith("New", true);
        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(false);
        expect(wrapper.findAllComponents({ name: "PlaylistCover" })).toHaveLength(2);
    });

    it("shows an error toast and keeps the modal open when creation fails", async () => {
        const error = new Error("Nope");
        playlistComposableMocks.createPlaylist.mockRejectedValue(error);
        const wrapper = await mountView([]);
        await wrapper.find("button").trigger("click");

        await wrapper.findComponent({ name: "PlaylistFormModal" }).vm.$emit("save", "New", true);
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith(error);
        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(true);
    });

    it("closes the modal when it emits cancel", async () => {
        const wrapper = await mountView();
        await wrapper.find("button").trigger("click");

        await wrapper.findComponent({ name: "PlaylistFormModal" }).vm.$emit("cancel");

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(false);
    });
});
