import type { Serie, SerieInfos } from "@/models/internal/serie";
import serieService from "@/services/serieService";
import type { SerieSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";

export function useSerie() {

    const snackBar = useSnackbar();

    const deleteSerie = async (serie: Serie): Promise<boolean> => {
        const resp = await serieService.deleteSerie(serie.id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        snackBar.setMessage(`Série "${serie.title}" supprimée`);
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

        const message = serie.favorite
            ? `"${serie.title}" supprimée des favorites`
            : `"${serie.title}" ajoutée aux favorites`;
        snackBar.setMessage(message);
        return !serie.favorite;
    }

    return { deleteSerie, getSerie, getSeries, updateFavorite }
}