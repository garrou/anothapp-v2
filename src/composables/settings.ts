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
            const payload = JSON.parse(await file.text());
            if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
                throw new Error();
            }
            return payload;
        } catch {
            throw new Error("Fichier invalide : ce n'est pas un export JSON valide");
        }
    }

    const previewImportPayload = (payload: ImportPayload): ImportPreview => {
        const seasons = payload.shows?.flatMap((show) => show.seasons ?? []) ?? [];
        const importablePlaylists = (payload.playlists ?? [])
            .filter((playlist) => !playlist.role || playlist.role === "owner");

        return {
            shows: payload.shows?.length ?? 0,
            seasons: seasons.length,
            episodes: seasons.reduce((total, season) => total + (season.episodes?.length ?? 0), 0),
            playlists: importablePlaylists.length,
            favoriteActors: payload.favoriteActors?.length ?? 0,
            platforms: payload.platforms?.length ?? 0,
        };
    }

    const importData = async (payload: ImportPayload): Promise<ImportSummary> => {
        const resp = await settingService.importData(payload);

        if (!resp.ok) {
            const message = await resp.json().then((body) => body.message).catch(() => undefined);
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

