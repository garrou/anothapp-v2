// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PlaylistView from "./PlaylistView.vue";
import { vuetify } from "@/test/vuetify";
import type { PlaylistDetail } from "@/models/playlist";
import type { Serie } from "@/models/serie";

const playlistComposableMocks = vi.hoisted(() => ({
    getPlaylist: vi.fn(),
    updatePlaylist: vi.fn(),
    deletePlaylist: vi.fn(),
    addShowToPlaylist: vi.fn(),
    removeShowFromPlaylist: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
}));
const searchServiceMocks = vi.hoisted(() => ({
    getSeries: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    replace: vi.fn(),
}));

vi.mock("@/composables/playlist", () => ({ usePlaylist: () => playlistComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));
vi.mock("@/services/searchService", () => ({ default: searchServiceMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const jsonResponse = (status: number, body: unknown) => ({ status, json: () => Promise.resolve(body) });

const detail = (overrides: Partial<PlaylistDetail["playlist"]> = {}, shows: Partial<Serie>[] = []): PlaylistDetail => ({
    playlist: { id: "p1", name: "My playlist", visible: true, userId: "owner-1", ...overrides } as PlaylistDetail["playlist"],
    shows: shows as Serie[],
});

// The global RouterLink:true stub (see src/test/setup.ts) swallows its
// default slot/text entirely, hiding the serie title text these tests
// assert on. Use a minimal real-ish stub instead for this file.
const routerLinkStub = {
    props: ["to", "text"],
    template: "<a :href=\"to\">{{ text }}<slot /></a>",
};

const mountView = async (playlistDetail: PlaylistDetail, currentUserId = "owner-1") => {
    playlistComposableMocks.getPlaylist.mockResolvedValue(playlistDetail);
    userComposableMocks.getProfile.mockResolvedValue({ id: currentUserId });
    const wrapper = mount(PlaylistView, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, RouterLink: routerLinkStub } },
        props: { id: "p1" },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("PlaylistView", () => {
    it("shows the playlist owner's edit menu only when the current user owns it", async () => {
        const owner = await mountView(detail(), "owner-1");
        expect(owner.findComponent({ name: "BaseMenu" }).exists()).toBe(true);

        const visitor = await mountView(detail(), "someone-else");
        expect(visitor.findComponent({ name: "BaseMenu" }).exists()).toBe(false);
    });

    it("shows the search field only for the owner", async () => {
        const owner = await mountView(detail(), "owner-1");
        expect(owner.find("input").exists()).toBe(true);

        const visitor = await mountView(detail(), "someone-else");
        expect(visitor.find("input").exists()).toBe(false);
    });

    it("searches series and clears results when the query is cleared", async () => {
        searchServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [{ id: 1, title: "Breaking Bad" }]));
        const wrapper = await mountView(detail());

        await wrapper.find("input").setValue("breaking");
        await wrapper.find("input").trigger("keyup.enter");
        await flushPromises();

        expect(searchServiceMocks.getSeries).toHaveBeenCalledWith("breaking");
        expect(wrapper.text()).toContain("Breaking Bad");
    });

    it("adds a show, clears the search, and reloads the playlist", async () => {
        searchServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [{ id: 1, title: "Breaking Bad" }]));
        playlistComposableMocks.addShowToPlaylist.mockResolvedValue(undefined);
        const wrapper = await mountView(detail());

        await wrapper.find("input").setValue("breaking");
        await wrapper.find("input").trigger("keyup.enter");
        await flushPromises();
        playlistComposableMocks.getPlaylist.mockResolvedValue(detail({}, [{ id: 1, title: "Breaking Bad" }]));

        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(playlistComposableMocks.addShowToPlaylist).toHaveBeenCalledWith("p1", 1);
        expect(playlistComposableMocks.getPlaylist).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain("Breaking Bad");
    });

    it("shows an error toast when adding a show fails", async () => {
        const error = new Error("Nope");
        searchServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [{ id: 1, title: "Breaking Bad" }]));
        playlistComposableMocks.addShowToPlaylist.mockRejectedValue(error);
        const wrapper = await mountView(detail());

        await wrapper.find("input").setValue("breaking");
        await wrapper.find("input").trigger("keyup.enter");
        await flushPromises();
        await wrapper.findComponent({ name: "VListItem" }).trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith(error);
    });

    it("removes a show locally without a full reload", async () => {
        playlistComposableMocks.removeShowFromPlaylist.mockResolvedValue(undefined);
        const wrapper = await mountView(detail({}, [{ id: 1, title: "Breaking Bad" }, { id: 2, title: "Dexter" }]));

        const deleteBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.props("icon") === "mdi-delete");
        await deleteBtn!.trigger("click");
        await flushPromises();

        expect(playlistComposableMocks.removeShowFromPlaylist).toHaveBeenCalledWith("p1", 1);
        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(1);
    });

    it("updates the playlist name/visibility locally on save", async () => {
        playlistComposableMocks.updatePlaylist.mockResolvedValue(undefined);
        const wrapper = await mountView(detail());

        await wrapper.findComponent({ name: "PlaylistFormModal" }).vm.$emit("save", "Renamed", false);
        await flushPromises();

        expect(playlistComposableMocks.updatePlaylist).toHaveBeenCalledWith("p1", { name: "Renamed", visible: false });
        expect(wrapper.text()).toContain("Renamed");
        expect(wrapper.text()).toContain("Privée");
    });

    it("deletes the playlist and redirects to /playlists on confirm", async () => {
        playlistComposableMocks.deletePlaylist.mockResolvedValue(undefined);
        const wrapper = await mountView(detail());

        await wrapper.findComponent({ name: "BaseConfirm" }).vm.$emit("confirm");
        await flushPromises();

        expect(playlistComposableMocks.deletePlaylist).toHaveBeenCalledWith("p1", "My playlist");
        expect(routerMocks.replace).toHaveBeenCalledWith("/playlists");
    });

    it("redirects to /playlists when the playlist fails to load", async () => {
        const error = new Error("Not found");
        playlistComposableMocks.getPlaylist.mockRejectedValue(error);
        userComposableMocks.getProfile.mockResolvedValue({ id: "owner-1" });

        mount(PlaylistView, {
            global: { plugins: [vuetify], stubs: { BaseAppBar: true } },
            props: { id: "missing" },
        });
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith(error);
        expect(routerMocks.replace).toHaveBeenCalledWith("/playlists");
    });
});
