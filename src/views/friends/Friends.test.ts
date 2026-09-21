// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Friends from "./Friends.vue";
import { vuetify } from "@/test/vuetify";
import type { FriendResponse } from "@/models/friend";
import type { User } from "@/models/user";
import type { WatchTogetherInvite } from "@/models/season";

const friendComposableMocks = vi.hoisted(() => ({
    getFriends: vi.fn(),
}));
const userComposableMocks = vi.hoisted(() => ({
    getUsers: vi.fn(),
}));
const seasonComposableMocks = vi.hoisted(() => ({
    getWatchedWith: vi.fn(),
}));

vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/season", () => ({ useSeason: () => seasonComposableMocks }));
const routeMock = vi.hoisted(() => ({ query: {} as Record<string, string> }));

vi.mock("vue-router", () => ({ useRouter: () => ({ push: vi.fn() }), useRoute: () => routeMock }));

const user = (id: string, username = "user" + id): User => ({ id, username, current: false } as User);

const invite = (userSeasonId: number): WatchTogetherInvite => ({
    userSeasonId, showId: 10, showTitle: "Dexter", seasonNumber: 1, actor: { id: "user-2", username: "bob" },
});

const mountView = async (
    response: Omit<FriendResponse, "viewed">,
    invites: WatchTogetherInvite[] = [],
    active: WatchTogetherInvite[] = [],
) => {
    friendComposableMocks.getFriends.mockResolvedValue({ viewed: [], ...response });
    seasonComposableMocks.getWatchedWith.mockImplementation((status: string) =>
        Promise.resolve(status === "active" ? active : invites));
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
    routeMock.query = {};
});

describe("Friends", () => {
    it("fetches friends on mount", async () => {
        await mountView({ friends: [], sent: [], received: [] });

        expect(friendComposableMocks.getFriends).toHaveBeenCalled();
    });

    it("badges the 'Gérer' tab with the combined received requests and pending invites count", async () => {
        const wrapper = await mountView({ friends: [], sent: [], received: [user("r1"), user("r2")] }, [invite(1)]);

        const tabs = wrapper.findComponent({ name: "PillTabs" }).props("tabs") as { label: string; badge?: number }[];
        expect(tabs.find((t) => t.label === "Gérer")!.badge).toBe(3);
    });

    it("badges the nested 'Invitations' tab with the pending invites count", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }, [invite(1), invite(2)]));

        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1].props("tabs") as { label: string; badge?: number }[];
        expect(manageTabs.find((t) => t.label === "Invitations")!.badge).toBe(2);
    });

    it("auto-switches to the 'Invitations' management tab when there are pending invites but no received requests", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }, [invite(1)]));

        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1];
        expect(manageTabs.props("modelValue")).toBe(4);
    });

    it("prioritizes the 'received requests' tab over invitations when both are pending", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [user("r1")] }, [invite(1)]));

        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1];
        expect(manageTabs.props("modelValue")).toBe(2);
    });

    it("opens the exact tab given in the route query, overriding the auto-select heuristic", async () => {
        routeMock.query = { tab: "3", manageTab: "4" };
        const wrapper = await mountView({ friends: [], sent: [], received: [user("r1")] });

        const tabs = wrapper.findComponent({ name: "PillTabs" });
        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1];
        expect(tabs.props("modelValue")).toBe(3);
        expect(manageTabs.props("modelValue")).toBe(4);
    });

    it("re-fetches invitations when WatchTogetherInvitesRow emits refresh", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }, [invite(1)]));

        await wrapper.findComponent({ name: "WatchTogetherInvitesRow" }).vm.$emit("refresh");
        await flushPromises();

        expect(seasonComposableMocks.getWatchedWith.mock.calls.filter(([s]) => s === "pending")).toHaveLength(2);
    });

    it("passes the active watch-together links to the 'Actifs' tab, without a badge", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }, [], [invite(1), invite(2)]));

        const manageTabs = wrapper.findAllComponents({ name: "PillTabs" })[1].props("tabs") as { label: string; badge?: number }[];
        expect(manageTabs.find((t) => t.label === "Actifs")!.badge).toBeUndefined();
        const rows = wrapper.findAllComponents({ name: "WatchTogetherInvitesRow" });
        const activeRow = rows.find((row) => row.props("active"));
        expect(activeRow!.props("invites")).toHaveLength(2);
    });

    it("re-fetches active links when the 'Actifs' WatchTogetherInvitesRow emits refresh", async () => {
        const wrapper = await openManageTab(await mountView({ friends: [], sent: [], received: [] }, [], [invite(1)]));

        const rows = wrapper.findAllComponents({ name: "WatchTogetherInvitesRow" });
        const activeRow = rows.find((row) => row.props("active"));
        await activeRow!.vm.$emit("refresh");
        await flushPromises();

        expect(seasonComposableMocks.getWatchedWith.mock.calls.filter(([s]) => s === "active")).toHaveLength(2);
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
