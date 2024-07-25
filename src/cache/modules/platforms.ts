import type { PlatformsCacheItem, SeriesCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import type { Platform, Serie } from "@/models/serie";
import searchService from "@/services/searchService";

export default class PlatformsCache extends CacheModule<PlatformsCacheItem> {
    static readonly NAME = "platforms";

    constructor(db: IDBPDatabase) {
        super(db, PlatformsCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getPlatforms(): Promise<PlatformsCacheItem[]> {
        const storedPlatforms = await this.getAll();
        if (storedPlatforms.length) {
            return storedPlatforms.sort((a, b) => a.name.localeCompare(b.name));
        }

        const resp = await searchService.getPlatforms();
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }

        const platforms: Platform[] = data;
        platforms.forEach(async (platform) => {
            const cacheValue: PlatformsCacheItem = {
                expires: Date.now() + this.expires,
                ...platform
            }
            storedPlatforms.push(cacheValue);
            await this.putToCache(cacheValue, `${platform.id}`);
        });
        return storedPlatforms;
    }
}