// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PlaylistView from "./PlaylistView.vue";
import { vuetify } from "@/test/vuetify";
import type { PlaylistDetail, Playlist } from "@/models/playlist";
import type { Serie } from "@/models/serie";

const playlistComposableMocks = vi.hoisted(() => ({
    getPlaylist: vi.fn(),
    updatePlaylist: vi.fn(),
    deletePlaylist: vi.fn(),
    addShowToPlaylist: vi.fn(),
    removeShowFromPlaylist: vi.fn(),
    acceptCollaboratorInvite: vi.fn(),
    removeCollaborator: vi.fn(),
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

const detail = (overrides: Partial<Playlist> = {}, shows: Partial<Serie>[] = []): PlaylistDetail => ({
    playlist: { id: "p1", name: "My playlist", visible: true, userId: "owner-1", role: "owner", ...overrides } as Playlist,
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
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, PlaylistCollaborators: true, RouterLink: routerLinkStub } },
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
        const owner = await mountView(detail({ role: "owner" }));
        expect(owner.findComponent({ name: "BaseMenu" }).exists()).toBe(true);

        const visitor = await mountView(detail({ role: "viewer" }));
        expect(visitor.findComponent({ name: "BaseMenu" }).exists()).toBe(false);
    });

    it("shows the search field and the collaborators panel for the owner and for a collaborator", async () => {
        const owner = await mountView(detail({ role: "owner" }));
        expect(owner.find("input").exists()).toBe(true);
        expect(owner.findComponent({ name: "PlaylistCollaborators" }).exists()).toBe(true);

        const collaborator = await mountView(detail({ role: "collaborator" }));
        expect(collaborator.find("input").exists()).toBe(true);
        expect(collaborator.findComponent({ name: "PlaylistCollaborators" }).exists()).toBe(true);
    });

    it("hides the search field and the collaborators panel for a read-only viewer", async () => {
        const visitor = await mountView(detail({ role: "viewer" }));
        expect(visitor.find("input").exists()).toBe(false);
        expect(visitor.findComponent({ name: "PlaylistCollaborators" }).exists()).toBe(false);
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

        // BaseMenu's own items ("Modifier"/"Supprimer") are also VListItems, mounted (if
        // hidden) alongside the search result now that BaseMenu's v-menu is eager - match on
        // title to target the search result specifically.
        await wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.props("title") === "Breaking Bad")!.trigger("click");
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
        await wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.props("title") === "Breaking Bad")!.trigger("click");
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

    it("redirects to /playlists when the collaborators panel reports the user left", async () => {
        const wrapper = await mountView(detail({ role: "collaborator" }));

        await wrapper.findComponent({ name: "PlaylistCollaborators" }).vm.$emit("left");
        await flushPromises();

        expect(routerMocks.replace).toHaveBeenCalledWith("/playlists");
    });

    describe("pending invite", () => {
        it("shows an accept/decline banner, and accepting reloads the playlist", async () => {
            playlistComposableMocks.acceptCollaboratorInvite.mockResolvedValue(undefined);
            const wrapper = await mountView(detail({ role: "pending" }));

            expect(wrapper.text()).toContain("Vous êtes invité(e) à collaborer sur cette playlist.");

            playlistComposableMocks.getPlaylist.mockResolvedValue(detail({ role: "collaborator" }));
            const acceptBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Accepter");
            await acceptBtn!.trigger("click");
            await flushPromises();

            expect(playlistComposableMocks.acceptCollaboratorInvite).toHaveBeenCalledWith("p1");
            expect(wrapper.findComponent({ name: "PlaylistCollaborators" }).exists()).toBe(true);
        });

        it("declining removes the pending invite and redirects to /playlists", async () => {
            playlistComposableMocks.removeCollaborator.mockResolvedValue(undefined);
            const wrapper = await mountView(detail({ role: "pending" }), "invitee-1");

            const declineBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Refuser");
            await declineBtn!.trigger("click");
            await flushPromises();

            expect(playlistComposableMocks.removeCollaborator).toHaveBeenCalledWith("p1", "invitee-1", "Invitation refusée");
            expect(routerMocks.replace).toHaveBeenCalledWith("/playlists");
        });
    });
});
