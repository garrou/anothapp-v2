// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ButtonWatchSerie from "./ButtonWatchSerie.vue";
import { vuetify } from "@/test/vuetify";
import type { Serie } from "@/models/serie";

const serieComposableMocks = vi.hoisted(() => ({
    updateField: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/composables/serie", () => ({ useSerie: () => serieComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const mountButton = (serie: Partial<Serie>, props: Record<string, unknown> = {}) => mount(ButtonWatchSerie, {
    global: { plugins: [vuetify] },
    props: { serie: serie as Serie, ...props },
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ButtonWatchSerie", () => {
    it("shows 'reprendre' when the serie isn't being watched", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", watch: false });

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Reprendre le visionnage");
    });

    it("shows 'arrêter' when the serie is being watched", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", watch: true });

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Arrêter le visionnage");
    });

    it("toggles watch state, shows the right toast, and emits refresh", async () => {
        serieComposableMocks.updateField.mockResolvedValue(true);
        const serie = { id: 1, title: "Breaking Bad", watch: false };
        const wrapper = mountButton(serie);

        await wrapper.find("button").trigger("click");

        expect(serieComposableMocks.updateField).toHaveBeenCalledWith(serie, "watch", "update");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('Visionnage en cours pour "Breaking Bad"');
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("shows the 'stopped' toast when updateField resolves false", async () => {
        serieComposableMocks.updateField.mockResolvedValue(false);
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", watch: true });

        await wrapper.find("button").trigger("click");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('Visionnage arrêté pour "Breaking Bad"');
    });

    it("renders as a primary button with prepend-icon text when primary is set", () => {
        const wrapper = mountButton({ id: 1, title: "Breaking Bad", watch: false }, { primary: true });

        expect(wrapper.find(".watch-btn--primary").text()).toContain("Reprendre le visionnage");
    });
});
