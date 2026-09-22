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

const invite = (userSeasonId: number, overrides: Partial<WatchTogetherInvite> = {}): WatchTogetherInvite => ({
    userSeasonId, showId: 10, showTitle: "Dexter", showPoster: "poster.jpg", seasonNumber: 2,
    actor: { id: "user-2", username: "bob" }, isOwner: false,
    ...overrides,
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

    it("does not make the card clickable for a pending invitation", () => {
        const wrapper = mountRow({ invites: [invite(1)] });

        expect(wrapper.findComponent({ name: "PosterCard" }).props("to")).toBeUndefined();
        expect(wrapper.findComponent({ name: "RouterLink" }).exists()).toBe(false);
    });

    it("links the card and title to the show's page when active is true", () => {
        const wrapper = mountRow({ invites: [invite(1)], active: true });

        // <router-link> never resolves to a real component here (no router installed in the
        // test), so its "to" only ever reaches the DOM as a plain attribute, never as a prop
        // vue-test-utils can introspect via .props() - hence .attributes() below.
        expect(wrapper.findComponent({ name: "PosterCard" }).props("to")).toBe("/series/10");
        const links = wrapper.findAllComponents({ name: "RouterLink" });
        expect(links).toHaveLength(2);
        links.forEach((link) => expect(link.attributes("to")).toBe("/series/10"));
    });

    it("shows an active-specific empty state when active is true", () => {
        const wrapper = mountRow({ invites: [], active: true });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Aucun visionnage partagé actif");
    });

    it("shows a single leave button per card when active is true", () => {
        const wrapper = mountRow({ invites: [invite(1), invite(2)], active: true });

        expect(wrapper.findAll(".friend-quick-btn")).toHaveLength(2);
    });

    it("shows no leave button for the owner's own shared viewings - they manage friends from the season instead", () => {
        const wrapper = mountRow({ invites: [invite(1, { isOwner: true }), invite(2)], active: true });

        expect(wrapper.findAll(".friend-quick-btn")).toHaveLength(1);
    });

    it("still links an owner's card to the show's page", () => {
        const wrapper = mountRow({ invites: [invite(1, { isOwner: true })], active: true });

        expect(wrapper.findComponent({ name: "PosterCard" }).props("to")).toBe("/series/10");
    });

    it("opens a confirm dialog without leaving yet when the leave button is clicked", async () => {
        const wrapper = mountRow({ invites: [invite(1)], active: true });

        await wrapper.find(".friend-quick-btn").trigger("click");

        expect(wrapper.findComponent({ name: "VDialog" }).exists()).toBe(true);
        expect(seasonComposableMocks.respondToWatchedWith).not.toHaveBeenCalled();
    });

    it("leaves an active watch-together link and emits refresh once confirmed", async () => {
        seasonComposableMocks.respondToWatchedWith.mockResolvedValue(undefined);
        const wrapper = mountRow({ invites: [invite(1)], active: true });

        await wrapper.find(".friend-quick-btn").trigger("click");
        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Confirmer");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(seasonComposableMocks.respondToWatchedWith).toHaveBeenCalledWith(1, false);
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("does not leave when the confirm dialog is cancelled", async () => {
        const wrapper = mountRow({ invites: [invite(1)], active: true });

        await wrapper.find(".friend-quick-btn").trigger("click");
        const cancelBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Annuler");
        await cancelBtn!.trigger("click");
        await flushPromises();

        expect(seasonComposableMocks.respondToWatchedWith).not.toHaveBeenCalled();
        expect(wrapper.emitted("refresh")).toBeUndefined();
    });
});
