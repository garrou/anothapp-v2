// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendView from "./FriendView.vue";
import { vuetify } from "@/test/vuetify";
import type { User } from "@/models/user";
import type { GlobalStat } from "@/models/stat";

const friendComposableMocks = vi.hoisted(() => ({
    getCachedFriends: vi.fn(),
}));
const statisticComposableMocks = vi.hoisted(() => ({
    getStats: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
}));

vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/statistic", () => ({ useStatistic: () => statisticComposableMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const friend = (id: string, username = "friend" + id): User => ({ id, username, current: false } as User);

const mountView = async (id: string, friends: User[]) => {
    friendComposableMocks.getCachedFriends.mockResolvedValue(friends);
    statisticComposableMocks.getStats.mockResolvedValue({ totalTime: 0 } as GlobalStat);
    const wrapper = mount(FriendView, {
        global: { plugins: [vuetify], stubs: { Dashboard: true, FriendCompare: true } },
        props: { id },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendView", () => {
    it("shows the friend found in the cached friends list", async () => {
        const wrapper = await mountView("f1", [friend("f1", "Dexter")]);

        expect(wrapper.text()).toContain("Dexter");
        expect(routerMocks.replace).not.toHaveBeenCalled();
    });

    it("redirects to /friends when the id doesn't match a cached friend", async () => {
        await mountView("unknown", [friend("f1")]);

        expect(routerMocks.replace).toHaveBeenCalledWith("/friends");
    });

    it("fetches the friend's stats and passes them down to FriendCompare and Dashboard", async () => {
        const wrapper = await mountView("f1", [friend("f1")]);

        expect(statisticComposableMocks.getStats).toHaveBeenCalledWith("f1");
        expect(wrapper.findComponent({ name: "FriendCompare" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "Dashboard" }).props("userId")).toBe("f1");
    });

    it("re-loads when the id prop changes", async () => {
        const wrapper = await mountView("f1", [friend("f1"), friend("f2", "Aaron")]);

        await wrapper.setProps({ id: "f2" });
        await flushPromises();

        expect(wrapper.text()).toContain("Aaron");
    });

    it("navigates back to /friends when the back button is clicked", async () => {
        const wrapper = await mountView("f1", [friend("f1")]);

        await wrapper.find(".back-btn").trigger("click");

        expect(routerMocks.push).toHaveBeenCalledWith("/friends");
    });
});
