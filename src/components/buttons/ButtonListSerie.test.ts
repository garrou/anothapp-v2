// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ButtonListSerie from "./ButtonListSerie.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    addSerie: vi.fn(),
    deleteSerieInList: vi.fn(),
    getSerieFromCache: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));

const serie = { id: 1, title: "Breaking Bad" } as Serie;

const mountButton = async (props: Record<string, unknown> = {}) => {
    const wrapper = mount(ButtonListSerie, {
        global: { plugins: [vuetify] },
        props: { serie, ...props },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ButtonListSerie", () => {
    it("checks the watchlist cache on mount and shows the 'add' state when absent", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(undefined);

        const wrapper = await mountButton();

        expect(serieComposableMocks.getSerieFromCache).toHaveBeenCalledWith(1, { type: "userlist" });
        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Ajouter dans ma liste");
    });

    it("shows the 'remove' state when the serie is already in the watchlist", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(serie);

        const wrapper = await mountButton();

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Supprimer de ma liste");
    });

    it("adds to the list and emits refresh when not yet in the watchlist", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(undefined);
        const wrapper = await mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();

        expect(serieComposableMocks.addSerie).toHaveBeenCalledWith(1, true);
        expect(serieComposableMocks.deleteSerieInList).not.toHaveBeenCalled();
        expect(wrapper.emitted("refresh")).toHaveLength(1);
        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Supprimer de ma liste");
    });

    it("removes from the list when already present", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(serie);
        const wrapper = await mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();

        expect(serieComposableMocks.deleteSerieInList).toHaveBeenCalledWith(serie);
        expect(serieComposableMocks.addSerie).not.toHaveBeenCalled();
        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Ajouter dans ma liste");
    });

    it("renders as a menu item when menuItem is set", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(undefined);

        const wrapper = await mountButton({ menuItem: true });

        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(true);
    });
});
