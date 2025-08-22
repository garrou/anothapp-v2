import cache from "@/cache";
import settingService from "@/services/settingService";

export function useSettings() {

    const exportData = async () => {
        const resp = await settingService.exportData();
        if (!resp.ok) {
            throw new Error("Erreur lors de l'export des données");
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

    const clearCaches = () => {
        cache.reset().then(() => {
            location.reload();
        });
    }

    return {
        exportData,
        clearCaches
    }
}

