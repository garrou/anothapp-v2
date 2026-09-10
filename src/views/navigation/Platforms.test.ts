// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Platforms from "./Platforms.vue";
import { vuetify } from "@/test/vuetify";
import type { Platform } from "@/models/serie";

const platformComposableMocks = vi.hoisted(() => ({
    getUserPlatforms: vi.fn(),
    updateUserPlatforms: vi.fn(),
    deleteUserPlatform: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getPlatforms: vi.fn(),
}));

vi.mock("@/composables/platform", () => ({ usePlatform: () => platformComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));

const platform = (id: number, logo?: string): Platform => ({ id, name: "Platform " + id, logo } as Platform);

const mountPlatforms = async (allPlatforms: Platform[], userPlatformIds: number[]) => {
    searchComposableMocks.getPlatforms.mockResolvedValue(allPlatforms);
    platformComposableMocks.getUserPlatforms.mockResolvedValue(userPlatformIds);
    const wrapper = mount(Platforms, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Platforms", () => {
    it("only shows platforms that have a logo", async () => {
        const wrapper = await mountPlatforms([platform(1, "l1.png"), platform(2)], []);

        expect(wrapper.findAllComponents({ name: "VCheckbox" })).toHaveLength(1);
    });

    it("pre-checks the user's already-selected platforms", async () => {
        const wrapper = await mountPlatforms([platform(1, "l1.png"), platform(2, "l2.png")], [1]);

        const checkboxes = wrapper.findAll('input[type="checkbox"]');
        expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true);
        expect((checkboxes[1].element as HTMLInputElement).checked).toBe(false);
    });

    it("adds a platform via updateUserPlatforms when it gets checked", async () => {
        platformComposableMocks.updateUserPlatforms.mockResolvedValue(undefined);
        const wrapper = await mountPlatforms([platform(1, "l1.png"), platform(2, "l2.png")], [1]);

        await wrapper.findAll('input[type="checkbox"]')[1].setValue(true);

        expect(platformComposableMocks.updateUserPlatforms).toHaveBeenCalledWith(2);
        expect(platformComposableMocks.deleteUserPlatform).not.toHaveBeenCalled();
    });

    it("removes a platform via deleteUserPlatform when it gets unchecked", async () => {
        platformComposableMocks.deleteUserPlatform.mockResolvedValue(undefined);
        const wrapper = await mountPlatforms([platform(1, "l1.png"), platform(2, "l2.png")], [1]);

        await wrapper.findAll('input[type="checkbox"]')[0].setValue(false);

        expect(platformComposableMocks.deleteUserPlatform).toHaveBeenCalledWith(1);
        expect(platformComposableMocks.updateUserPlatforms).not.toHaveBeenCalled();
    });
});
