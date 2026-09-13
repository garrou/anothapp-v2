// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PlaylistCollaborators from "./PlaylistCollaborators.vue";
import { vuetify } from "@/test/vuetify";
import type { PlaylistCollaborator } from "@/models/playlist";
import type { User } from "@/models/user";

const playlistComposableMocks = vi.hoisted(() => ({
    getCollaborators: vi.fn(),
    inviteCollaborator: vi.fn(),
    removeCollaborator: vi.fn(),
}));
const friendComposableMocks = vi.hoisted(() => ({
    getCachedFriends: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
}));

vi.mock("@/composables/playlist", () => ({ usePlaylist: () => playlistComposableMocks }));
vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const collaborator = (overrides: Partial<PlaylistCollaborator> = {}): PlaylistCollaborator => ({
    id: "user-2", username: "bob", accepted: true, invitedAt: "2024-01-01", ...overrides,
});

const friend = (overrides: Partial<User> = {}): User => ({
    id: "user-3", username: "alice", current: false, ...overrides,
});

const mountPanel = async (isOwner: boolean, collaborators: PlaylistCollaborator[] = [], friends: User[] = [], currentUserId = "user-1") => {
    playlistComposableMocks.getCollaborators.mockResolvedValue(collaborators);
    friendComposableMocks.getCachedFriends.mockResolvedValue(friends);
    userComposableMocks.getProfile.mockResolvedValue({ id: currentUserId });
    const wrapper = mount(PlaylistCollaborators, {
        global: { plugins: [vuetify] },
        props: { playlistId: "p1", isOwner },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("PlaylistCollaborators", () => {
    it("lists collaborators, marking pending invites", async () => {
        const wrapper = await mountPanel(true, [collaborator({ username: "bob", accepted: true }), collaborator({ id: "user-4", username: "carl", accepted: false })]);

        expect(wrapper.text()).toContain("bob");
        expect(wrapper.text()).toContain("carl");
        expect(wrapper.text()).toContain("Invitation en attente");
    });

    it("shows an empty message when there are no collaborators", async () => {
        const wrapper = await mountPanel(true, []);

        expect(wrapper.text()).toContain("Aucun collaborateur pour le moment");
    });

    it("shows the invite button and per-row remove buttons only for the owner", async () => {
        const owner = await mountPanel(true, [collaborator()]);
        expect(owner.findAllComponents({ name: "VBtn" }).some((btn) => btn.text() === "Inviter")).toBe(true);
        expect(owner.findComponent({ name: "VListItem" }).findComponent({ name: "VBtn" }).exists()).toBe(true);

        const member = await mountPanel(false, [collaborator()]);
        expect(member.findAllComponents({ name: "VBtn" }).some((btn) => btn.text() === "Inviter")).toBe(false);
        expect(member.findComponent({ name: "VListItem" }).findComponent({ name: "VBtn" }).exists()).toBe(false);
    });

    it("shows a leave button only for a non-owner", async () => {
        const owner = await mountPanel(true, [collaborator()]);
        expect(owner.findAllComponents({ name: "VBtn" }).some((btn) => btn.text().includes("Quitter"))).toBe(false);

        const member = await mountPanel(false, [collaborator()]);
        expect(member.findAllComponents({ name: "VBtn" }).some((btn) => btn.text().includes("Quitter"))).toBe(true);
    });

    it("excludes already-invited friends from the invite picker", async () => {
        const wrapper = await mountPanel(true, [collaborator({ id: "user-3" })], [friend({ id: "user-3", username: "alice" }), friend({ id: "user-4", username: "dan" })]);

        const inviteBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Inviter")!;
        await inviteBtn.trigger("click");

        const items = wrapper.findComponent({ name: "VAutocomplete" }).props("items") as User[];
        expect(items).toEqual([friend({ id: "user-4", username: "dan" })]);
    });

    it("invites the selected friend and refreshes the list", async () => {
        playlistComposableMocks.inviteCollaborator.mockResolvedValue(undefined);
        const wrapper = await mountPanel(true, [], [friend({ id: "user-3", username: "alice" })]);
        playlistComposableMocks.getCollaborators.mockResolvedValue([collaborator({ id: "user-3", username: "alice", accepted: false })]);

        const inviteBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Inviter")!;
        await inviteBtn.trigger("click");
        await wrapper.findComponent({ name: "VAutocomplete" }).vm.$emit("update:modelValue", "user-3");
        // two "Inviter" buttons exist once the dialog is open: the one that opened it, and the dialog's confirm button (last in DOM order)
        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).filter((btn) => btn.text() === "Inviter").at(-1)!;
        await confirmBtn.trigger("click");
        await flushPromises();

        expect(playlistComposableMocks.inviteCollaborator).toHaveBeenCalledWith("p1", "user-3", "alice");
        expect(playlistComposableMocks.getCollaborators).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain("alice");
    });

    it("removes a collaborator locally on owner confirmation", async () => {
        playlistComposableMocks.removeCollaborator.mockResolvedValue(undefined);
        const wrapper = await mountPanel(true, [collaborator({ id: "user-2", username: "bob" })]);

        const removeBtn = wrapper.findComponent({ name: "VListItem" }).findComponent({ name: "VBtn" });
        await removeBtn.trigger("click");
        const removeConfirm = wrapper.findAllComponents({ name: "BaseConfirm" }).find((c) => c.props("title") === "Retirer")!;
        await removeConfirm.vm.$emit("confirm");
        await flushPromises();

        expect(playlistComposableMocks.removeCollaborator).toHaveBeenCalledWith("p1", "user-2", "bob a été retiré de la playlist");
        expect(wrapper.text()).not.toContain("bob");
    });

    it("leaves the playlist as the current user and emits left", async () => {
        playlistComposableMocks.removeCollaborator.mockResolvedValue(undefined);
        const wrapper = await mountPanel(false, [], [], "user-1");

        const leaveBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text().includes("Quitter"))!;
        await leaveBtn.trigger("click");
        const leaveConfirm = wrapper.findAllComponents({ name: "BaseConfirm" }).find((c) => c.props("title") === "Quitter")!;
        await leaveConfirm.vm.$emit("confirm");
        await flushPromises();

        expect(playlistComposableMocks.removeCollaborator).toHaveBeenCalledWith("p1", "user-1", "Vous avez quitté la playlist");
        expect(wrapper.emitted("left")).toBeTruthy();
    });

    it("shows an error toast when an action fails", async () => {
        const error = new Error("boom");
        playlistComposableMocks.removeCollaborator.mockRejectedValue(error);
        const wrapper = await mountPanel(false, [], [], "user-1");

        const leaveBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text().includes("Quitter"))!;
        await leaveBtn.trigger("click");
        const leaveConfirm = wrapper.findAllComponents({ name: "BaseConfirm" }).find((c) => c.props("title") === "Quitter")!;
        await leaveConfirm.vm.$emit("confirm");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith(error);
        expect(wrapper.emitted("left")).toBeFalsy();
    });
});
