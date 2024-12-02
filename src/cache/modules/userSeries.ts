import type { SerieCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import serieService from "@/services/serieService";
import { isError } from "@/utils/response";
import type { Serie } from "@/models/serie";
import type { SerieSearchOptions } from "@/models/search";

export default class UserSeriesCache extends CacheModule<SerieCacheItem> {
    static readonly NAME = "userseries";

    constructor(db: IDBPDatabase) {
        super(db, UserSeriesCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getSerieFromCache(id: number): Promise<SerieCacheItem | undefined> {
        return this.getFromCache(`${id}`);
    }

    async addSerie(serie: Serie): Promise<void> {
        const cacheValue: SerieCacheItem = {
            ...JSON.parse(JSON.stringify(serie)),
            expires: Date.now() + this.expires,
        }
        await this.putToCache(cacheValue, `${serie.id}`);
    }

    async deleteSerie(id: number): Promise<void> {
        const resp = await serieService.deleteSerie(id);
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        await this.deleteFromCache(`${id}`);
    }

    async getSeries(options: SerieSearchOptions): Promise<SerieCacheItem[]> {
        const storedSeries = await this.getAll();
        if (storedSeries.length) {
            return this.filterSeries(storedSeries, options);
        }

        const resp = await serieService.getSeries();
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
        return this.filterSeries(storedSeries, options);
    }

    async getSerieById(id: number): Promise<SerieCacheItem> {
        const storedSerie = await this.getFromCache(`${id}`);
        if (storedSerie) {
            return storedSerie;
        }
        
        const resp = await serieService.getSerie(id);
        const data = await resp.json();
        if (isError(resp.status))
            throw new Error(data.message);

        const cacheValue: SerieCacheItem = {
            expires: Date.now() + this.expires,
            ...data
        }
        await this.putToCache(cacheValue, `${data.id}`);
        return cacheValue;
    }

    async getFavorites(): Promise<SerieCacheItem[]> {
        const storedSeries = await this.getAll();
        if (storedSeries.length) {
            return storedSeries
                .filter((serie) => serie.favorite)
                .sort((a, b) => a.title.localeCompare(b.title))
        } 
        const resp = await serieService.getSeriesByStatus("favorite");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    private filterSeries(series: SerieCacheItem[], options: SerieSearchOptions): SerieCacheItem[] {
        const { title, kinds } = options;
        let filteredSeries = series;

        if (title) {
            filteredSeries = series.filter((serie) => serie.title.toLowerCase().includes(title.trim().toLowerCase()));
        } else if (kinds) {
            filteredSeries = series.filter((serie) => kinds.every((kind) => serie.kinds.includes(kind)));
        }
        return filteredSeries.sort((a, b) => {
            const ad = a.addedAt ? new Date(a.addedAt).getTime() : 1;
            const bd = b.addedAt ? new Date(b.addedAt).getTime() : 2;
            return bd - ad;
        });
    }
}