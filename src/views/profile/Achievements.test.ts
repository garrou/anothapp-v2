// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Achievements from "./Achievements.vue";
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

const mountView = async (achievements: Achievement[]) => {
    achievementComposableMocks.getAchievements.mockResolvedValue(achievements);
    const wrapper = mount(Achievements, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Achievements", () => {
    it("shows a loading state before the achievements resolve", () => {
        achievementComposableMocks.getAchievements.mockReturnValue(new Promise(() => {}));
        const wrapper = mount(Achievements, { global: { plugins: [vuetify], stubs: { BaseAppBar: true } } });

        expect(wrapper.find(".achievements-loading").exists()).toBe(true);
    });

    it("renders one medallion per achievement", async () => {
        const wrapper = await mountView([
            achievement("streak", "Série de feu"),
            achievement("watch_time", "Marathonien"),
        ]);

        expect(wrapper.findAllComponents({ name: "BadgeMedallion" })).toHaveLength(2);
    });

    it("counts unlocked and locked achievements in the subtitle", async () => {
        const wrapper = await mountView([
            achievement("streak", "Série de feu", { league: 1, subTier: 3 }),
            achievement("watch_time", "Marathonien"),
            achievement("countries", "Cinéphile du monde"),
        ]);

        expect(wrapper.text()).toContain("1 succès débloqué");
        expect(wrapper.text()).toContain("2 verrouillés");
    });

    it("shows the 7 leagues in the legend", async () => {
        const wrapper = await mountView([]);

        expect(wrapper.findAll(".legend-item")).toHaveLength(7);
        expect(wrapper.text()).toContain("Bronze");
        expect(wrapper.text()).toContain("Titan");
    });
});
