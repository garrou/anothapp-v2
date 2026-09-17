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

describe("useSettings.readImportFile", () => {
    const fileWith = (content: string) => ({ text: async () => content } as File);

    it("rejects a file that isn't valid JSON", async () => {
        await expect(useSettings().readImportFile(fileWith("not json"))).rejects.toThrow(
            "Fichier invalide : ce n'est pas un export JSON valide"
        );
    });

    it("parses the file's JSON content", async () => {
        const result = await useSettings().readImportFile(fileWith('{"shows":[]}'));

        expect(result).toEqual({ shows: [] });
    });

    it("rejects valid JSON that isn't an object, e.g. a bare null or array", async () => {
        await expect(useSettings().readImportFile(fileWith("null"))).rejects.toThrow(
            "Fichier invalide : ce n'est pas un export JSON valide"
        );
        await expect(useSettings().readImportFile(fileWith("[1,2,3]"))).rejects.toThrow(
            "Fichier invalide : ce n'est pas un export JSON valide"
        );
    });
});

describe("useSettings.previewImportPayload", () => {
    it("counts each category, defaulting missing ones to 0", () => {
        const result = useSettings().previewImportPayload({ shows: [{}, {}], platforms: [1] });

        expect(result).toEqual({ shows: 2, seasons: 0, episodes: 0, playlists: 0, favoriteActors: 0, platforms: 1 });
    });

    it("excludes shared playlists (role set and not \"owner\") from the count, since they aren't recreated", () => {
        const result = useSettings().previewImportPayload({
            playlists: [{}, { role: "owner" }, { role: "collaborator" }],
        });

        expect(result.playlists).toBe(2);
    });

    it("sums seasons and episodes across every show", () => {
        const result = useSettings().previewImportPayload({
            shows: [
                { seasons: [{ episodes: [{}, {}] }, { episodes: [{}] }] },
                { seasons: [{ episodes: [{}] }] },
                {},
            ],
        });

        expect(result.seasons).toBe(3);
        expect(result.episodes).toBe(4);
    });
});

describe("useSettings.importData", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("sends the payload to the service", async () => {
        const summary = { shows: { imported: 1, errors: 0 } };
        settingServiceMocks.importData.mockResolvedValue({ ok: true, json: async () => summary });

        const result = await useSettings().importData({ shows: [] });

        expect(settingServiceMocks.importData).toHaveBeenCalledWith({ shows: [] });
        expect(result).toEqual(summary);
    });

    it("throws the server's message when the import fails", async () => {
        settingServiceMocks.importData.mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Requête invalide" }),
        });

        await expect(useSettings().importData({ shows: [] })).rejects.toThrow("Requête invalide");
    });

    it("falls back to a default message when the server sends none", async () => {
        settingServiceMocks.importData.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(useSettings().importData({ shows: [] })).rejects.toThrow(
            "Erreur lors de l'import des données"
        );
    });

    it("falls back to a default message when the error response isn't JSON", async () => {
        settingServiceMocks.importData.mockResolvedValue({
            ok: false,
            json: async () => { throw new SyntaxError("Unexpected token <"); },
        });

        await expect(useSettings().importData({ shows: [] })).rejects.toThrow(
            "Erreur lors de l'import des données"
        );
    });
});
