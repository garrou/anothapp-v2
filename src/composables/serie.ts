import type { Serie, SerieInfo } from "@/models/serie";
import serieService from "@/services/serieService";
import type { CacheSearchOptions, SerieSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";
import { SerieStatus } from "@/types/types";
import { useState } from "./state";
import UserSeriesCache from "@/cache/modules/userSeries";
import UserListCache from "@/cache/modules/userList";
import SeriesCache from "@/cache/modules/series";
import type { SerieCacheItem } from "@/types/cache";
import { useSerieStore } from "@/stores/serie";

export function useSerie() {

    const { showSuccess } = useSnackbar();
    const { setConfirmModal } = useState();
    const serieStore = useSerieStore();
    const router = useRouter();

    const addSerie = async (id: number, inList: boolean = false): Promise<void> => {
        if (inList) {
            await cache.userList.addSerieById(id);
        } else {
            await cache.userSeries.addSerieById(id);
        }
        showSuccess(`Série ajoutée ${inList ? "dans votre liste" : ""}`);

        if (!inList)
            router.push(`/series/${id}`);
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

        if (!id) {
            throw new Error("Impossible de récupérer les données");
        }
        return cache.userSeries.getSerieById(id);
    }

    const getSerieInfos = async (options: SerieSearchOptions): Promise<SerieInfo> => {
        const { id } = options;

        if (!id) {
            throw new Error("Impossible de récupérer les données");
        }
        const resp = await serieService.getSerie(id);
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        return {
            ...data,
            serie: await cache.userSeries.getSerieById(id)
        };
    }

    const getSeries = async (): Promise<Serie[]> => {
        const { filterCountries, filterKinds, filterNotes, filterTitle, filterPlatforms, formatPlatforms, formatKinds, formatNotes } = serieStore;

        if (!filterPlatforms.length) {
            return cache.userSeries.getSeries({ 
                notes: filterNotes.length ? filterNotes.map((note) => note.id) : undefined,
                title: filterTitle, 
                kinds: filterKinds.length ? filterKinds.map((kind) => kind.value) : undefined,
                countries: filterCountries.length ? filterCountries : undefined,
            });
        }
        const resp = await serieService.getSeries(filterTitle, formatPlatforms(), formatKinds(), formatNotes());
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getCountries = async (): Promise<string[]> => {
        const series = await getSeries();
        return [...new Set(series.map((serie) => serie.country))].sort((a, b) => a.localeCompare(b));
    }

    const getSeriesByStatus = async (status: SerieStatus, friendId?: string): Promise<Serie[]> => {
        if (status === SerieStatus.Favorite && !friendId) {
            return cache.userSeries.getFavorites();
        } else if (status === SerieStatus.Watchlist) {
            return cache.userList.getSeriesInList();
        }
        const resp = await serieService.getSeriesByStatus(status, friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateField = async (serie: Serie, field: keyof Serie, value: string | number): Promise<boolean> => {
        const resp = await serieService.updateFieldBySerieId(serie.id, field, value);
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        const mustSetValue = ["addedAt", "note"].includes(field);
        const newValue = mustSetValue ? value : data.value;

        await cache.userSeries.addSerie({
            ...serie,
            [field]: newValue
        });
        return mustSetValue ? true : data.value;
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
        deleteSerie,
        deleteSerieInList,
        getCountries,
        getSerie,
        getSerieFromCache,
        getSerieInfos,
        getSeries,
        getSeriesByStatus,
        updateField
    }
}
