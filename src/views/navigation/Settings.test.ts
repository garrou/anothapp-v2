// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Settings from "./Settings.vue";
import { vuetify } from "@/test/vuetify";
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK } from "@/utils/theme";

const userComposableMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
    updateEpisodeTracking: vi.fn(),
    requestDeletion: vi.fn(),
}));
const settingsComposableMocks = vi.hoisted(() => ({
    exportData: vi.fn(),
    importData: vi.fn(),
}));
const authComposableMocks = vi.hoisted(() => ({
    logout: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showInfo: vi.fn(),
}));
const storageServiceMocks = vi.hoisted(() => ({
    storeTheme: vi.fn(),
    getTheme: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));
vi.mock("@/composables/settings", () => ({ useSettings: () => settingsComposableMocks }));
vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));
vi.mock("@/composables/snackbar", () => ({ useSnackbar: () => snackbarMocks }));
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

    it("asks for confirmation before exporting, and only exports on confirm", async () => {
        settingsComposableMocks.exportData.mockResolvedValue(undefined);
        const wrapper = await mountView();

        const exportItem = wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.text().includes("Exporter mes données"));
        await exportItem!.trigger("click");
        expect(settingsComposableMocks.exportData).not.toHaveBeenCalled();

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Exporter");
        await confirmBtn!.trigger("click");

        expect(settingsComposableMocks.exportData).toHaveBeenCalled();
    });

    it("closes the export confirm dialog without exporting when cancelled", async () => {
        const wrapper = await mountView();

        const exportItem = wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.text().includes("Exporter mes données"));
        await exportItem!.trigger("click");

        const cancelBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Annuler");
        await cancelBtn!.trigger("click");

        expect(settingsComposableMocks.exportData).not.toHaveBeenCalled();
    });

    describe("data import", () => {
        const openImportDialog = async (wrapper: Awaited<ReturnType<typeof mountView>>) => {
            const importItem = wrapper.findAllComponents({ name: "VListItem" })
                .find((item) => item.text().includes("Importer mes données"));
            await importItem!.trigger("click");
        };

        const selectFile = async (wrapper: Awaited<ReturnType<typeof mountView>>, file: File) => {
            const fileInput = wrapper.findComponent({ name: "VFileInput" });
            await fileInput.vm.$emit("update:modelValue", file);
        };

        it("opens the import dialog", async () => {
            const wrapper = await mountView();

            await openImportDialog(wrapper);

            expect(wrapper.text()).toContain("Sélectionnez un fichier JSON");
        });

        it("imports the selected file and shows a summary on success", async () => {
            settingsComposableMocks.importData.mockResolvedValue({
                shows: { imported: 2, errors: 0 }, playlists: { imported: 1, errors: 0 },
                favoriteActors: { imported: 0, errors: 0 }, platforms: { imported: 1, errors: 0 }, errors: [],
            });
            const wrapper = await mountView();
            await openImportDialog(wrapper);
            const file = new File(["{}"], "export.json", { type: "application/json" });
            await selectFile(wrapper, file);

            const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Importer");
            await confirmBtn!.trigger("click");
            await flushPromises();

            expect(settingsComposableMocks.importData).toHaveBeenCalledWith(file);
            expect(snackbarMocks.showInfo).toHaveBeenCalledWith(expect.stringContaining("4"));
        });

        it("shows the error and keeps the dialog open when the import fails", async () => {
            settingsComposableMocks.importData.mockRejectedValue(new Error("Requête invalide"));
            const wrapper = await mountView();
            await openImportDialog(wrapper);
            await selectFile(wrapper, new File(["{}"], "export.json", { type: "application/json" }));

            const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Importer");
            await confirmBtn!.trigger("click");
            await flushPromises();

            expect(wrapper.text()).toContain("Requête invalide");
        });

        it("closes the dialog without importing when cancelled", async () => {
            const wrapper = await mountView();
            await openImportDialog(wrapper);

            const cancelBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Annuler");
            await cancelBtn!.trigger("click");

            expect(settingsComposableMocks.importData).not.toHaveBeenCalled();
        });
    });

    describe("account deletion", () => {
        const openDialog = async (wrapper: Awaited<ReturnType<typeof mountView>>) => {
            const deleteItem = wrapper.findAllComponents({ name: "VListItem" })
                .find((item) => item.text().includes("Supprimer mon compte"));
            await deleteItem!.trigger("click");
        };

        it("opens the delete-account dialog with a password field", async () => {
            const wrapper = await mountView();

            await openDialog(wrapper);

            expect(wrapper.text()).toContain("15 jours");
        });

        it("requests deletion, shows the grace-period info, then logs out on confirm", async () => {
            userComposableMocks.requestDeletion.mockResolvedValue(undefined);
            const wrapper = await mountView();
            await openDialog(wrapper);

            const passwordInput = wrapper.findAllComponents({ name: "VTextField" })
                .find((f) => f.props("label") === "Mot de passe");
            await passwordInput!.setValue("goodpassword");
            const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Supprimer");
            await confirmBtn!.trigger("click");
            await flushPromises();

            expect(userComposableMocks.requestDeletion).toHaveBeenCalledWith("goodpassword");
            expect(snackbarMocks.showInfo).toHaveBeenCalled();
            expect(authComposableMocks.logout).toHaveBeenCalled();
        });

        it("shows the server error and does not log out when the password is incorrect", async () => {
            userComposableMocks.requestDeletion.mockRejectedValue(new Error("Mot de passe incorrect"));
            const wrapper = await mountView();
            await openDialog(wrapper);

            const passwordInput = wrapper.findAllComponents({ name: "VTextField" })
                .find((f) => f.props("label") === "Mot de passe");
            await passwordInput!.setValue("wrongpassword");
            const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Supprimer");
            await confirmBtn!.trigger("click");
            await flushPromises();

            expect(wrapper.text()).toContain("Mot de passe incorrect");
            expect(authComposableMocks.logout).not.toHaveBeenCalled();
        });

        it("closes the dialog without requesting deletion when cancelled", async () => {
            const wrapper = await mountView();
            await openDialog(wrapper);

            const cancelBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Annuler");
            await cancelBtn!.trigger("click");

            expect(userComposableMocks.requestDeletion).not.toHaveBeenCalled();
        });
    });
});
