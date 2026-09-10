// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SeriesRow from "./SeriesRow.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const serie = (id: number): Partial<Serie> => ({ id, title: "Serie " + id });

interface RowProps {
    series: Partial<Serie>[];
    loading: boolean;
    total?: boolean;
    emptyTitle?: string;
    emptyCta?: boolean;
}

const mountRow = (props: RowProps) => mount(SeriesRow, {
    global: { plugins: [vuetify], stubs: { SerieCard: true } },
    props: { ...props, series: props.series as Serie[] },
});

describe("SeriesRow", () => {
    it("shows the total count only when total is set", () => {
        expect(mountRow({ series: [serie(1), serie(2)], loading: false, total: true }).text()).toContain("2 séries");
        expect(mountRow({ series: [serie(1)], loading: false, total: false }).text()).not.toContain("série");
    });

    it("renders a card per serie", () => {
        const wrapper = mountRow({ series: [serie(1), serie(2)], loading: false });

        expect(wrapper.findAllComponents({ name: "SerieCard" })).toHaveLength(2);
    });

    it("shows the card grid while loading even with no series yet", () => {
        const wrapper = mountRow({ series: [], loading: true });

        expect(wrapper.findComponent({ name: "CardGrid" }).exists()).toBe(true);
        expect(wrapper.findComponent({ name: "EmptyState" }).exists()).toBe(false);
    });

    it("shows an empty state when there are no series and not loading", () => {
        const wrapper = mountRow({ series: [], loading: false, emptyTitle: "Rien ici" });

        expect(wrapper.findComponent({ name: "EmptyState" }).props("title")).toBe("Rien ici");
    });

    it("shows a discover CTA in the empty state only when emptyCta is true", () => {
        expect(mountRow({ series: [], loading: false, emptyCta: true }).findComponent({ name: "EmptyState" }).findComponent({ name: "VBtn" }).exists()).toBe(true);
        expect(mountRow({ series: [], loading: false, emptyCta: false }).findComponent({ name: "EmptyState" }).findComponent({ name: "VBtn" }).exists()).toBe(false);
    });
});
