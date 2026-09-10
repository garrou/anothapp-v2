// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FriendFavoriteActors from "./FriendFavoriteActors.vue";
import { vuetify } from "@/test/vuetify";
import type { FavoriteActor } from "@/models/person";

const actorComposableMocks = vi.hoisted(() => ({
    getFriendFavoriteActors: vi.fn(),
}));

vi.mock("@/composables/actor", () => ({ useActor: () => actorComposableMocks }));

const mountFriendFavoriteActors = async (actors: Partial<FavoriteActor>[], userId = "friend-1") => {
    actorComposableMocks.getFriendFavoriteActors.mockResolvedValue(actors);
    const wrapper = mount(FriendFavoriteActors, {
        global: { plugins: [vuetify] },
        props: { userId },
    });
    await flushPromises();
    return wrapper;
};

const openPanel = async (wrapper: Awaited<ReturnType<typeof mountFriendFavoriteActors>>) => {
    await wrapper.find(".v-expansion-panel-title").trigger("click");
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("FriendFavoriteActors", () => {
    it("fetches the friend's favorite actors on mount", async () => {
        await mountFriendFavoriteActors([{ id: 1, name: "Bryan Cranston" }], "friend-1");

        expect(actorComposableMocks.getFriendFavoriteActors).toHaveBeenCalledWith("friend-1");
    });

    it("renders nothing when the friend has no favorite actors", async () => {
        const wrapper = await mountFriendFavoriteActors([]);

        expect(wrapper.findComponent({ name: "VExpansionPanels" }).exists()).toBe(false);
    });

    it("renders a card per favorite actor", async () => {
        const actors = [{ id: 1, name: "Bryan Cranston" }, { id: 2, name: "Aaron Paul" }];
        const wrapper = await openPanel(await mountFriendFavoriteActors(actors));

        const cards = wrapper.findAllComponents({ name: "PosterCard" });
        expect(cards).toHaveLength(2);
        expect(cards.map((c) => c.props("to"))).toEqual(["/actor/1", "/actor/2"]);
    });

    it("labels the panel with the count and singular/plural wording", async () => {
        const one = await mountFriendFavoriteActors([{ id: 1, name: "Bryan Cranston" }]);
        expect(one.text()).toContain("1 acteur favori");

        const many = await mountFriendFavoriteActors([{ id: 1, name: "A" }, { id: 2, name: "B" }]);
        expect(many.text()).toContain("2 acteurs favoris");
    });
});
