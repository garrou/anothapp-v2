import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSettings } from "./settings";

const settingServiceMocks = vi.hoisted(() => ({
    exportData: vi.fn(),
    importData: vi.fn(),
}));

vi.mock("@/services/settingService", () => ({
    default: settingServiceMocks,
}));

describe("useSettings.exportData", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("throws the server's message when the export fails", async () => {
        settingServiceMocks.exportData.mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Impossible d'exporter vos données" }),
        });

        await expect(useSettings().exportData()).rejects.toThrow("Impossible d'exporter vos données");
    });

    it("falls back to a default message when the server sends none", async () => {
        settingServiceMocks.exportData.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(useSettings().exportData()).rejects.toThrow("Erreur lors de l'export des données");
    });
});

describe("useSettings.importData", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    const fileWith = (content: string) => ({ text: async () => content } as File);

    it("rejects a file that isn't valid JSON", async () => {
        await expect(useSettings().importData(fileWith("not json"))).rejects.toThrow(
            "Fichier invalide : ce n'est pas un export JSON valide"
        );
        expect(settingServiceMocks.importData).not.toHaveBeenCalled();
    });

    it("parses the file and sends its content to the service", async () => {
        const summary = { shows: { imported: 1, errors: 0 } };
        settingServiceMocks.importData.mockResolvedValue({ ok: true, json: async () => summary });

        const result = await useSettings().importData(fileWith('{"shows":[]}'));

        expect(settingServiceMocks.importData).toHaveBeenCalledWith({ shows: [] });
        expect(result).toEqual(summary);
    });

    it("throws the server's message when the import fails", async () => {
        settingServiceMocks.importData.mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Requête invalide" }),
        });

        await expect(useSettings().importData(fileWith('{"shows":[]}'))).rejects.toThrow("Requête invalide");
    });

    it("falls back to a default message when the server sends none", async () => {
        settingServiceMocks.importData.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(useSettings().importData(fileWith('{"shows":[]}'))).rejects.toThrow(
            "Erreur lors de l'import des données"
        );
    });
});
