// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendsRow from "./FriendsRow.vue";
import { vuetify } from "@/test/vuetify";
import type { User } from "@/models/user";

const friendComposableMocks = vi.hoisted(() => ({
    acceptFriendRequest: vi.fn(),
    deleteFriend: vi.fn(),
    sendFriendRequest: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const user = (id: string, username = "friend" + id): User =>
    ({ id, username, current: false } as User);

const mountRow = (props: Record<string, unknown> = {}) => mount(FriendsRow, {
    global: { plugins: [vuetify] },
    props,
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendsRow", () => {
    it("shows the search field and emits search with the entered username", async () => {
        const wrapper = mountRow({ search: true, friends: [] });

        await wrapper.find("input").setValue("dexter");
        await wrapper.find("form").trigger("submit");

        expect(wrapper.emitted("search")).toContainEqual(["dexter"]);
    });

    it("hides the search field when search is false", () => {
        const wrapper = mountRow({ friends: [] });

        expect(wrapper.find("form").exists()).toBe(false);
    });

    it("shows a default empty state when there are no friends", () => {
        const wrapper = mountRow({ friends: [] });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucun ami pour l'instant");
        expect(wrapper.findComponent({ name: "CardGrid" }).exists()).toBe(false);
    });

    it("shows an addable-specific empty state when addable is true", () => {
        const wrapper = mountRow({ friends: [], addable: true });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucun résultat");
    });

    it("shows an accept-specific empty state when accept is true", () => {
        const wrapper = mountRow({ friends: [], accept: true });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucune demande reçue");
    });

    it("shows a consult-specific empty state when consult is true and remove is false", () => {
        const wrapper = mountRow({ friends: [], consult: true });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucun ami ne regarde cette série");
    });

    it("shows a sent-requests empty state when remove is true without consult", () => {
        const wrapper = mountRow({ friends: [], remove: true });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucune demande envoyée");
    });

    it("renders a card per friend and hides the empty state", () => {
        const wrapper = mountRow({ friends: [user("1"), user("2")] });

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(2);
    });

    it("navigates to the friend's page when the details quick action is clicked (consult)", async () => {
        const wrapper = mountRow({ friends: [user("42")], consult: true });

        await wrapper.find(".friend-quick-btn").trigger("click");

        expect(routerMocks.push).toHaveBeenCalledWith("/friends/42");
    });

    it("sends a friend request, emits refresh, and disables the button once sent (addable)", async () => {
        friendComposableMocks.sendFriendRequest.mockResolvedValue(undefined);
        const wrapper = mountRow({ friends: [user("1")], addable: true });

        await wrapper.find(".friend-quick-btn").trigger("click");
        await flushPromises();

        expect(friendComposableMocks.sendFriendRequest).toHaveBeenCalledWith(user("1"));
        expect(wrapper.emitted("refresh")).toHaveLength(1);
        expect(wrapper.find(".friend-quick-btn").attributes("disabled")).toBeDefined();
    });

    it("treats a friend already in existingIds as already sent (addable)", () => {
        const wrapper = mountRow({ friends: [user("1")], addable: true, existingIds: ["1"] });

        expect(wrapper.find(".friend-quick-btn").attributes("disabled")).toBeDefined();
    });

    it("accepts a friend request and emits refresh (accept)", async () => {
        friendComposableMocks.acceptFriendRequest.mockResolvedValue(undefined);
        const wrapper = mountRow({ friends: [user("1")], accept: true });

        await wrapper.find(".friend-quick-btn").trigger("click");
        await flushPromises();

        expect(friendComposableMocks.acceptFriendRequest).toHaveBeenCalledWith(user("1"));
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("opens a confirm dialog then deletes the friend with the right context and emits refresh (remove)", async () => {
        friendComposableMocks.deleteFriend.mockResolvedValue(undefined);
        const wrapper = mountRow({ friends: [user("1")], remove: true, consult: true });

        const buttons = wrapper.findAll(".friend-quick-btn");
        await buttons[buttons.length - 1].trigger("click");
        expect(wrapper.findComponent({ name: "VDialog" }).exists()).toBe(true);

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Confirmer");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(friendComposableMocks.deleteFriend).toHaveBeenCalledWith(user("1"), "friend");
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
