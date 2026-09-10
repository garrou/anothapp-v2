// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ActorsRow from "./ActorsRow.vue";
import { vuetify } from "@/test/vuetify";
import type { Character } from "@/models/person";

const character = (id: number, actor = "Bryan Cranston"): Character =>
    ({ id, actor, name: "Walter White", picture: "x.jpg" } as Character);

const mountRow = (characters: Character[], loading = false) => mount(ActorsRow, {
    global: { plugins: [vuetify], stubs: { ButtonFavoriteActor: true } },
    props: { characters, loading },
});

describe("ActorsRow", () => {
    it("shows an empty state when there are no characters", () => {
        const wrapper = mountRow([]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "CardGrid" }).exists()).toBe(false);
    });

    it("renders a card per character, linking to the actor's page", () => {
        const wrapper = mountRow([character(1), character(2, "Aaron Paul")]);

        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
        const cards = wrapper.findAllComponents({ name: "PosterCard" });
        expect(cards).toHaveLength(2);
        expect(cards.map((c) => c.props("to"))).toEqual(["/actor/1", "/actor/2"]);
        expect(wrapper.text()).toContain("Walter White");
    });
});
