// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendRecommendations from "./FriendRecommendations.vue";
import { vuetify } from "@/test/vuetify";
import type { Recommendation } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    getRecommendations: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));

const mountFriendRecommendations = async (recommendations: Partial<Recommendation>[]) => {
    serieComposableMocks.getRecommendations.mockResolvedValue(recommendations);
    const wrapper = mount(FriendRecommendations, {
        global: { plugins: [vuetify], stubs: { RecommendationCard: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendRecommendations", () => {
    it("renders nothing when there are no recommendations", async () => {
        const wrapper = await mountFriendRecommendations([]);

        expect(wrapper.html()).toBe("<!--v-if-->");
    });

    it("renders a card per recommendation", async () => {
        const recommendations = [{ id: 1, title: "X" }, { id: 2, title: "Y" }];
        const wrapper = await mountFriendRecommendations(recommendations);

        expect(wrapper.findAllComponents({ name: "RecommendationCard" })).toHaveLength(2);
    });
});
