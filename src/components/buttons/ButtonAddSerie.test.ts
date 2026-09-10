// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ButtonAddSerie from "./ButtonAddSerie.vue";
import { vuetify } from "@/test/vuetify";

const serieComposableMocks = vi.hoisted(() => ({
    addSerie: vi.fn(),
    getSerieFromCache: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));

const mountButton = async (props: Record<string, unknown> = {}) => {
    const wrapper = mount(ButtonAddSerie, {
        global: { plugins: [vuetify] },
        props: { serieId: 1, ...props },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ButtonAddSerie", () => {
    it("shows 'Déjà ajoutée' as a disabled button when primary and already added", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue({ id: 1 });

        const wrapper = await mountButton({ primary: true });

        expect(wrapper.text()).toContain("Déjà ajoutée");
        expect(wrapper.find("button").attributes("disabled")).toBeDefined();
    });

    it("shows 'Ajouter' as an active button when primary and not yet added", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(undefined);

        const wrapper = await mountButton({ primary: true });

        expect(wrapper.text()).toContain("Ajouter");
        expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
    });

    it("adds the serie on click when not primary and not already added", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(undefined);
        serieComposableMocks.addSerie.mockResolvedValue(undefined);
        const wrapper = await mountButton();

        await wrapper.find("button").trigger("click");

        expect(serieComposableMocks.addSerie).toHaveBeenCalledWith(1);
    });

    it("renders nothing when not primary and already added", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue({ id: 1 });

        const wrapper = await mountButton();

        expect(wrapper.find("button").exists()).toBe(false);
    });

    it("renders as a menu item when menuItem is set and not already added", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue(undefined);

        const wrapper = await mountButton({ menuItem: true });

        expect(wrapper.findComponent({ name: "VListItem" }).exists()).toBe(true);
    });
});
