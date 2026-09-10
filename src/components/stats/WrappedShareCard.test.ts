// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import WrappedShareCard from "./WrappedShareCard.vue";
import { vuetify } from "@/test/vuetify";
import type { WrappedStat } from "@/models/stat";

const htmlToImageMocks = vi.hoisted(() => ({
    toPng: vi.fn(),
}));

vi.mock("html-to-image", () => htmlToImageMocks);

const wrapped = (overrides: Partial<WrappedStat> = {}): WrappedStat => ({
    totalTime: 120,
    totalEpisodes: 50,
    nbNewShows: 3,
    ...overrides,
} as WrappedStat);

const mountCard = (wrappedStat: WrappedStat, year = 2024) => mount(WrappedShareCard, {
    global: { plugins: [vuetify] },
    props: { wrapped: wrappedStat, year },
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("WrappedShareCard", () => {
    it("shows the year, total time, episode count and new-shows count", () => {
        const wrapper = mountCard(wrapped({ totalTime: 125, totalEpisodes: 42, nbNewShows: 3 }), 2024);

        expect(wrapper.text()).toContain("2024");
        expect(wrapper.text()).toContain("2 h 5");
        expect(wrapper.text()).toContain("42");
        expect(wrapper.text()).toContain("nouvelles séries");
    });

    it("uses the singular form for a single new show", () => {
        const wrapper = mountCard(wrapped({ nbNewShows: 1 }));

        expect(wrapper.text()).toContain("nouvelle série");
        expect(wrapper.text()).not.toContain("nouvelles séries");
    });

    it("shows only the highlights that are present", () => {
        const wrapper = mountCard(wrapped({ topShow: { label: "Breaking Bad" } } as Partial<WrappedStat>));

        expect(wrapper.findAll(".share-card-highlight")).toHaveLength(1);
        expect(wrapper.text()).toContain("Breaking Bad");
    });

    it("shows every highlight when all are present", () => {
        const wrapper = mountCard(wrapped({
            topShow: { label: "Breaking Bad" },
            topKind: { label: "Drame" },
            topPlatform: { label: "Netflix" },
            topWatchedWithFriend: { label: "Dexter" },
            bestMonth: { label: " Mars " },
            bestStreak: 12,
        } as Partial<WrappedStat>));

        const highlights = wrapper.findAll(".share-card-highlight");
        expect(highlights).toHaveLength(6);
        expect(wrapper.text()).toContain("Mars");
        expect(wrapper.text()).toContain("12");
    });

    it("captures the card as a PNG via the exposed capture() method", async () => {
        htmlToImageMocks.toPng.mockResolvedValue("data:image/png;base64,xyz");
        const wrapper = mountCard(wrapped());

        const result = await (wrapper.vm as unknown as { capture: () => Promise<string> }).capture();

        expect(htmlToImageMocks.toPng).toHaveBeenCalledWith(wrapper.find(".share-card").element, { pixelRatio: 3, skipFonts: true });
        expect(result).toBe("data:image/png;base64,xyz");
    });
});
