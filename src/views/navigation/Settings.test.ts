// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Settings from "./Settings.vue";
import { vuetify } from "@/test/vuetify";
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK } from "@/utils/theme";

const userComposableMocks = vi.hoisted(() => ({
    requestDeletion: vi.fn(),
}));
const settingsComposableMocks = vi.hoisted(() => ({
    exportData: vi.fn(),
    readImportFile: vi.fn(),
    previewImportPayload: vi.fn(),
    importData: vi.fn(),
}));
const authComposableMocks = vi.hoisted(() => ({
    logout: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showInfo: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
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

const mountView = async () => {
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
    it("stores and applies the theme when the dark-mode switch is toggled", async () => {
        const wrapper = await mountView();

        await switches(wrapper)[0].setValue(true);

        expect(storageServiceMocks.storeTheme).toHaveBeenCalledWith(THEME_ANOTHAPP_DARK);
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

    it("shows the server error instead of failing silently when the export fails", async () => {
        settingsComposableMocks.exportData.mockRejectedValue(new Error("Too many export requests"));
        const wrapper = await mountView();

        const exportItem = wrapper.findAllComponents({ name: "VListItem" }).find((item) => item.text().includes("Exporter mes données"));
        await exportItem!.trigger("click");
        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Exporter");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(snackbarMocks.showError).toHaveBeenCalledWith("Too many export requests");
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
            await flushPromises();
        };

        it("opens the import dialog", async () => {
            const wrapper = await mountView();

            await openImportDialog(wrapper);

            expect(wrapper.text()).toContain("Sélectionnez un fichier JSON");
        });

        it("shows a preview summary once a valid file is selected, before importing", async () => {
            const payload = { shows: [{}, {}], playlists: [{}], favoriteActors: [], platforms: [1] };
            settingsComposableMocks.readImportFile.mockResolvedValue(payload);
            settingsComposableMocks.previewImportPayload.mockReturnValue({
                shows: 2, seasons: 5, episodes: 20, playlists: 1, favoriteActors: 0, platforms: 1,
            });
            const wrapper = await mountView();
            await openImportDialog(wrapper);

            await selectFile(wrapper, new File(["{}"], "export.json", { type: "application/json" }));

            expect(settingsComposableMocks.previewImportPayload).toHaveBeenCalledWith(payload);
            expect(wrapper.text()).toContain("2 série(s)");
            expect(wrapper.text()).toContain("5 saison(s)");
            expect(wrapper.text()).toContain("20 épisode(s)");
            expect(settingsComposableMocks.importData).not.toHaveBeenCalled();
        });

        it("ignores a stale read when a second file is selected before the first one resolves", async () => {
            let resolveFirst!: (payload: unknown) => void;
            const firstRead = new Promise((resolve) => { resolveFirst = resolve; });
            const fileA = new File(["{}"], "a.json", { type: "application/json" });
            const fileB = new File(["{}"], "b.json", { type: "application/json" });

            settingsComposableMocks.readImportFile.mockImplementation((file: File) =>
                file === fileA ? firstRead : Promise.resolve({ shows: [{}] })
            );
            settingsComposableMocks.previewImportPayload.mockImplementation(
                (payload: { shows?: unknown[] }) => ({
                    shows: payload.shows?.length ?? 0, seasons: 0, episodes: 0, playlists: 0, favoriteActors: 0, platforms: 0,
                })
            );
            const wrapper = await mountView();
            await openImportDialog(wrapper);

            await selectFile(wrapper, fileA);
            await selectFile(wrapper, fileB);
            resolveFirst({ shows: [{}, {}, {}] });
            await flushPromises();

            expect(wrapper.text()).toContain("1 série(s)");
            expect(wrapper.text()).not.toContain("3 série(s)");
        });

        it("keeps the import button disabled until the file has been parsed into a preview", async () => {
            const wrapper = await mountView();
            await openImportDialog(wrapper);

            const importBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Importer");

            expect(importBtn!.attributes("disabled")).toBeDefined();
        });

        it("shows the parse error and keeps import disabled for an invalid file", async () => {
            settingsComposableMocks.readImportFile.mockRejectedValue(new Error("Fichier invalide"));
            const wrapper = await mountView();
            await openImportDialog(wrapper);

            await selectFile(wrapper, new File(["not json"], "export.json", { type: "application/json" }));

            expect(wrapper.text()).toContain("Fichier invalide");
            const importBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Importer");
            expect(importBtn!.attributes("disabled")).toBeDefined();
        });

        it("imports the parsed payload and shows a summary on success", async () => {
            const payload = { shows: [{}], playlists: [], favoriteActors: [], platforms: [] };
            settingsComposableMocks.readImportFile.mockResolvedValue(payload);
            settingsComposableMocks.previewImportPayload.mockReturnValue({
                shows: 1, seasons: 0, episodes: 0, playlists: 0, favoriteActors: 0, platforms: 0,
            });
            settingsComposableMocks.importData.mockResolvedValue({
                shows: { imported: 2, errors: 0 }, playlists: { imported: 1, skipped: 0, errors: 0 },
                favoriteActors: { imported: 0, errors: 0 }, platforms: { imported: 1, errors: 0 }, errors: [],
            });
            const wrapper = await mountView();
            await openImportDialog(wrapper);
            await selectFile(wrapper, new File(["{}"], "export.json", { type: "application/json" }));

            const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Importer");
            await confirmBtn!.trigger("click");
            await flushPromises();

            expect(settingsComposableMocks.importData).toHaveBeenCalledWith(payload);
            expect(snackbarMocks.showSuccess).toHaveBeenCalledWith(expect.stringContaining("4"));
        });

        it("shows an error summary instead of a plain success when the import partially fails", async () => {
            const payload = { shows: [{}], playlists: [], favoriteActors: [], platforms: [] };
            settingsComposableMocks.readImportFile.mockResolvedValue(payload);
            settingsComposableMocks.previewImportPayload.mockReturnValue({
                shows: 1, seasons: 0, episodes: 0, playlists: 0, favoriteActors: 0, platforms: 0,
            });
            settingsComposableMocks.importData.mockResolvedValue({
                shows: { imported: 1, errors: 1 }, playlists: { imported: 0, skipped: 0, errors: 0 },
                favoriteActors: { imported: 0, errors: 0 }, platforms: { imported: 0, errors: 0 },
                errors: ["Série \"X\" : Saison invalide"],
            });
            const wrapper = await mountView();
            await openImportDialog(wrapper);
            await selectFile(wrapper, new File(["{}"], "export.json", { type: "application/json" }));

            const confirmBtn = wrapper.findAllComponents({ name: "VBtn" }).find((btn) => btn.text() === "Importer");
            await confirmBtn!.trigger("click");
            await flushPromises();

            expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
            expect(snackbarMocks.showError).toHaveBeenCalledWith(expect.stringContaining("Saison invalide"));
        });

        it("shows the server error and keeps the dialog open when the import fails", async () => {
            const payload = { shows: [] };
            settingsComposableMocks.readImportFile.mockResolvedValue(payload);
            settingsComposableMocks.previewImportPayload.mockReturnValue({
                shows: 0, seasons: 0, episodes: 0, playlists: 0, favoriteActors: 0, platforms: 0,
            });
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
