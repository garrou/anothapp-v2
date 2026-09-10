// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import SeasonEpisodes from "./SeasonEpisodes.vue";
import { vuetify } from "@/test/vuetify";
import type { Episode } from "@/models/episode";

const searchComposableMocks = vi.hoisted(() => ({
    getEpisodes: vi.fn(),
}));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("SeasonEpisodes", () => {
    it("fetches episodes for the given serie id and season number", async () => {
        searchComposableMocks.getEpisodes.mockResolvedValue([]);
        mount(SeasonEpisodes, { global: { plugins: [vuetify] }, props: { id: 42, number: 2 } });
        await flushPromises();

        expect(searchComposableMocks.getEpisodes).toHaveBeenCalledWith(42, 2);
    });

    it("renders a panel per episode with its global number and title", async () => {
        const episodes: Partial<Episode>[] = [
            { id: 1, global: 1, title: "Pilot", code: "S01E01", date: "01/01/2020", description: "..." },
            { id: 2, global: 2, title: "Cat's in the Bag...", code: "S01E02", date: "01/01/2020", description: "..." },
        ];
        searchComposableMocks.getEpisodes.mockResolvedValue(episodes);
        const wrapper = mount(SeasonEpisodes, { global: { plugins: [vuetify] }, props: { id: 42, number: 2 } });
        await flushPromises();

        expect(wrapper.text()).toContain("#1");
        expect(wrapper.text()).toContain("Pilot");
        expect(wrapper.text()).toContain("#2");
        expect(wrapper.text()).toContain("Cat's in the Bag...");
    });
});
