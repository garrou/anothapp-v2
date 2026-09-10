// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Wrapped from "./Wrapped.vue";
import { vuetify } from "@/test/vuetify";
import type { WrappedStat } from "@/models/stat";

const statisticComposableMocks = vi.hoisted(() => ({
    getWrapped: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showError: vi.fn(),
}));

vi.mock("@/composables/statistic", () => ({ useStatistic: () => statisticComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

// Stubs out WrappedShareCard.vue's own capture() (covered by its own test file)
// with a simple resolved data URL, matching the ref-exposed shape the view relies on.
const WrappedShareCardStub = {
    props: ["wrapped", "year"],
    template: "<div />",
    methods: {
        capture: () => Promise.resolve("data:image/png;base64,xyz"),
    },
};

const wrapped = (overrides: Partial<WrappedStat> = {}): WrappedStat => ({
    totalTime: 100,
    totalEpisodes: 50,
    nbNewShows: 3,
    ...overrides,
} as WrappedStat);

const mountView = async (resolved: WrappedStat) => {
    statisticComposableMocks.getWrapped.mockResolvedValue(resolved);
    const wrapper = mount(Wrapped, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, WrappedShareCard: WrappedShareCardStub } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Wrapped", () => {
    it("lists years from the current year down to 2000", async () => {
        const wrapper = await mountView(wrapped());
        const currentYear = new Date().getFullYear();

        const years = wrapper.findComponent({ name: "VSelect" }).props("items") as number[];
        expect(years[0]).toBe(currentYear);
        expect(years[years.length - 1]).toBe(2000);
        expect(years).toHaveLength(currentYear - 2000 + 1);
    });

    it("fetches wrapped stats for the current year on mount", async () => {
        await mountView(wrapped());

        expect(statisticComposableMocks.getWrapped).toHaveBeenCalledWith(new Date().getFullYear());
    });

    it("re-fetches when the selected year changes", async () => {
        const wrapper = await mountView(wrapped());

        await wrapper.findComponent({ name: "VSelect" }).vm.$emit("update:modelValue", 2022);
        await flushPromises();

        expect(statisticComposableMocks.getWrapped).toHaveBeenCalledWith(2022);
    });

    it("shows an empty state when there's no watch time for the year", async () => {
        const wrapper = await mountView(wrapped({ totalTime: 0 }));

        expect(wrapper.text()).toContain("Rien à afficher");
    });

    it("hides the share button when there's no watch time", async () => {
        const wrapper = await mountView(wrapped({ totalTime: 0 }));

        expect(wrapper.findAllComponents({ name: "VBtn" }).some((b) => b.props("icon") === "mdi-share-variant")).toBe(false);
    });

    it("shows a card per optional field only when it's present", async () => {
        const wrapper = await mountView(wrapped({ topShow: { label: "Breaking Bad" } } as Partial<WrappedStat>));

        expect(wrapper.text()).toContain("Breaking Bad");
        expect(wrapper.findAll(".wrapped-card")).toHaveLength(4); // hero + episodes + new shows + topShow
    });

    it("opens the share modal when the share button is clicked", async () => {
        const wrapper = await mountView(wrapped());

        const shareBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-share-variant");
        await shareBtn!.trigger("click");

        expect(wrapper.findComponent({ name: "BaseModal" }).props("modelValue")).toBe(true);
    });

    it("uses the Web Share API when available", async () => {
        const shareSpy = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
        Object.defineProperty(navigator, "share", { value: shareSpy, configurable: true });
        global.fetch = vi.fn().mockResolvedValue({ blob: () => Promise.resolve(new Blob()) });

        const wrapper = await mountView(wrapped());
        const shareBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-share-variant");
        await shareBtn!.trigger("click");

        const shareModalBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Partager");
        await shareModalBtn!.trigger("click");
        await flushPromises();

        expect(shareSpy).toHaveBeenCalled();
    });

    it("falls back to downloading when the Web Share API is unavailable", async () => {
        Object.defineProperty(navigator, "canShare", { value: undefined, configurable: true });
        global.fetch = vi.fn().mockResolvedValue({ blob: () => Promise.resolve(new Blob()) });
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

        const wrapper = await mountView(wrapped());
        const shareBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-share-variant");
        await shareBtn!.trigger("click");
        const shareModalBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Partager");
        await shareModalBtn!.trigger("click");
        await flushPromises();

        expect(clickSpy).toHaveBeenCalled();
        clickSpy.mockRestore();
    });

    it("does not show an error toast when sharing is aborted by the user", async () => {
        const abortError = new Error("Aborted");
        abortError.name = "AbortError";
        Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
        Object.defineProperty(navigator, "share", { value: vi.fn().mockRejectedValue(abortError), configurable: true });
        global.fetch = vi.fn().mockResolvedValue({ blob: () => Promise.resolve(new Blob()) });

        const wrapper = await mountView(wrapped());
        const shareBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-share-variant");
        await shareBtn!.trigger("click");
        const shareModalBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Partager");
        await shareModalBtn!.trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).not.toHaveBeenCalled();
    });

    it("shows an error toast when sharing fails for a real reason", async () => {
        Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
        Object.defineProperty(navigator, "share", { value: vi.fn().mockRejectedValue(new Error("Nope")), configurable: true });
        global.fetch = vi.fn().mockResolvedValue({ blob: () => Promise.resolve(new Blob()) });

        const wrapper = await mountView(wrapped());
        const shareBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-share-variant");
        await shareBtn!.trigger("click");
        const shareModalBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Partager");
        await shareModalBtn!.trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Impossible de partager l'image");
    });

    it("shows an error toast when the download fails", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Nope"));

        const wrapper = await mountView(wrapped());
        const shareBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.props("icon") === "mdi-share-variant");
        await shareBtn!.trigger("click");
        const downloadBtn = wrapper.findAllComponents({ name: "VBtn" }).find((b) => b.text() === "Télécharger");
        await downloadBtn!.trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Impossible de générer l'image");
    });
});
