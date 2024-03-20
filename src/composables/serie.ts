import type { Serie } from "@/models/internal/serie";
import serieService from "@/services/serieService"
import { useSerieStore } from "@/stores/serie";
import type { SerieSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSerie() {
    const serieStore = useSerieStore();

    const getSeries = async (options: SerieSearchOptions = {}): Promise<Serie[]> => {
        const { refresh, title, kind } = options;

        if (title && serieStore.isNotEmpty())
            return serieStore.getSeriesByTitle(title);

        if (!refresh && serieStore.isNotEmpty())
            return serieStore.getSeries();

        const resp = await serieService.getSeries(title, kind);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        serieStore.setSeries(data);
        return data;
    }

    const updateFavoriteBySerieId = async (id: number): Promise<boolean> => {
        const resp = await serieService.updateFavoriteBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return true;
    }

    return { getSeries, updateFavoriteBySerieId }
}