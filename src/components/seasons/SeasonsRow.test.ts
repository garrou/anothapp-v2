// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SeasonsRow from "./SeasonsRow.vue";
import { vuetify } from "@/test/vuetify";
import type { Season } from "@/models/season";

const season = (number: number): Season => ({ number, episodes: 10 } as Season);

const mountRow = (seasons: Season[], props: Record<string, unknown> = {}) => mount(SeasonsRow, {
    global: { plugins: [vuetify] },
    props: { seasons, loading: false, ...props },
});

describe("SeasonsRow", () => {
    it("renders a SeasonCard per season", () => {
        const wrapper = mountRow([season(1), season(2)]);

        expect(wrapper.findAllComponents({ name: "SeasonCard" })).toHaveLength(2);
    });

    it("re-sorts the seasons descending then ascending each time the order button is clicked", async () => {
        const seasons = [season(1), season(2), season(3)];
        const wrapper = mountRow(seasons);

        await wrapper.find(".v-btn").trigger("click");
        expect(seasons.map((s) => s.number)).toEqual([3, 2, 1]);

        await wrapper.find(".v-btn").trigger("click");
        expect(seasons.map((s) => s.number)).toEqual([1, 2, 3]);
    });

    it("forwards a season's show event as showSeason with the addable flag", async () => {
        const wrapper = mountRow([season(1)], { addable: true });

        await wrapper.findComponent({ name: "SeasonCard" }).vm.$emit("show", season(1));

        expect(wrapper.emitted("showSeason")).toEqual([[season(1), true]]);
    });

    it("shows an add button per season only when addable is true", () => {
        expect(mountRow([season(1)], { addable: true }).findAllComponents({ name: "SeasonCard" })[0].find("button.v-btn--variant-text").exists()).toBe(true);
        expect(mountRow([season(1)], { addable: false }).findAllComponents({ name: "SeasonCard" })[0].find("button.v-btn--variant-text").exists()).toBe(false);
    });

    it("emits addSeason when a season's add button is clicked", async () => {
        const wrapper = mountRow([season(1)], { addable: true });

        await wrapper.findAllComponents({ name: "SeasonCard" })[0].find("button.v-btn--variant-text").trigger("click");

        expect(wrapper.emitted("addSeason")).toEqual([[season(1)]]);
    });
});
