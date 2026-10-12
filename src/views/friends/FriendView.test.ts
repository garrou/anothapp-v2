// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendView from "./FriendView.vue";
import { vuetify } from "@/test/vuetify";
import type { User } from "@/models/user";
import type { GlobalStat } from "@/models/stat";
import { formatMonthYear } from "@/utils/date";

const friendComposableMocks = vi.hoisted(() => ({
    getCachedFriends: vi.fn(),
    getAutoAcceptWatchTogether: vi.fn(),
    setAutoAcceptWatchTogether: vi.fn(),
}));
const statisticComposableMocks = vi.hoisted(() => ({
    getStats: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
    showSuccess: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
}));

vi.mock("@/composables/friend", () => ({ useFriend: () => friendComposableMocks }));
vi.mock("@/composables/statistic", () => ({ useStatistic: () => statisticComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const friend = (id: string, username = "friend" + id): User => ({ id, username, current: false } as User);

const mountView = async (id: string, friends: User[], autoAccept = false) => {
    friendComposableMocks.getCachedFriends.mockResolvedValue(friends);
    friendComposableMocks.getAutoAcceptWatchTogether.mockResolvedValue(autoAccept);
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

    it("shows the friend's join date when they have a createdAt", async () => {
        const wrapper = await mountView("f1", [{ ...friend("f1", "Dexter"), createdAt: "2020-01-10T00:00:00.000Z" }]);

        expect(wrapper.text()).toContain(`Membre depuis ${formatMonthYear("2020-01-10T00:00:00.000Z")}`);
    });

    it("does not show a join date when the friend has no createdAt", async () => {
        const wrapper = await mountView("f1", [friend("f1")]);

        expect(wrapper.text()).not.toContain("Membre depuis");
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

        expect(routerMocks.replace).toHaveBeenCalledWith("/friends");
    });
});

describe("FriendView auto-accept toggle", () => {
    it("loads and shows the current auto-accept setting", async () => {
        const wrapper = await mountView("f1", [friend("f1")], true);

        expect(friendComposableMocks.getAutoAcceptWatchTogether).toHaveBeenCalledWith("f1");
        expect(wrapper.findComponent({ name: "VSwitch" }).props("modelValue")).toBe(true);
    });

    it("toggles it on and updates optimistically", async () => {
        friendComposableMocks.setAutoAcceptWatchTogether.mockResolvedValue(undefined);
        const theFriend = friend("f1", "Dexter");
        const wrapper = await mountView("f1", [theFriend]);

        await wrapper.findComponent({ name: "VSwitch" }).vm.$emit("update:modelValue", true);
        await flushPromises();

        expect(friendComposableMocks.setAutoAcceptWatchTogether).toHaveBeenCalledWith(theFriend, true);
        expect(wrapper.findComponent({ name: "VSwitch" }).props("modelValue")).toBe(true);
    });

    it("rolls back and shows an error when the update fails", async () => {
        friendComposableMocks.setAutoAcceptWatchTogether.mockRejectedValue(new Error("Vous n'êtes pas en relation avec cette personne"));
        const wrapper = await mountView("f1", [friend("f1")]);

        await wrapper.findComponent({ name: "VSwitch" }).vm.$emit("update:modelValue", true);
        await flushPromises();

        expect(wrapper.findComponent({ name: "VSwitch" }).props("modelValue")).toBe(false);
        expect(snackbarMocks.showError).toHaveBeenCalledWith("Vous n'êtes pas en relation avec cette personne");
    });

    // Regression test: loading the initial setting used to have no error handling at all, unlike
    // every other call in this file - a failure there left the switch stuck at its default with
    // no indication anything went wrong.
    it("shows an error when loading the initial setting fails, without blocking the rest of the page", async () => {
        friendComposableMocks.getCachedFriends.mockResolvedValue([friend("f1", "Dexter")]);
        friendComposableMocks.getAutoAcceptWatchTogether.mockRejectedValue(new Error("Erreur serveur"));
        statisticComposableMocks.getStats.mockResolvedValue({ totalTime: 0 } as GlobalStat);
        const wrapper = mount(FriendView, {
            global: { plugins: [vuetify], stubs: { Dashboard: true, FriendCompare: true } },
            props: { id: "f1" },
        });
        await flushPromises();

        expect(wrapper.text()).toContain("Dexter");
        expect(snackbarMocks.showError).toHaveBeenCalledWith("Erreur serveur");
        expect(wrapper.findComponent({ name: "VSwitch" }).props("modelValue")).toBe(false);
    });

    // Regression test: toggling used to have no guard against overlapping calls, so a slower,
    // stale request rejecting after a newer one already succeeded could roll the switch back to
    // the wrong value - same class of bug already fixed once for Settings.vue's toggles.
    it("ignores a stale rejection that resolves after a newer, already-successful toggle", async () => {
        let rejectStale: (e: Error) => void = () => {};
        const stale = new Promise<void>((_, reject) => { rejectStale = reject; });
        friendComposableMocks.setAutoAcceptWatchTogether.mockReturnValueOnce(stale);
        const wrapper = await mountView("f1", [friend("f1")], true);
        const sw = wrapper.findComponent({ name: "VSwitch" });

        // first toggle (off): slow, will reject later
        await sw.vm.$emit("update:modelValue", false);
        // second toggle (on): fast, succeeds immediately
        friendComposableMocks.setAutoAcceptWatchTogether.mockResolvedValueOnce(undefined);
        await sw.vm.$emit("update:modelValue", true);
        // third toggle (off): fast, succeeds immediately - the actual latest/correct state
        friendComposableMocks.setAutoAcceptWatchTogether.mockResolvedValueOnce(undefined);
        await sw.vm.$emit("update:modelValue", false);
        await flushPromises();

        // the first (stale) call now rejects, after the newer calls already resolved
        rejectStale(new Error("Erreur serveur"));
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Erreur serveur");
        // must stay at the latest toggle's value (off), not get yanked back to the first call's
        // pre-toggle value (on) by the stale rejection
        expect(wrapper.findComponent({ name: "VSwitch" }).props("modelValue")).toBe(false);
    });
});
