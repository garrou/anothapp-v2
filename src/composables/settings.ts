import settingService from "@/services/settingService";
import type { ImportSummary } from "@/models/importSummary";

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

    const importData = async (file: File): Promise<ImportSummary> => {
        let payload: unknown;

        try {
            payload = JSON.parse(await file.text());
        } catch {
            throw new Error("Fichier invalide : ce n'est pas un export JSON valide");
        }
        const resp = await settingService.importData(payload);

        if (!resp.ok) {
            const { message } = await resp.json();
            throw new Error(message ?? "Erreur lors de l'import des données");
        }
        return await resp.json();
    }

    return {
        exportData,
        importData
    }
}

