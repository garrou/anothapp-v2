import type { Actor, Character } from "@/models/person";
import type { Season } from "@/models/season";
import type { Kind, Platform, Serie, Similar } from "@/models/serie";
import searchService from "@/services/searchService";
import { isError } from "@/utils/response";
import { useSearchStore } from "@/stores/search";
import { useKindsStore } from "@/stores/kinds";
import { useNotesStore } from "@/stores/notes";
import { usePlatformsStore } from "@/stores/platforms";
import { useSeriesCatalogStore } from "@/stores/seriesCatalog";
import type { Note } from "@/models/note";
import { loadOnce } from "@/utils/loadOnce";

export function useSearch() {

    const searchStore = useSearchStore();
    const kindsStore = useKindsStore();
    const notesStore = useNotesStore();
    const platformsStore = usePlatformsStore();
    const seriesCatalogStore = useSeriesCatalogStore();

    const getActor = async (id: number): Promise<Actor> => {
        const resp = await searchService.getActor(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getCharacters = async (id: number): Promise<Character[]> => {
        const resp = await searchService.getCharacters(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getKinds = async (): Promise<Kind[]> => {
        await loadOnce("kinds", () => kindsStore.loaded, async () => {
            const resp = await searchService.getKinds();
            const data = await resp.json();

            if (isError(resp.status)) {
                throw new Error(data.message);
            }
            kindsStore.setAll([...data].sort((a: Kind, b: Kind) => a.name.localeCompare(b.name)));
        });
        return kindsStore.kinds;
    }

    const getNotes = async (): Promise<Note[]> => {
        await loadOnce("notes", () => notesStore.loaded, async () => {
            const resp = await searchService.getNotes();
            const data = await resp.json();

            if (isError(resp.status)) {
                throw new Error(data.message);
            }
            notesStore.setAll([...data].sort((a: Note, b: Note) => a.id - b.id));
        });
        return notesStore.notes;
    }

    const getPlatforms = async (): Promise<Platform[]> => {
        await loadOnce("platforms", () => platformsStore.loaded, async () => {
            const resp = await searchService.getPlatforms();
            const data = await resp.json();

            if (isError(resp.status)) {
                throw new Error(data.message);
            }
            platformsStore.setAll([...data].sort((a: Platform, b: Platform) => a.name.localeCompare(b.name)));
        });
        return platformsStore.platforms;
    }

    const ensureCatalogLoaded = (): Promise<void> => loadOnce("seriesCatalog", () => seriesCatalogStore.loaded, async () => {
        const resp = await searchService.getSeries();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        seriesCatalogStore.setAll(data);
    });

    const getSerie = async (id: number): Promise<Serie> => {
        const cached = seriesCatalogStore.series.get(id);

        if (cached) {
            return cached;
        }
        const resp = await searchService.getSerie(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        seriesCatalogStore.upsert(data);
        return data;
    }

    const getSerieImages = async (id: number): Promise<string[]> => {
        const resp = await searchService.getSerieImages(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeries = async (): Promise<Serie[]> => {
        const { filterTitle, filterLimit, formatKinds, formatPlatforms } = searchStore;
        const kinds = formatKinds();
        const platforms = formatPlatforms();

        if (searchStore.hasChanges()) {
            const resp = await searchService.getSeries(filterTitle, kinds, platforms, filterLimit);
            const data = await resp.json();

            if (isError(resp.status))
                throw new Error(data.message);

            return data;
        }
        await ensureCatalogLoaded();
        return Array.from(seriesCatalogStore.series.values());
    }

    const getSeasonsBySerieId = async (id: number): Promise<Season[]> => {
        const resp = await searchService.getSeasonsBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSimilarsSeries = async (id: number): Promise<Similar[]> => {
        const resp = await searchService.getSimilarsSeries(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getImages = async (limit: number): Promise<string[]> => {
        const resp = await searchService.getImages(limit);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodes = async (id: number, season: number) => {
        const resp = await searchService.getEpisodesBySerieIdBySeason(id, season);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return {
        getActor,
        getCharacters,
        getEpisodes,
        getImages,
        getKinds,
        getNotes,
        getPlatforms,
        getSeasonsBySerieId,
        getSerie,
        getSerieImages,
        getSeries,
        getSimilarsSeries
    }
}
