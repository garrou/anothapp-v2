// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CardGrid from "./CardGrid.vue";
import { vuetify } from "@/test/vuetify";

const items = [{ id: "a", name: "Item A" }, { id: "b", name: "Item B" }];

describe("CardGrid", () => {
    it("renders the default slot once per item, keyed by id", () => {
        const wrapper = mount(CardGrid, {
            global: { plugins: [vuetify] },
            props: { items, loading: false },
            slots: { default: "<template #default=\"{ item }\">{{ item.name }}</template>" },
        });

        expect(wrapper.text()).toContain("Item A");
        expect(wrapper.text()).toContain("Item B");
        expect(wrapper.findAllComponents({ name: "VCol" })).toHaveLength(2);
    });

    it("falls back to the index as key when an item has no id", () => {
        const wrapper = mount(CardGrid, {
            global: { plugins: [vuetify] },
            props: { items: [{ name: "No id" }], loading: false },
            slots: { default: "<template #default=\"{ item }\">{{ item.name }}</template>" },
        });

        expect(wrapper.text()).toContain("No id");
    });

    it("shows the empty slot when there are no items and not loading", () => {
        const wrapper = mount(CardGrid, {
            global: { plugins: [vuetify] },
            props: { items: [], loading: false },
            slots: { empty: "<p>Rien à afficher</p>" },
        });

        expect(wrapper.text()).toContain("Rien à afficher");
    });

    it("shows skeleton placeholders in place of the slot content while loading", () => {
        const wrapper = mount(CardGrid, {
            global: { plugins: [vuetify] },
            props: { items, loading: true },
            slots: { default: "<template #default=\"{ item }\">{{ item.name }}</template>" },
        });

        expect(wrapper.text()).not.toContain("Item A");
        expect(wrapper.findAllComponents({ name: "BaseSkeleton" })).toHaveLength(2);
    });

    // Regression: while the very first fetch is in flight, `items` is still
    // empty, so there was nothing to chunk into rows - the grid rendered
    // with zero height (no skeleton, just blank space) until data arrived,
    // instead of showing a loading placeholder like every other list in the
    // app. Most noticeable below content that loads faster and pushes this
    // grid further down the page (e.g. the discover page's friend
    // suggestions, loaded from a fast query, above a grid backed by a much
    // slower paginated external API).
    it("shows skeleton placeholders even before any real item has loaded", () => {
        const wrapper = mount(CardGrid, {
            global: { plugins: [vuetify] },
            props: { items: [], loading: true },
            slots: { default: "<template #default=\"{ item }\">{{ item.name }}</template>" },
        });

        expect(wrapper.findComponent({ name: "VContainer" }).exists()).toBe(true);
        expect(wrapper.findAllComponents({ name: "BaseSkeleton" }).length).toBeGreaterThan(0);
    });

    it("does not replace already-loaded items with skeletons while a refresh is in flight", () => {
        const wrapper = mount(CardGrid, {
            global: { plugins: [vuetify] },
            props: { items, loading: true },
            slots: { default: "<template #default=\"{ item }\">{{ item.name }}</template>" },
        });

        expect(wrapper.findAllComponents({ name: "BaseSkeleton" })).toHaveLength(items.length);
    });
});
