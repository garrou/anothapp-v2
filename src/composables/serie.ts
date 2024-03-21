import type { Serie } from "@/models/internal/serie";
import serieService from "@/services/serieService";
import type { SerieSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSerie() {

    const getSerie = async (options: SerieSearchOptions): Promise<Serie> => {
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

    const updateFavoriteBySerieId = async (id: number): Promise<boolean> => {
        const resp = await serieService.updateFavoriteBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return true;
    }

    return { getSerie, getSeries, updateFavoriteBySerieId }
}