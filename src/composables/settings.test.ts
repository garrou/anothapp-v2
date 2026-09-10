import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSettings } from "./settings";

const settingServiceMocks = vi.hoisted(() => ({
    exportData: vi.fn(),
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
