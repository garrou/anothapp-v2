import type { SeriesCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import type { Serie } from "@/models/serie";
import searchService from "@/services/searchService";

export default class SeriesCache extends CacheModule<SeriesCacheItem> {
    static readonly NAME = "series";

    constructor(db: IDBPDatabase) {
        super(db, SeriesCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getSeries(): Promise<SeriesCacheItem[]> {
        const storedSeries = await this.getAll();
        if (storedSeries.length) {
            return storedSeries;
        }

        const resp = await searchService.getSeries();
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }

        const series: Serie[] = data;
        series.forEach(async (serie) => {
            const cacheValue: SeriesCacheItem = {
                expires: Date.now() + (60 * 60 * 1000),
                ...serie
            }
            storedSeries.push(cacheValue);
            await this.putToCache(cacheValue, `${serie.id}`);
        });
        return storedSeries;
    }

    async getSerieById(id: number): Promise<SeriesCacheItem> {
        let storedSerie = await this.getFromCache(`${id}`);
        if (storedSerie) {
            return storedSerie;
        }

        const resp = await searchService.getSerie(id);
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }

        const cacheValue: SeriesCacheItem = {
            expires: Date.now() + (60 * 60 * 1000),
            ...data
        }
        await this.putToCache(cacheValue, `${data.id}`);
        return cacheValue;
    }
}