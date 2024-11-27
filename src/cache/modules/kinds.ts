import type { KindCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import type { Kind } from "@/models/serie";
import searchService from "@/services/searchService";

export default class KindsCache extends CacheModule<KindCacheItem> {
    static readonly NAME = "kinds";

    constructor(db: IDBPDatabase) {
        super(db, KindsCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getKinds(): Promise<KindCacheItem[]> {
        const storedKinds = await this.getAll();
        if (storedKinds.length) {
            return storedKinds.sort((a, b) => a.name.localeCompare(b.name));
        }

        const resp = await searchService.getKinds();
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }

        const kinds: Kind[] = data;
        kinds.forEach(async (kind, index) => {
            const cacheValue: KindCacheItem = {
                expires: Date.now() + this.bigExpires,
                ...kind
            }
            storedKinds.push(cacheValue);
            await this.putToCache(cacheValue, `${index}`);
        });
        return storedKinds;
    }
}