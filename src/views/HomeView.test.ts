// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import HomeView from "./HomeView.vue";
import { vuetify } from "@/test/vuetify";

const searchComposableMocks = vi.hoisted(() => ({
    getImages: vi.fn(),
}));

vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));

const mountView = async (images: string[]) => {
    searchComposableMocks.getImages.mockResolvedValue(images);
    const wrapper = mount(HomeView, { global: { plugins: [vuetify] } });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("HomeView", () => {
    it("fetches up to 8 poster images on mount", async () => {
        await mountView([]);

        expect(searchComposableMocks.getImages).toHaveBeenCalledWith(8);
    });

    it("caps the poster collage at 6 images even when more are returned", async () => {
        const wrapper = await mountView(["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg"]);

        expect(wrapper.findAll(".poster-tile")).toHaveLength(6);
    });
});
