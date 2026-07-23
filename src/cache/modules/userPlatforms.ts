import type { UserPlatformCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import platformService from "@/services/platformService";

export default class UserPlatformsCache extends CacheModule<UserPlatformCacheItem> {
    static readonly NAME = "userplatforms";

    constructor(db: IDBPDatabase) {
        super(db, UserPlatformsCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async addPlatform(platformId: number): Promise<void> {
        const resp = await platformService.updateUserPlatforms(platformId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        const cacheValue: UserPlatformCacheItem = {
            platformId,
            expires: Date.now() + this.expires,
        }
        await this.putToCache(cacheValue, `${platformId}`);
    }

    async deletePlatform(id: number): Promise<void> {
        const resp = await platformService.deleteUserPlatform(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        await this.deleteFromCache(`${id}`);
    }

    async getPlatforms(): Promise<UserPlatformCacheItem[]> {
        const storedPlatforms = await this.getAll();

        if (storedPlatforms.length) {
            return storedPlatforms;
        }
        const resp = await platformService.getUserPlatforms();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        await Promise.all(data.map(async (platformId: number) => {
            const cacheValue: UserPlatformCacheItem = {
                expires: Date.now() + this.expires,
                platformId
            };
            storedPlatforms.push(cacheValue);
            await this.putToCache(cacheValue, `${platformId}`);
        }));
        return storedPlatforms;
    }
}