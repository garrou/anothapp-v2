// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import WatchTogetherInvitesRow from "./WatchTogetherInvitesRow.vue";
import { vuetify } from "@/test/vuetify";
import type { WatchTogetherInvite } from "@/models/season";

const seasonComposableMocks = vi.hoisted(() => ({
    respondToWatchedWith: vi.fn(),
}));

vi.mock("@/composables/season", () => ({ useSeason: () => seasonComposableMocks }));

const invite = (userSeasonId: number): WatchTogetherInvite => ({
    userSeasonId, showId: 10, showTitle: "Dexter", showPoster: "poster.jpg", seasonNumber: 2,
    actor: { id: "user-2", username: "bob" },
});

const mountRow = (props: Record<string, unknown> = {}) => mount(WatchTogetherInvitesRow, {
    global: { plugins: [vuetify] },
    props,
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("WatchTogetherInvitesRow", () => {
    it("shows an empty state when there are no invitations", () => {
        const wrapper = mountRow({ invites: [] });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucune invitation");
        expect(wrapper.findComponent({ name: "CardGrid" }).exists()).toBe(false);
    });

    it("renders a card per invitation with the show and season", () => {
        const wrapper = mountRow({ invites: [invite(1), invite(2)] });

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(2);
        expect(wrapper.text()).toContain("Dexter");
        expect(wrapper.text()).toContain("Saison 2");
        expect(wrapper.text()).toContain("bob");
    });

    it("accepts an invitation and emits refresh", async () => {
        seasonComposableMocks.respondToWatchedWith.mockResolvedValue(undefined);
        const wrapper = mountRow({ invites: [invite(1)] });

        const buttons = wrapper.findAll(".friend-quick-btn");
        await buttons[0].trigger("click");
        await flushPromises();

        expect(seasonComposableMocks.respondToWatchedWith).toHaveBeenCalledWith(1, true);
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("declines an invitation and emits refresh", async () => {
        seasonComposableMocks.respondToWatchedWith.mockResolvedValue(undefined);
        const wrapper = mountRow({ invites: [invite(1)] });

        const buttons = wrapper.findAll(".friend-quick-btn");
        await buttons[1].trigger("click");
        await flushPromises();

        expect(seasonComposableMocks.respondToWatchedWith).toHaveBeenCalledWith(1, false);
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
