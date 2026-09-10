// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ButtonFavoriteActor from "./ButtonFavoriteActor.vue";
import { useActorStore } from "@/stores/actor";
import { vuetify } from "@/test/vuetify";

const actorComposableMocks = vi.hoisted(() => ({
    addFavoriteActor: vi.fn(),
    loadFavoriteActorIds: vi.fn(),
    removeFavoriteActor: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/composables/actor", () => ({ useActor: () => actorComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));

const mountButton = (props: Record<string, unknown> = {}) => mount(ButtonFavoriteActor, {
    global: { plugins: [vuetify] },
    props: { actorId: 1, actorName: "Bryan Cranston", ...props },
});

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
    actorComposableMocks.loadFavoriteActorIds.mockResolvedValue(undefined);
});

describe("ButtonFavoriteActor", () => {
    it("loads favorite ids on mount", () => {
        mountButton();

        expect(actorComposableMocks.loadFavoriteActorIds).toHaveBeenCalled();
    });

    it("shows the 'add' state when the actor isn't a favorite", () => {
        const wrapper = mountButton();

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Ajouter aux favoris");
    });

    it("shows the 'remove' state when the actor is already a favorite", () => {
        useActorStore().setFavoriteActorIds([1]);

        const wrapper = mountButton();

        expect(wrapper.findComponent({ name: "VTooltip" }).props("text")).toBe("Supprimer des favoris");
    });

    it("adds the actor and emits change(true) when not a favorite", async () => {
        actorComposableMocks.addFavoriteActor.mockResolvedValue(undefined);
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");

        expect(actorComposableMocks.addFavoriteActor).toHaveBeenCalledWith(1, "Bryan Cranston");
        expect(wrapper.emitted("change")).toEqual([[true]]);
    });

    it("removes the actor and emits change(false) when already a favorite", async () => {
        useActorStore().setFavoriteActorIds([1]);
        actorComposableMocks.removeFavoriteActor.mockResolvedValue(undefined);
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");

        expect(actorComposableMocks.removeFavoriteActor).toHaveBeenCalledWith(1, "Bryan Cranston");
        expect(wrapper.emitted("change")).toEqual([[false]]);
    });

    it("shows an error toast and doesn't emit when the request fails", async () => {
        actorComposableMocks.addFavoriteActor.mockRejectedValue(new Error("Requête invalide"));
        const wrapper = mountButton();

        await wrapper.find("button").trigger("click");

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Requête invalide");
        expect(wrapper.emitted("change")).toBeUndefined();
    });
});
