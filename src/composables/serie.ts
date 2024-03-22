import type { Serie, SerieInfos } from "@/models/serie";
import serieService from "@/services/serieService";
import type { SerieSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";

export function useSerie() {

    const snackBar = useSnackbar();
    const router = useRouter();

    const addSerie = async (serie: Serie): Promise<boolean> => {
        const resp = await serieService.addSerie(serie);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        snackBar.showSuccess(`Série "${serie.title} ajoutée`);
        router.push(`/series/${serie.id}`);
        return true;
    }

    const deleteSerie = async (serie: Serie): Promise<boolean> => {
        const resp = await serieService.deleteSerie(serie.id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        snackBar.showSuccess(`Série "${serie.title}" supprimée`);
        return true;
    }

    const getSerie = async (options: SerieSearchOptions): Promise<SerieInfos> => {
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
        const { kind, title } = options;

        const resp = await serieService.getSeries(title, kind);
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

        const message = data.favorite
            ? `"${serie.title}" ajoutée aux favoris`
            : `"${serie.title}" supprimée des favoris`;
        snackBar.showSuccess(message);
        return data.favorite;
    }

    return { addSerie, deleteSerie, getSerie, getSeries, updateFavorite }
}