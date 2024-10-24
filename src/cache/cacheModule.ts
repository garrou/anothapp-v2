import type { CacheRecordValue } from "@/types/cache";
import type { IDBPDatabase } from "idb";

export default abstract class CacheModule<V extends CacheRecordValue, K extends IDBValidKey = string> {
    protected readonly storeName: string;
    private db: IDBPDatabase;
    protected readonly expires = 1 * 60 * 60 * 1000;
    protected readonly bigExpires = this.expires * 24 * 31;

    protected constructor(db: IDBPDatabase, storeName: string) {
        this.db = db;
        this.storeName = storeName;
    }

    protected async getFromCache(key: K): Promise<V | undefined> {
        const result = await this.db.get(this.storeName, key);
        if (!result?.expires)
            return;
        return result.expires <= Date.now() ? undefined : result;
    }

    protected async getAll(): Promise<V[]> {
        const result = await this.db.getAll(this.storeName);
        return this.containsExpiredRecord(result) ? [] : result;
    }

    protected deleteFromCache(key: K): Promise<void> {
        return this.db.delete(this.storeName, key);
    }

    protected putToCache(value: V, key?: K): Promise<IDBValidKey> {
        return this.db.put(this.storeName, value, key);
    }

    private containsExpiredRecord(set: V[]): boolean {
        return !!set.find((record) => record.expires <= Date.now());
    }

    public clearCache(): Promise<void> {
        return this.db.clear(this.storeName);
    }
}
