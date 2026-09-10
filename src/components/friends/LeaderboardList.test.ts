// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import LeaderboardList from "./LeaderboardList.vue";
import { vuetify } from "@/test/vuetify";
import type { LeaderboardEntry } from "@/models/stat";

const statisticComposableMocks = vi.hoisted(() => ({
    getLeaderboard: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("@/composables/statistic", () => ({ useStatistic: () => statisticComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const mountLeaderboard = async (entries: Partial<LeaderboardEntry>[]) => {
    statisticComposableMocks.getLeaderboard.mockResolvedValue(entries);
    const wrapper = mount(LeaderboardList, { global: { plugins: [vuetify] } });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("LeaderboardList", () => {
    it("shows an empty state when there's 1 or fewer entries", async () => {
        const wrapper = await mountLeaderboard([{ id: "me", username: "Me", value: 120, isMe: true }]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "VList" }).exists()).toBe(false);
    });

    it("lists all entries when there's more than 1", async () => {
        const entries: Partial<LeaderboardEntry>[] = [
            { id: "me", username: "Me", value: 120, isMe: true },
            { id: "f1", username: "Friend", value: 90, isMe: false },
        ];
        const wrapper = await mountLeaderboard(entries);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
        expect(wrapper.findAllComponents({ name: "VListItem" })).toHaveLength(2);
    });

    it("marks the current user's entry and appends '(vous)'", async () => {
        const entries: Partial<LeaderboardEntry>[] = [
            { id: "me", username: "Me", value: 120, isMe: true },
            { id: "f1", username: "Friend", value: 90, isMe: false },
        ];
        const wrapper = await mountLeaderboard(entries);

        expect(wrapper.text()).toContain("Me (vous)");
    });

    it("navigates to a friend's page when their entry is clicked, but not for the current user", async () => {
        const entries: Partial<LeaderboardEntry>[] = [
            { id: "me", username: "Me", value: 120, isMe: true },
            { id: "f1", username: "Friend", value: 90, isMe: false },
        ];
        const wrapper = await mountLeaderboard(entries);
        const items = wrapper.findAllComponents({ name: "VListItem" });

        await items[0].trigger("click");
        expect(routerMocks.push).not.toHaveBeenCalled();

        await items[1].trigger("click");
        expect(routerMocks.push).toHaveBeenCalledWith("/friends/f1");
    });
});
