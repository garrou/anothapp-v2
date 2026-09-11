// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import BadgesGrid from "./BadgesGrid.vue";
import { vuetify } from "@/test/vuetify";
import type { Achievement } from "@/models/achievement";

const achievementComposableMocks = vi.hoisted(() => ({
    getAchievements: vi.fn(),
    getTiers: vi.fn(),
}));

vi.mock("@/composables/achievement", () => ({ useAchievement: () => achievementComposableMocks }));

const achievement = (code: string, name: string, overrides: Partial<Achievement> = {}): Achievement => ({
    code, name, value: 0, league: null, subTier: null,
    nextLeague: 1, nextSubTier: 3, nextThreshold: 1, progress: 0,
    ...overrides,
});

const mountGrid = async (achievements: Achievement[], userId?: string, tiers: Record<string, unknown> = {}) => {
    achievementComposableMocks.getAchievements.mockResolvedValue(achievements);
    achievementComposableMocks.getTiers.mockResolvedValue(tiers);
    const wrapper = mount(BadgesGrid, { global: { plugins: [vuetify] }, props: { userId } });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("BadgesGrid", () => {
    it("shows a loading state before the achievements resolve", () => {
        achievementComposableMocks.getAchievements.mockReturnValue(new Promise(() => {}));
        achievementComposableMocks.getTiers.mockReturnValue(new Promise(() => {}));
        const wrapper = mount(BadgesGrid, { global: { plugins: [vuetify] } });

        expect(wrapper.find(".achievements-loading").exists()).toBe(true);
    });

    it("passes the userId through to the composable", async () => {
        await mountGrid([], "friend-1");

        expect(achievementComposableMocks.getAchievements).toHaveBeenCalledWith("friend-1");
    });

    it("renders one medallion per achievement", async () => {
        const wrapper = await mountGrid([
            achievement("streak", "Série de visionnage"),
            achievement("watch_time", "Marathonien"),
        ]);

        expect(wrapper.findAllComponents({ name: "BadgeMedallion" })).toHaveLength(2);
    });

    it("shows the 7 leagues in the legend", async () => {
        const wrapper = await mountGrid([]);

        expect(wrapper.findAll(".legend-item")).toHaveLength(7);
        expect(wrapper.text()).toContain("Bronze");
        expect(wrapper.text()).toContain("Titan");
    });

    it("shows an empty state when a friend has nothing unlocked yet", async () => {
        const wrapper = await mountGrid([], "friend-1");

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "BadgeMedallion" }).exists()).toBe(false);
    });

    it("opens the detail modal for the clicked achievement, with its tiers", async () => {
        const wrapper = await mountGrid([achievement("streak", "Série de visionnage")], undefined, {
            streak: [{ league: 1, subTier: 3, threshold: 1 }],
        });

        await wrapper.findComponent({ name: "BadgeMedallion" }).vm.$emit("click");
        await flushPromises();

        const modal = wrapper.findComponent({ name: "AchievementDetailModal" });
        expect(modal.props("achievement")?.code).toBe("streak");
        expect(modal.props("tiers")).toEqual([{ league: 1, subTier: 3, threshold: 1 }]);
    });

    it("does not fetch the tier catalog until a badge is clicked", async () => {
        await mountGrid([achievement("streak", "Assidu")]);

        expect(achievementComposableMocks.getTiers).not.toHaveBeenCalled();
    });

    it("only fetches the tier catalog once, even across multiple badge clicks", async () => {
        const wrapper = await mountGrid([
            achievement("streak", "Assidu"),
            achievement("watch_time", "Marathonien"),
        ], undefined, { streak: [], watch_time: [] });
        const medallions = wrapper.findAllComponents({ name: "BadgeMedallion" });

        await medallions[0].vm.$emit("click");
        await flushPromises();
        await medallions[1].vm.$emit("click");
        await flushPromises();

        expect(achievementComposableMocks.getTiers).toHaveBeenCalledTimes(1);
    });

    it("keeps achievements visible and shows an empty tier list if the lazy tiers fetch fails on click", async () => {
        achievementComposableMocks.getAchievements.mockResolvedValue([
            achievement("streak", "Assidu", { league: 1, subTier: 2 }),
        ]);
        achievementComposableMocks.getTiers.mockRejectedValue(new Error("boom"));
        const wrapper = mount(BadgesGrid, { global: { plugins: [vuetify] } });
        await flushPromises();

        await wrapper.findComponent({ name: "BadgeMedallion" }).vm.$emit("click");
        await flushPromises();

        expect(wrapper.findComponent({ name: "BadgeMedallion" }).exists()).toBe(true);
        const modal = wrapper.findComponent({ name: "AchievementDetailModal" });
        expect(modal.props("achievement")?.code).toBe("streak");
        expect(modal.props("tiers")).toEqual([]);
    });

    it("closes the detail modal", async () => {
        const wrapper = await mountGrid([achievement("streak", "Série de visionnage")]);
        await wrapper.findComponent({ name: "BadgeMedallion" }).vm.$emit("click");

        await wrapper.findComponent({ name: "AchievementDetailModal" }).vm.$emit("close");

        expect(wrapper.findComponent({ name: "AchievementDetailModal" }).props("achievement")).toBeNull();
    });
});
