// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Friends from "./Friends.vue";
import { vuetify } from "@/test/vuetify";
import type { FriendResponse } from "@/models/friend";
import type { User } from "@/models/user";

const friendComposableMocks = vi.hoisted(() => ({
    getFriends: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getUsers: vi.fn(),
}));

vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const user = (id: string, username = "user" + id): User => ({ id, username, current: false } as User);

const mountView = async (response: Omit<FriendResponse, "viewed">) => {
    friendComposableMocks.getFriends.mockResolvedValue({ viewed: [], ...response });
    const wrapper = mount(Friends, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, LeaderboardList: true } },
    });
    await flushPromises();
    return wrapper;
};

// The "Gérer" tab's own content (and its nested add/received/sent tabs) is
// lazy like every other VWindowItem: switch to it before it renders.
const openManageTab = async (wrapper: Awaited<ReturnType<typeof mountView>>) => {
    await wrapper.findComponent({ name: "PillTabs" }).vm.$emit("update:modelValue", 3);
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Friends", () => {
    it("fetches friends on mount", async () => {
        await mountView({ friends: [], sent: [], received: [] });

        expect(friendComposableMocks.getFriends).toHaveBeenCalled();
    });

    it("badges the 'Gérer' tab with the received count", async () => {
        const wrapper = await mountView({ friends: [], sent: [], received: [user("r1"), user("r2")] });

        const tabs = wrapper.findComponent({ name: "PillTabs" }).props("tabs") as { label: string; badge?: number }[];
        expect(tabs.find((t) => t.label === "Gérer")!.badge).toBe(2);
    });

    it("auto-switches to the 'received requests' management tab when there are pending requests", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [user("r1")] }));

        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1];
        expect(manageTabs.props("modelValue")).toBe(2);
    });

    it("stays on the 'add' management tab when there are no pending requests", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }));

        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1];
        expect(manageTabs.props("modelValue")).toBe(1);
    });

    it("computes existingIds as the union of friends, sent and received user ids", async () => {
        // received stays empty so the nested "add" tab (where existingIds is used)
        // remains the active one instead of auto-switching to "received".
        const wrapper = await openManageTab(await mountView({
            friends: [user("f1")],
            sent: [user("s1")],
            received: [],
        }));

        const addTab = wrapper.findAllComponents({ name: "FriendsRow" }).find((row) => row.props("addable"));
        expect(addTab!.props("existingIds")).toEqual(["f1", "s1"]);
    });

    it("searches users and passes the results to the add tab", async () => {
        userComposableMocks.getUsers.mockResolvedValue([user("u1")]);
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }));

        const addTab = wrapper.findAllComponents({ name: "FriendsRow" }).find((row) => row.props("addable"));
        await addTab!.vm.$emit("search", "dexter");
        await flushPromises();

        expect(userComposableMocks.getUsers).toHaveBeenCalledWith("dexter");
        const updatedAddTab = wrapper.findAllComponents({ name: "FriendsRow" }).find((row) => row.props("addable"));
        expect(updatedAddTab!.props("friends")).toEqual([user("u1")]);
    });

    it("re-fetches friends when a FriendsRow emits refresh", async () => {
        const wrapper = await mountView({ friends: [], sent: [], received: [] });

        await wrapper.findComponent({ name: "FriendsRow" }).vm.$emit("refresh");
        await flushPromises();

        expect(friendComposableMocks.getFriends).toHaveBeenCalledTimes(2);
    });
});
