// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendPlatforms from "./FriendPlatforms.vue";
import { vuetify } from "@/test/vuetify";
import type { Platform } from "@/models/serie";

const platformComposableMocks = vi.hoisted(() => ({
    getFriendPlatforms: vi.fn(),
}));
const searchComposableMocks = vi.hoisted(() => ({
    getPlatforms: vi.fn(),
}));

vi.mock("@/composables/platform", () => ({ usePlatform: () => platformComposableMocks }));
vi.mock("@/composables/search", () => ({ useSearch: () => searchComposableMocks }));

const ALL_PLATFORMS: Platform[] = [
    { id: 1, name: "Netflix" } as Platform,
    { id: 2, name: "Disney+" } as Platform,
    { id: 3, name: "Prime Video" } as Platform,
];

const mountFriendPlatforms = async (friendPlatformIds: number[], userId = "friend-1") => {
    searchComposableMocks.getPlatforms.mockResolvedValue(ALL_PLATFORMS);
    platformComposableMocks.getFriendPlatforms.mockResolvedValue(friendPlatformIds);
    const wrapper = mount(FriendPlatforms, {
        global: { plugins: [vuetify] },
        props: { userId },
    });
    await flushPromises();
    return wrapper;
};

const openPanel = async (wrapper: Awaited<ReturnType<typeof mountFriendPlatforms>>) => {
    await wrapper.find(".v-expansion-panel-title").trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendPlatforms", () => {
    it("fetches all platforms and the friend's platform ids for the given friend", async () => {
        await mountFriendPlatforms([1, 2], "friend-1");

        expect(searchComposableMocks.getPlatforms).toHaveBeenCalled();
        expect(platformComposableMocks.getFriendPlatforms).toHaveBeenCalledWith("friend-1");
    });

    it("only renders platform cards the friend actually uses", async () => {
        const wrapper = await openPanel(await mountFriendPlatforms([1, 3]));

        const cards = wrapper.findAllComponents({ name: "PlatformCard" });
        expect(cards).toHaveLength(2);
        expect(cards.map((c) => c.props("platform").id)).toEqual([1, 3]);
    });

    it("labels the panel with the count and singular/plural wording", async () => {
        const zero = await mountFriendPlatforms([]);
        expect(zero.text()).toContain("0 plateforme utilisée");

        const one = await mountFriendPlatforms([1]);
        expect(one.text()).toContain("1 plateforme utilisée");

        const many = await mountFriendPlatforms([1, 2]);
        expect(many.text()).toContain("2 plateformes utilisées");
    });
});
