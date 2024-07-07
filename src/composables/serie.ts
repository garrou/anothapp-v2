import type { Serie, SerieInfo } from "@/models/serie";
import serieService from "@/services/serieService";
import type { SerieSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";

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

    const getFavoriteSeries = async (): Promise<Serie[]> => {
        const resp = await serieService.getSeriesByStatus("favorite");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
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

        return data;
    }

    const getSeries = async (options: SerieSearchOptions = {}): Promise<Serie[]> => {
        return cache.userSeries.getSeries(options);
    }

    const getSeriesNotStarted = async (): Promise<Serie[]> => {
        const resp = await serieService.getSeriesByStatus("not-started");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesToContinue = async (): Promise<Serie[]> => {
        const resp = await serieService.getSeriesByStatus("continue");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateFavorite = async (serie: Serie): Promise<boolean> => {
        const resp = await serieService.updateFavoriteBySerieId(serie.id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess(data.favorite
            ? `"${serie.title}" ajoutée aux favoris`
            : `"${serie.title}" supprimée des favoris`);
        return data.favorite;
    }

    return { addSerie, deleteSerie, getFavoriteSeries, getSerie, getSerieInfos, getSeries, getSeriesNotStarted, getSeriesToContinue, updateFavorite }
}