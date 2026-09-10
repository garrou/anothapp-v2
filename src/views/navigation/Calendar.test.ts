// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Calendar from "./Calendar.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    getSeriesByStatus: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));

const serie = (id: number, nextEpisode?: string, overrides: Partial<Serie> = {}): Partial<Serie> =>
    ({ id, title: "Serie " + id, nextEpisode, ...overrides });

// The global RouterLink:true stub (see src/test/setup.ts) swallows its
// default slot entirely, hiding both the href and the serie title/kinds
// these tests assert on. Use a minimal real-ish stub instead for this file.
const routerLinkStub = {
    props: ["to"],
    template: "<a :href=\"to\"><slot /></a>",
};

const mountView = async (series: Partial<Serie>[]) => {
    serieComposableMocks.getSeriesByStatus.mockResolvedValue(series);
    const wrapper = mount(Calendar, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, RouterLink: routerLinkStub } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Calendar", () => {
    it("shows an empty state when no series have an upcoming episode", async () => {
        const wrapper = await mountView([serie(1, undefined)]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
    });

    it("groups series by their next-episode date, using a fixed (non-today) date deterministically", async () => {
        // 2024-06-15 is a Saturday, safely in the past relative to any real test run.
        const wrapper = await mountView([
            serie(1, "2024-06-15T10:00:00.000Z"),
            serie(2, "2024-06-15T22:00:00.000Z"),
        ]);

        const groups = wrapper.findAllComponents({ name: "DayBadge" });
        expect(groups).toHaveLength(1);
        expect(wrapper.text()).toContain("samedi 15 juin");
        expect(wrapper.text()).toContain("Serie 1");
        expect(wrapper.text()).toContain("Serie 2");
    });

    it("sorts groups chronologically by date", async () => {
        const wrapper = await mountView([
            serie(1, "2024-07-01T10:00:00.000Z"),
            serie(2, "2024-06-15T10:00:00.000Z"),
        ]);

        const badges = wrapper.findAllComponents({ name: "DayBadge" });
        expect(badges[0].props("day")).toBe(15);
        expect(badges[1].props("day")).toBe(1);
    });

    it("excludes series without a next episode from the groups", async () => {
        const wrapper = await mountView([
            serie(1, "2024-06-15T10:00:00.000Z"),
            serie(2, undefined),
        ]);

        expect(wrapper.text()).toContain("Serie 1");
        expect(wrapper.text()).not.toContain("Serie 2");
    });

    it("shows up to 2 kinds for a serie, joined, only when given", async () => {
        const wrapper = await mountView([
            serie(1, "2024-06-15T10:00:00.000Z", { kinds: ["Drame", "Thriller", "Policier"] }),
        ]);

        expect(wrapper.text()).toContain("Drame · Thriller");
        expect(wrapper.text()).not.toContain("Policier");
    });

    it("links each serie to its detail page", async () => {
        const wrapper = await mountView([serie(1, "2024-06-15T10:00:00.000Z")]);

        expect(wrapper.find(".upcoming-card").attributes("href")).toBe("/series/1");
    });
});
