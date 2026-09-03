import type { Recommendation, Serie, SerieInfo } from "@/models/serie";
import serieService from "@/services/serieService";
import type { CacheSearchOptions, SerieSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import { SerieStatus } from "@/types/types";
import { useState } from "./state";
import { useSerieStore } from "@/stores/serie";
import { useUserSeriesStore } from "@/stores/userSeries";
import { useUserListStore } from "@/stores/userList";
import { useSeriesCatalogStore } from "@/stores/seriesCatalog";
import { withoutAccentsIgnoreCase } from "@/utils/format";

let pendingUserSeries: Promise<void> | null = null;
let pendingUserList: Promise<void> | null = null;

export function useSerie() {

    const { showSuccess } = useSnackbar();
    const { setConfirmModal } = useState();
    const serieStore = useSerieStore();
    const userSeriesStore = useUserSeriesStore();
    const userListStore = useUserListStore();
    const seriesCatalogStore = useSeriesCatalogStore();
    const router = useRouter();

    const ensureUserSeriesLoaded = async (): Promise<void> => {
        if (userSeriesStore.loaded) return;

        if (!pendingUserSeries) {
            pendingUserSeries = (async () => {
                const resp = await serieService.getSeries();
                const data = await resp.json();

                if (isError(resp.status)) {
                    throw new Error(data.message);
                }
                userSeriesStore.setAll(data);
            })().finally(() => { pendingUserSeries = null; });
        }
        await pendingUserSeries;
    }

    const ensureUserListLoaded = async (): Promise<void> => {
        if (userListStore.loaded) return;

        if (!pendingUserList) {
            pendingUserList = (async () => {
                const resp = await serieService.getSeriesByStatus(SerieStatus.Watchlist);
                const data = await resp.json();

                if (isError(resp.status)) {
                    throw new Error(data.message);
                }
                userListStore.setAll(data);
            })().finally(() => { pendingUserList = null; });
        }
        await pendingUserList;
    }

    const addSerie = async (id: number, inList: boolean = false): Promise<void> => {
        const resp = await serieService.addSerie(id, inList);
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        if (inList) {
            userListStore.upsert(data);
        } else {
            userSeriesStore.upsert({ ...data, watch: true, addedAt: new Date().toISOString() });
        }
        showSuccess(`Série ajoutée ${inList ? "dans votre liste" : ""}`);

        if (!inList)
            router.push(`/series/${id}`);
    }

    const deleteSerie = async (serie: Serie): Promise<void> => {
        const resp = await serieService.deleteSerie(serie.id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        userSeriesStore.remove(serie.id);
        showSuccess(`Série "${serie.title}" supprimée`);
        router.replace("/series");
        setConfirmModal(false);
    }

    const deleteSerieInList = async (serie: Serie): Promise<void> => {
        const resp = await serieService.deleteSerie(serie.id, true);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        userListStore.remove(serie.id);
        showSuccess(`Série "${serie.title}" supprimée de votre liste`);
    }

    const getSerie = async (options: SerieSearchOptions): Promise<Serie> => {
        const { id } = options;

        if (!id) {
            throw new Error("Impossible de récupérer les données");
        }
        await ensureUserSeriesLoaded();
        const serie = userSeriesStore.series.get(id);

        if (!serie) {
            throw new Error("Série introuvable");
        }
        return serie;
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
            serie: await getSerie(options)
        };
    }

    const filterAndSortUserSeries = (options: SerieSearchOptions): Serie[] => {
        const { countries, title, kinds, notes } = options;
        let series = Array.from(userSeriesStore.series.values());

        if (kinds) {
            series = series.filter((serie) => kinds.every((kind) => serie.kinds.includes(kind)));
        }
        if (countries) {
            series = series.filter((serie) => countries.includes(serie.country));
        }
        if (title) {
            series = series.filter((serie) => withoutAccentsIgnoreCase(serie.title).includes(withoutAccentsIgnoreCase(title)));
        }
        if (notes) {
            series = series.filter((serie) => serie.note && notes.includes(serie.note));
        }
        return series.sort((a, b) => {
            const ad = a.addedAt ? new Date(a.addedAt).getTime() : 0;
            const bd = b.addedAt ? new Date(b.addedAt).getTime() : 0;
            return bd - ad;
        });
    }

    const getSeries = async (): Promise<Serie[]> => {
        const { filterCountries, filterKinds, filterNotes, filterTitle, filterPlatforms, formatPlatforms, formatKinds, formatNotes } = serieStore;

        if (!filterPlatforms.length) {
            await ensureUserSeriesLoaded();
            return filterAndSortUserSeries({
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

    const getRecommendations = async (): Promise<Recommendation[]> => {
        const resp = await serieService.getRecommendations();
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
            await ensureUserSeriesLoaded();
            return Array.from(userSeriesStore.series.values())
                .filter((serie) => serie.favorite)
                .sort((a, b) => a.title.localeCompare(b.title));
        } else if (status === SerieStatus.Watchlist) {
            await ensureUserListLoaded();
            return Array.from(userListStore.series.values());
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

        userSeriesStore.upsert({
            ...serie,
            [field]: newValue
        });
        return mustSetValue ? true : data.value;
    }

    const getSerieFromCache = (id: number, cacheOptions: CacheSearchOptions = { type: "userseries" }): Serie | undefined => {
        const { type } = cacheOptions;

        switch (type) {
            case "userlist":
                return userListStore.series.get(id);
            case "series":
                return seriesCatalogStore.series.get(id);
            default:
                return userSeriesStore.series.get(id);
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
        getRecommendations,
        updateField
    }
}
