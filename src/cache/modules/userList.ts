import type { SerieCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import serieService from "@/services/serieService";
import { isError } from "@/utils/response";
import type { Serie } from "@/models/serie";

export default class UserListCache extends CacheModule<SerieCacheItem> {
    static readonly NAME = "userlist";

    constructor(db: IDBPDatabase) {
        super(db, UserListCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getSerieFromCache(id: number): Promise<SerieCacheItem | undefined> {
        return this.getFromCache(`${id}`);
    }

    async getSeriesInList(): Promise<SerieCacheItem[]> {
        const storedSeries = await this.getAll();
        if (storedSeries.length) {
            return storedSeries;
        }

        const resp = await serieService.getSeriesByStatus("not-started");
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

    async deleteSerie(id: number): Promise<void> {
        const resp = await serieService.deleteSerie(id, true);
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        await this.deleteFromCache(`${id}`);
    }

    async addSerie(serie: Serie): Promise<void> {
        const cacheValue: SerieCacheItem = {
            ...JSON.parse(JSON.stringify(serie)),
            expires: Date.now() + this.expires,
        }
        await this.putToCache(cacheValue, `${serie.id}`);
    }    
}