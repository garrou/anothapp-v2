import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import type { Serie } from "@/models/serie";
import searchService from "@/services/searchService";
import type { SerieCacheItem } from "@/types/cache";

export default class SeriesCache extends CacheModule<SerieCacheItem> {
    static readonly NAME = "series";

    constructor(db: IDBPDatabase) {
        super(db, SeriesCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getSerieFromCache(id: number): Promise<SerieCacheItem | undefined> {
        return this.getFromCache(`${id}`);
    }

    async getSeries(): Promise<SerieCacheItem[]> {
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
            const cacheValue: SerieCacheItem = {
                expires: Date.now() + this.expires,
                ...serie
            }
            storedSeries.push(cacheValue);
            await this.putToCache(cacheValue, `${serie.id}`);
        });
        return storedSeries;
    }

    async getSerieById(id: number): Promise<SerieCacheItem> {
        let storedSerie = await this.getFromCache(`${id}`);
        if (storedSerie) {
            return storedSerie;
        }

        const resp = await searchService.getSerie(id);
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }

        const cacheValue: SerieCacheItem = {
            expires: Date.now() + this.expires,
            ...data
        }
        await this.putToCache(cacheValue, `${data.id}`);
        return cacheValue;
    }
}