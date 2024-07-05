import type { SeriesCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import serieService from "@/services/serieService";
import { isError } from "@/utils/response";
import type { Serie } from "@/models/serie";
import type { SerieSearchOptions } from "@/models/search";

export default class UserSeriesCache extends CacheModule<SeriesCacheItem> {
    static readonly NAME = "userseries";

    constructor(db: IDBPDatabase) {
        super(db, UserSeriesCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async deleteSerie(id: number): Promise<void> {
        const resp = await serieService.deleteSerie(id);
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        await this.deleteFromCache(`${id}`);
    }

    async getSeries(options: SerieSearchOptions): Promise<SeriesCacheItem[]> {
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
            const cacheValue: SeriesCacheItem = {
                expires: Date.now() + (60 * 60 * 1000),
                ...serie
            }
            storedSeries.push(cacheValue);
            await this.putToCache(cacheValue, `${serie.id}`);
        });
        return this.filterSeries(storedSeries, options);
    }

    async getSerieById(id: number): Promise<SeriesCacheItem> {
        let storedSerie = await this.getFromCache(`${id}`);
        if (storedSerie) {
            return storedSerie;
        }
        
        const resp = await serieService.getSerie(id, true);
        const data = await resp.json();
        if (isError(resp.status))
            throw new Error(data.message);

        const cacheValue: SeriesCacheItem = {
            expires: Date.now() + (60 * 60 * 1000),
            ...data
        }
        await this.putToCache(cacheValue, `${data.id}`);
        return cacheValue;
    }

    private filterSeries = (series: SeriesCacheItem[], options: SerieSearchOptions): SeriesCacheItem[] => {
        const { title, kind } = options;

        if (title) {
            return series.filter((serie) => serie.title.toLowerCase().includes(title.toLowerCase()));
        } else if (kind) {
            return series.filter((serie) => serie.kinds.includes(kind));
        }
        return series.sort((a, b) => {
            const ad = a.addedAt ? new Date(a.addedAt).getTime() : 1;
            const bd = b.addedAt ? new Date(b.addedAt).getTime() : 2;
            return bd - ad;
        });
    }
}