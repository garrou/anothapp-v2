// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendCompare from "./FriendCompare.vue";
import { vuetify } from "@/test/vuetify";
import type { GlobalStat } from "@/models/stat";

const statisticComposableMocks = vi.hoisted(() => ({
    getStats: vi.fn(),
}));

vi.mock("@/composables/statistic", () => ({ useStatistic: () => statisticComposableMocks }));

const stat = (overrides: Partial<GlobalStat> = {}): GlobalStat => ({
    totalTime: 100,
    nbSeries: 5,
    nbSeasons: 10,
    nbEpisodes: 50,
    currentStreak: 2,
    ...overrides,
} as GlobalStat);

const mountCompare = async (mine: GlobalStat, theirs: GlobalStat, friendUsername = "Dexter") => {
    statisticComposableMocks.getStats.mockResolvedValue(mine);
    const wrapper = mount(FriendCompare, {
        global: { plugins: [vuetify] },
        props: { friendUsername, theirs: Promise.resolve(theirs) },
    });
    await flushPromises();
    return wrapper;
};

const openPanel = async (wrapper: Awaited<ReturnType<typeof mountCompare>>) => {
    await wrapper.find(".v-expansion-panel-title").trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendCompare", () => {
    it("renders nothing until both stats have loaded", () => {
        statisticComposableMocks.getStats.mockReturnValue(new Promise(() => {}));
        const wrapper = mount(FriendCompare, {
            global: { plugins: [vuetify] },
            props: { friendUsername: "Dexter", theirs: new Promise<GlobalStat>(() => {}) },
        });

        expect(wrapper.findComponent({ name: "VExpansionPanels" }).exists()).toBe(false);
    });

    it("shows the friend's username in the panel title", async () => {
        const wrapper = await mountCompare(stat(), stat(), "Dexter");

        expect(wrapper.text()).toContain("Comparatif avec Dexter");
    });

    it("shows a row per stat with both values formatted", async () => {
        const wrapper = await openPanel(await mountCompare(
            stat({ totalTime: 120, nbSeries: 5 }),
            stat({ totalTime: 90, nbSeries: 8 }),
        ));

        expect(wrapper.text()).toContain("2 h");
        expect(wrapper.text()).toContain("1 h 30");
    });

    it("highlights whichever side is ahead on a given stat", async () => {
        const wrapper = await openPanel(await mountCompare(
            stat({ nbSeries: 10 }),
            stat({ nbSeries: 3 }),
        ));

        const rows = wrapper.findAll(".compare-row");
        const seriesRow = rows.find((r) => r.text().includes("Séries"))!;
        const values = seriesRow.findAll(".compare-value");

        expect(values[0].classes()).toContain("compare-value--ahead");
        expect(values[1].classes()).not.toContain("compare-value--ahead");
    });

    it("highlights neither side when the values are equal", async () => {
        const wrapper = await openPanel(await mountCompare(
            stat({ currentStreak: 4 }),
            stat({ currentStreak: 4 }),
        ));

        const rows = wrapper.findAll(".compare-row");
        const streakRow = rows.find((r) => r.text().includes("Jours d'affilés"))!;
        streakRow.findAll(".compare-value").forEach((v) => expect(v.classes()).not.toContain("compare-value--ahead"));
    });
});
