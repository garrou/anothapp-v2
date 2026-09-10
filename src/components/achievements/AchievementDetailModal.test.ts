// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AchievementDetailModal from "./AchievementDetailModal.vue";
import { vuetify } from "@/test/vuetify";
import type { Achievement, AchievementTier } from "@/models/achievement";

const achievement = (overrides: Partial<Achievement> = {}): Achievement => ({
    code: "streak",
    name: "Série de visionnage",
    value: 5,
    league: 1,
    subTier: 3,
    nextLeague: 1,
    nextSubTier: 2,
    nextThreshold: 3,
    progress: 0.5,
    ...overrides,
});

const tiers: AchievementTier[] = [
    { league: 1, subTier: 3, threshold: 1 },
    { league: 1, subTier: 2, threshold: 3 },
    { league: 1, subTier: 1, threshold: 7 },
];

const mountModal = (props: { achievement: Achievement | null, tiers: AchievementTier[] }) => mount(AchievementDetailModal, {
    global: { plugins: [vuetify] },
    props,
});

describe("AchievementDetailModal", () => {
    it("is closed when there is no selected achievement", () => {
        const wrapper = mountModal({ achievement: null, tiers: [] });

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(false);
    });

    it("shows the achievement's name, description and current value with its unit", () => {
        const wrapper = mountModal({ achievement: achievement(), tiers });

        expect(wrapper.text()).toContain("Série de visionnage");
        expect(wrapper.text()).toContain("Enchaînez les jours de suite");
        expect(wrapper.text()).toContain("5 jours");
    });

    it("rounds a non-whole value like watch_time's hours", () => {
        const wrapper = mountModal({ achievement: achievement({ code: "watch_time", value: 6410.566666666667 }), tiers });

        expect(wrapper.text()).toContain("6411 h");
    });

    it("renders one row per tier with its threshold", () => {
        const wrapper = mountModal({ achievement: achievement(), tiers });

        const rows = wrapper.findAll(".tier-row");
        expect(rows).toHaveLength(3);
        expect(rows[0].text()).toContain("1 jours");
        expect(rows[2].text()).toContain("7 jours");
    });

    it("marks tiers already crossed by the current value as reached", () => {
        const wrapper = mountModal({ achievement: achievement({ value: 5, league: 1, subTier: 2 }), tiers });

        const rows = wrapper.findAll(".tier-row");
        expect(rows[0].findComponent({ name: "VIcon" }).exists()).toBe(true);
        expect(rows[1].findComponent({ name: "VIcon" }).exists()).toBe(true);
        expect(rows[2].findComponent({ name: "VIcon" }).exists()).toBe(false);
    });

    it("highlights the currently reached tier", () => {
        const wrapper = mountModal({ achievement: achievement({ value: 5, league: 1, subTier: 2 }), tiers });

        const rows = wrapper.findAll(".tier-row");
        expect(rows[1].classes()).toContain("tier-row--current");
        expect(rows[0].classes()).not.toContain("tier-row--current");
    });

    it("emits close when the modal is dismissed", async () => {
        const wrapper = mountModal({ achievement: achievement(), tiers });

        await wrapper.findComponent({ name: "VDialog" }).vm.$emit("update:modelValue", false);

        expect(wrapper.emitted("close")).toHaveLength(1);
    });
});
