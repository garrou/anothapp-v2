import type { Serie, SerieInfo } from "@/models/serie";
import serieService from "@/services/serieService";
import type { SerieSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";
import type { SerieStatus } from "@/types/types";

export function useSerie() {

    const { showSuccess } = useSnackbar();
    const router = useRouter();

    const addSerie = async (serie: Serie): Promise<void> => {
        const resp = await serieService.addSerie(serie);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        await cache.userSeries.addSerie({
            ...serie,
            addedAt: new Date().toISOString()
        });
        showSuccess(`Série "${serie.title}" ajoutée`);
        router.push(`/series/${serie.id}`);
    }

    const deleteSerie = async (serie: Serie): Promise<boolean> => {
        await cache.userSeries.deleteSerie(serie.id);
        showSuccess(`Série "${serie.title}" supprimée`);
        return true;
    }

    const getSerie = async (options: SerieSearchOptions): Promise<Serie> => {
        const { id } = options;

        if (!id)
            throw new Error("Impossible de récupérer les données");

        return cache.userSeries.getSerieById(id);
    }

    const getSerieInfos = async (options: SerieSearchOptions): Promise<SerieInfo> => {
        const { id } = options;

        if (!id)
            throw new Error("Impossible de récupérer les données");

        const resp = await serieService.getSerie(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return {
            ...data,
            serie: await cache.userSeries.getSerieById(id)
        };
    }

    const getSeries = async (options: SerieSearchOptions = {}): Promise<Serie[]> => {
        return cache.userSeries.getSeries(options);
    }

    const getSeriesByStatus = async (status: SerieStatus, friendId?: string): Promise<Serie[]> => {

        if (status === "favorite") {
            return cache.userSeries.getFavorites();
        }
        const resp = await serieService.getSeriesByStatus(status, friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateField = async (serie: Serie, field: string): Promise<boolean> => {
        const resp = await serieService.updateFieldBySerieId(serie.id, field);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        await cache.userSeries.addSerie({
            ...serie,
            [field]: data.value
        });
        return data.value;
    }

    return { 
        addSerie, 
        deleteSerie, 
        getSerie, 
        getSerieInfos, 
        getSeries, 
        getSeriesByStatus,
        updateField 
    }
}