// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FavoriteActors from "./FavoriteActors.vue";
import { vuetify } from "@/test/vuetify";
import type { FavoriteActor } from "@/models/person";

const actorComposableMocks = vi.hoisted(() => ({
    getFavoriteActors: vi.fn(),
}));

vi.mock("@/composables/actor", () => ({ useActor: () => actorComposableMocks }));

const mountView = async (actors: Partial<FavoriteActor>[]) => {
    actorComposableMocks.getFavoriteActors.mockResolvedValue(actors);
    const wrapper = mount(FavoriteActors, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true, ButtonFavoriteActor: true } },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FavoriteActors", () => {
    it("shows an empty state when there are no favorite actors", async () => {
        const wrapper = await mountView([]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "CardGrid" }).exists()).toBe(false);
    });

    it("renders a card per favorite actor", async () => {
        const wrapper = await mountView([{ id: 1, name: "Bryan Cranston" }, { id: 2, name: "Aaron Paul" }]);

        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(2);
        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
    });

    it("removes an actor from the list when its favorite button reports it's no longer favorited", async () => {
        const wrapper = await mountView([{ id: 1, name: "Bryan Cranston" }, { id: 2, name: "Aaron Paul" }]);

        await wrapper.findAllComponents({ name: "ButtonFavoriteActor" })[0].vm.$emit("change", false);

        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(1);
    });

    it("keeps an actor in the list when its favorite button reports it's still favorited", async () => {
        const wrapper = await mountView([{ id: 1, name: "Bryan Cranston" }]);

        await wrapper.findComponent({ name: "ButtonFavoriteActor" }).vm.$emit("change", true);

        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(1);
    });
});
