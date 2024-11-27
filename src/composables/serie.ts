import type { Serie, SerieInfo } from "@/models/serie";
import serieService from "@/services/serieService";
import type { CacheSearchOptions, SerieSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";
import type { SerieStatus } from "@/types/types";
import { useState } from "./state";
import UserSeriesCache from "@/cache/modules/userSeries";
import UserListCache from "@/cache/modules/userList";
import SeriesCache from "@/cache/modules/series";
import type { SerieCacheItem } from "@/types/cache";

export function useSerie() {

    const { showSuccess } = useSnackbar();
    const { setConfirmModal } = useState();
    const router = useRouter();

    const canAddSerie = (serie: Serie): boolean => {
        return [serie.id,
            serie.title, 
            serie.poster,
            serie.kinds, 
            serie.duration,
            serie.seasons,
            serie.country].every((item) => item !== undefined);
    }

    const addSerie = async (serie: Serie): Promise<void> => {
        const resp = await serieService.addSerie(serie);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        if (serie.list) {
            await cache.userList.addSerie({
                ...serie,
                addedAt: new Date().toISOString()
            });
        } else {
            await cache.userSeries.addSerie({
                ...serie,
                addedAt: new Date().toISOString()
            });
        }
        showSuccess(`Série "${serie.title}" ajoutée ${serie.list ? "dans votre liste" : ""}`);
        if (!serie.list)
            router.push(`/series/${serie.id}`);
    }

    const deleteSerie = async (serie: Serie): Promise<void> => {
        await cache.userSeries.deleteSerie(serie.id);
        showSuccess(`Série "${serie.title}" supprimée`);
        router.replace("/series");
        setConfirmModal(false);
    }

    const deleteSerieInList = async (serie: Serie): Promise<void> => {
        await cache.userList.deleteSerie(serie.id);
        showSuccess(`Série "${serie.title}" supprimée de votre liste`);
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
        if (!options.platforms) {
            return cache.userSeries.getSeries(options);
        }
        const resp = await serieService.getSeries(options);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesByStatus = async (status: SerieStatus, friendId?: string): Promise<Serie[]> => {
        if (status === "favorite" && !friendId) {
            return cache.userSeries.getFavorites();
        } else if (status === "not-started") {
            return cache.userList.getSeriesInList();
        }
        const resp = await serieService.getSeriesByStatus(status, friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateField = async (serie: Serie, field: keyof Serie): Promise<boolean> => {
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

    const getSerieFromCache = async (id: number, cacheOptions: CacheSearchOptions = { type: UserSeriesCache.NAME }): Promise<SerieCacheItem | undefined> => {
        const { type } = cacheOptions;

        switch (type) {
            case UserListCache.NAME:
                return cache.userList.getSerieFromCache(id);
            case SeriesCache.NAME:
                return cache.series.getSerieFromCache(id);
            default:
                return cache.userSeries.getSerieFromCache(id);
        }
    }

    return {
        addSerie,
        canAddSerie,
        deleteSerie,
        deleteSerieInList,
        getSerie,
        getSerieFromCache,
        getSerieInfos,
        getSeries,
        getSeriesByStatus,
        updateField
    }
}