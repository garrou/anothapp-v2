import settingService from "@/services/settingService";
import type { ImportSummary } from "@/models/importSummary";
import type { ImportPayload, ImportPreview } from "@/models/importPayload";

export function useSettings() {

    const exportData = async () => {
        const resp = await settingService.exportData();
        if (!resp.ok) {
            const { message } = await resp.json();
            throw new Error(message ?? "Erreur lors de l'export des données");
        }

        const contentDisposition = resp.headers.get('content-disposition');
        let filename = 'data.json';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }

    const readImportFile = async (file: File): Promise<ImportPayload> => {
        try {
            return JSON.parse(await file.text());
        } catch {
            throw new Error("Fichier invalide : ce n'est pas un export JSON valide");
        }
    }

    const previewImportPayload = (payload: ImportPayload): ImportPreview => ({
        shows: payload.shows?.length ?? 0,
        playlists: payload.playlists?.length ?? 0,
        favoriteActors: payload.favoriteActors?.length ?? 0,
        platforms: payload.platforms?.length ?? 0,
    });

    const importData = async (payload: ImportPayload): Promise<ImportSummary> => {
        const resp = await settingService.importData(payload);

        if (!resp.ok) {
            const { message } = await resp.json();
            throw new Error(message ?? "Erreur lors de l'import des données");
        }
        return await resp.json();
    }

    return {
        exportData,
        readImportFile,
        previewImportPayload,
        importData
    }
}

