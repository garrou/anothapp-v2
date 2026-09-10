// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ButtonFavoriteSerie from "./ButtonFavoriteSerie.vue";
import { vuetify } from "@/test/vuetify";

const serieComposableMocks = vi.hoisted(() => ({
    getSerieFromCache: vi.fn(),
    updateField: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const serie = { id: 1, title: "Breaking Bad", favorite: false };

const mountButton = async (props: Record<string, unknown> = {}) => {
    const wrapper = mount(ButtonFavoriteSerie, {
        global: { plugins: [vuetify] },
        props: { serieId: 1, ...props },
    });
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    vi.resetAllMocks();
    serieComposableMocks.getSerieFromCache.mockResolvedValue(serie);
});

describe("ButtonFavoriteSerie", () => {
    it("loads the serie from cache on mount and shows the 'add' state when not a favorite", async () => {
        const wrapper = await mountButton();

        expect(serieComposableMocks.getSerieFromCache).toHaveBeenCalledWith(1);
        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Ajouter aux favoris");
    });

    it("shows the 'remove' state when the cached serie is already a favorite", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue({ ...serie, favorite: true });

        const wrapper = await mountButton();

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Supprimer des favoris");
    });

    it("toggles favorite, shows a success toast, and emits refresh on click", async () => {
        serieComposableMocks.updateField.mockResolvedValue(true);
        const wrapper = await mountButton();

        await wrapper.find("button").trigger("click");
        await flushPromises();

        expect(serieComposableMocks.updateField).toHaveBeenCalledWith(serie, "favorite", "update");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('"Breaking Bad" ajoutée aux favoris');
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("renders as a menu item with the favorite class when menuItem is set and the serie is a favorite", async () => {
        serieComposableMocks.getSerieFromCache.mockResolvedValue({ ...serie, favorite: true });

        const wrapper = await mountButton({ menuItem: true });

        const item = wrapper.findComponent({ name: "VListItem" });
        expect(item.exists()).toBe(true);
        expect(item.classes()).toContain("text-red");
    });
});
