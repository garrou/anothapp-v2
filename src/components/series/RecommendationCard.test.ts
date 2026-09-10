// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import RecommendationCard from "./RecommendationCard.vue";
import { vuetify } from "@/test/vuetify";
import type { Recommendation, RecommendationFriend } from "@/models/serie";

const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));

const friend = (id: string, extra: Partial<RecommendationFriend> = {}): RecommendationFriend =>
    ({ id, username: "friend" + id, picture: null, ...extra } as RecommendationFriend);

const mountCard = (recommendation: Partial<Recommendation>) => mount(RecommendationCard, {
    global: { plugins: [vuetify], stubs: { ButtonAddSerie: true } },
    props: { recommendation: recommendation as Recommendation },
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("RecommendationCard", () => {
    it("links to the discover page for the recommended serie", () => {
        const wrapper = mountCard({ id: 42, title: "X", friends: [], nbFriends: 0, avgNote: 0 });

        expect(wrapper.findComponent({ name: "PosterCard" }).props("to")).toBe("/discover/42");
    });

    it("shows an avatar per friend when there are 3 or fewer", () => {
        const friends = [friend("1"), friend("2")];
        const wrapper = mountCard({ id: 1, title: "X", friends, nbFriends: 2, avgNote: 4 });

        expect(wrapper.findAll(".friend-avatar")).toHaveLength(2);
    });

    it("caps visible friend avatars at 3 and shows a +N badge for the rest", () => {
        const friends = [friend("1"), friend("2"), friend("3"), friend("4"), friend("5")];
        const wrapper = mountCard({ id: 1, title: "X", friends, nbFriends: 5, avgNote: 4 });

        expect(wrapper.findAll(".friend-avatar")).toHaveLength(4);
        expect(wrapper.text()).toContain("+2");
    });

    it("shows the friend's initial when they have no picture", () => {
        const wrapper = mountCard({ id: 1, title: "X", friends: [friend("1", { username: "dexter" })], nbFriends: 1, avgNote: 4 });

        expect(wrapper.text()).toContain("D");
    });

    it("navigates to the friend's page when an avatar is clicked", async () => {
        const wrapper = mountCard({ id: 1, title: "X", friends: [friend("42")], nbFriends: 1, avgNote: 4 });

        await wrapper.find(".friend-avatar").trigger("click");

        expect(routerMocks.push).toHaveBeenCalledWith("/friends/42");
    });

    it("shows the friend count and rounded average note", () => {
        const wrapper = mountCard({ id: 1, title: "X", friends: [friend("1")], nbFriends: 1, avgNote: 3.6 });

        expect(wrapper.text()).toContain("Aimé par 1 ami");
        expect(wrapper.text()).toContain("4/5");
    });
});
