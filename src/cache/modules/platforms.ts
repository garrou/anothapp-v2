import type { PlatformCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import type { Platform, Serie } from "@/models/serie";
import searchService from "@/services/searchService";

export default class PlatformsCache extends CacheModule<PlatformCacheItem> {
    static readonly NAME = "platforms";

    constructor(db: IDBPDatabase) {
        super(db, PlatformsCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getPlatforms(): Promise<PlatformCacheItem[]> {
        const storedPlatforms = await this.getAll();

        if (storedPlatforms.length) {
            return storedPlatforms.sort((a, b) => a.name.localeCompare(b.name));
        }
        const resp = await searchService.getPlatforms();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        data.forEach(async (platform: Platform) => {
            const cacheValue: PlatformCacheItem = {
                expires: Date.now() + this.bigExpires,
                ...platform
            }
            storedPlatforms.push(cacheValue);
            await this.putToCache(cacheValue, `${platform.id}`);
        });
        return storedPlatforms;
    }
}