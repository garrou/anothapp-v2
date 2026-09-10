// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Settings from "./Settings.vue";
import { vuetify } from "@/test/vuetify";
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK } from "@/utils/theme";

const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
    updateEpisodeTracking: vi.fn(),
}));
const settingsComposableMocks = vi.hoisted(() => ({
    exportData: vi.fn(),
}));
const storageServiceMocks = vi.hoisted(() => ({
    storeTheme: vi.fn(),
    getTheme: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/settings", () => ({ useSettings: () => settingsComposableMocks }));
vi.mock("@/services/storageService", () => ({ default: storageServiceMocks }));

const mountView = async (episodeTrackingEnabled = false) => {
    userComposableMocks.getProfile.mockResolvedValue({ episodeTrackingEnabled });
    const wrapper = mount(Settings, {
        global: { plugins: [vuetify], stubs: { BaseAppBar: true } },
    });
    await flushPromises();
    return wrapper;
};

const switches = (wrapper: Awaited<ReturnType<typeof mountView>>) => wrapper.findAll('input[type="checkbox"]');

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Settings", () => {
    it("pre-fills the episode-tracking switch from the profile", async () => {
        const enabled = await mountView(true);
        expect((switches(enabled)[1].element as HTMLInputElement).checked).toBe(true);

        const disabled = await mountView(false);
        expect((switches(disabled)[1].element as HTMLInputElement).checked).toBe(false);
    });

    it("stores and applies the theme when the dark-mode switch is toggled", async () => {
        const wrapper = await mountView();

        await switches(wrapper)[0].setValue(true);

        expect(storageServiceMocks.storeTheme).toHaveBeenCalledWith(THEME_ANOTHAPP_DARK);
    });

    it("opens a confirm dialog before enabling episode tracking, and only applies it on confirm", async () => {
        userComposableMocks.updateEpisodeTracking.mockResolvedValue(undefined);
        const wrapper = await mountView(false);

        await switches(wrapper)[1].setValue(true);
        expect(userComposableMocks.updateEpisodeTracking).not.toHaveBeenCalled();

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Activer");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(userComposableMocks.updateEpisodeTracking).toHaveBeenCalledWith(true);
    });

    it("reverts the switch when enabling episode tracking is cancelled", async () => {
        const wrapper = await mountView(false);

        await switches(wrapper)[1].setValue(true);
        const cancelBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Annuler");
        await cancelBtn!.trigger("click");

        expect((switches(wrapper)[1].element as HTMLInputElement).checked).toBe(false);
        expect(userComposableMocks.updateEpisodeTracking).not.toHaveBeenCalled();
    });

    it("opens a confirm dialog before disabling episode tracking, and only applies it on confirm", async () => {
        userComposableMocks.updateEpisodeTracking.mockResolvedValue(undefined);
        const wrapper = await mountView(true);

        await switches(wrapper)[1].setValue(false);
        expect(userComposableMocks.updateEpisodeTracking).not.toHaveBeenCalled();

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Désactiver");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(userComposableMocks.updateEpisodeTracking).toHaveBeenCalledWith(false);
    });

    it("reverts the switch state when applying the change fails", async () => {
        userComposableMocks.updateEpisodeTracking.mockRejectedValue(new Error("Nope"));
        const wrapper = await mountView(false);
        // The component rethrows after reverting its own state, relying on
        // main.ts's app-level errorHandler to report it (tested separately);
        // silence it here so the expected rejection doesn't surface as noise.
        wrapper.vm.$.appContext.app.config.errorHandler = () => {};

        await switches(wrapper)[1].setValue(true);
        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Activer");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect((switches(wrapper)[1].element as HTMLInputElement).checked).toBe(false);
    });

    it("exports data when the export item is clicked", async () => {
        settingsComposableMocks.exportData.mockResolvedValue(undefined);
        const wrapper = await mountView();

        const exportItem = wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.text().includes("Exporter"));
        await exportItem!.trigger("click");

        expect(settingsComposableMocks.exportData).toHaveBeenCalled();
    });
});
