// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BadgeMedallion from "./BadgeMedallion.vue";
import { vuetify } from "@/test/vuetify";
import type { Achievement } from "@/models/achievement";

const achievement = (overrides: Partial<Achievement> = {}): Achievement => ({
    code: "streak",
    name: "Série de visionnage",
    value: 0,
    league: null,
    subTier: null,
    nextLeague: 1,
    nextSubTier: 3,
    nextThreshold: 1,
    progress: 0,
    ...overrides,
});

const mountBadge = (props: Achievement) => mount(BadgeMedallion, {
    global: { plugins: [vuetify] },
    props: { achievement: props },
});

describe("BadgeMedallion", () => {
    it("shows a lock chip and 'Verrouillé' when no tier has been reached", () => {
        const wrapper = mountBadge(achievement());

        expect(wrapper.find(".badge-chip--roman").exists()).toBe(false);
        expect(wrapper.text()).toContain("Verrouillé");
    });

    it("shows the reached league's name and the sub-tier roman numeral once a tier is reached", () => {
        const wrapper = mountBadge(achievement({
            league: 3, subTier: 2, nextLeague: 3, nextSubTier: 1, nextThreshold: 60, progress: 0.5,
        }));

        expect(wrapper.find(".badge-chip--roman").text()).toBe("II");
        expect(wrapper.text()).toContain("Or");
        expect(wrapper.find(".badge-chip svg").exists()).toBe(false);
    });

    it("shows the achievement's name", () => {
        const wrapper = mountBadge(achievement({ name: "Marathonien" }));

        expect(wrapper.text()).toContain("Marathonien");
    });

    it("draws a full progress ring once the top league is reached", () => {
        const wrapper = mountBadge(achievement({
            league: 7, subTier: 1, nextLeague: null, nextSubTier: null, nextThreshold: null, progress: 1,
        }));

        const ring = wrapper.find(".ring-value");
        expect(ring.attributes("stroke-dashoffset")).toBe("0");
    });

    it("renders a distinct icon per achievement code", () => {
        const streak = mountBadge(achievement({ code: "streak" }));
        const watchTime = mountBadge(achievement({ code: "watch_time" }));

        expect(streak.find(".badge-icon").html()).not.toBe(watchTime.find(".badge-icon").html());
    });

    it("emits click when the badge is clicked", async () => {
        const wrapper = mountBadge(achievement());

        await wrapper.find(".badge").trigger("click");

        expect(wrapper.emitted("click")).toHaveLength(1);
    });
});
