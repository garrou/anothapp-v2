// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Playlists from "./Playlists.vue";
import { vuetify } from "@/test/vuetify";
import type { Playlist, PlaylistInvitation } from "@/models/playlist";

const playlistComposableMocks = vi.hoisted(() => ({
    getPlaylists: vi.fn(),
    getPendingInvitations: vi.fn(),
    createPlaylist: vi.fn(),
    acceptCollaboratorInvite: vi.fn(),
    removeCollaborator: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
}));

vi.mock("@/composables/playlist", () => ({ usePlaylist: () => playlistComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const playlist = (id: string, name: string): Playlist => ({ id, name, visible: true } as Playlist);

const invitation = (playlistId: string, playlistName: string): PlaylistInvitation => ({
    playlistId, playlistName, invitedAt: "2026-01-01", ownerId: "user-2", ownerUsername: "bob",
});

const mountView = async (playlists: Playlist[] = [], invitations: PlaylistInvitation[] = []) => {
    playlistComposableMocks.getPlaylists.mockResolvedValue(playlists);
    playlistComposableMocks.getPendingInvitations.mockResolvedValue(invitations);
    userComposableMocks.getProfile.mockResolvedValue({ id: "user-1" });
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

    it("shows a collaborative badge only on playlists the user collaborates on", async () => {
        const wrapper = await mountView([
            { ...playlist("p1", "Mine"), role: "owner" },
            { ...playlist("p2", "Shared"), role: "collaborator" },
        ]);

        const icons = wrapper.findAllComponents({ name: "VIcon" });
        expect(icons.some((icon) => icon.props("icon") === "mdi-account-multiple")).toBe(true);
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

    describe("pending invitations", () => {
        it("stays discoverable even if the notification that announced it is gone", async () => {
            const wrapper = await mountView([], [invitation("p1", "Cosy")]);

            expect(wrapper.text()).toContain("Cosy");
            expect(wrapper.text()).toContain("bob");
        });

        it("shows nothing extra when there are no pending invitations", async () => {
            const wrapper = await mountView([]);

            expect(wrapper.findAllComponents({ name: "VListItem" })).toHaveLength(0);
        });

        it("accepts an invitation, removes it from the list, and refreshes the playlists", async () => {
            playlistComposableMocks.acceptCollaboratorInvite.mockResolvedValue(undefined);
            const wrapper = await mountView([], [invitation("p1", "Cosy")]);

            const acceptBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Accepter");
            await acceptBtn!.trigger("click");
            await flushPromises();

            expect(playlistComposableMocks.acceptCollaboratorInvite).toHaveBeenCalledWith("p1");
            expect(playlistComposableMocks.getPlaylists).toHaveBeenCalledTimes(2);
            expect(wrapper.text()).not.toContain("Cosy");
        });

        it("declines an invitation as itself and removes it from the list", async () => {
            playlistComposableMocks.removeCollaborator.mockResolvedValue(undefined);
            const wrapper = await mountView([], [invitation("p1", "Cosy")]);

            const declineBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Refuser");
            await declineBtn!.trigger("click");
            await flushPromises();

            expect(playlistComposableMocks.removeCollaborator).toHaveBeenCalledWith("p1", "user-1", "Invitation refusée");
            expect(wrapper.text()).not.toContain("Cosy");
        });

        it("shows an error toast when accepting fails", async () => {
            const error = new Error("Nope");
            playlistComposableMocks.acceptCollaboratorInvite.mockRejectedValue(error);
            const wrapper = await mountView([], [invitation("p1", "Cosy")]);

            const acceptBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Accepter");
            await acceptBtn!.trigger("click");
            await flushPromises();

            expect(snackbarMocks.showError).toHaveBeenCalledWith(error);
            expect(wrapper.text()).toContain("Cosy");
        });
    });
});
