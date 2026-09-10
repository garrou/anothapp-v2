// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import BadgesGrid from "./BadgesGrid.vue";
import { vuetify } from "@/test/vuetify";
import type { Achievement } from "@/models/achievement";

const achievementComposableMocks = vi.hoisted(() => ({
    getAchievements: vi.fn(),
}));

vi.mock("@/composables/achievement", () => ({ useAchievement: () => achievementComposableMocks }));

const achievement = (code: string, name: string, overrides: Partial<Achievement> = {}): Achievement => ({
    code, name, value: 0, league: null, subTier: null,
    nextLeague: 1, nextSubTier: 3, nextThreshold: 1, progress: 0,
    ...overrides,
});

const mountGrid = async (achievements: Achievement[], userId?: string) => {
    achievementComposableMocks.getAchievements.mockResolvedValue(achievements);
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
        const wrapper = mount(BadgesGrid, { global: { plugins: [vuetify] } });

        expect(wrapper.find(".achievements-loading").exists()).toBe(true);
    });

    it("passes the userId through to the composable", async () => {
        await mountGrid([], "friend-1");

        expect(achievementComposableMocks.getAchievements).toHaveBeenCalledWith("friend-1");
    });

    it("renders one medallion per achievement", async () => {
        const wrapper = await mountGrid([
            achievement("streak", "Série de feu"),
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
});
