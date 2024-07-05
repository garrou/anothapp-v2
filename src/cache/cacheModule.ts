import type { CacheRecordValue } from "@/types/cache";
import type { IDBPDatabase } from "idb";

export default abstract class CacheModule<V extends CacheRecordValue, K extends IDBValidKey = string> {
    protected readonly storeName: string;
    private db: IDBPDatabase;

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

    protected getAll(): Promise<V[]> {
        return this.db.getAll(this.storeName);
    }

    protected deleteFromCache(key: K): Promise<void> {
        return this.db.delete(this.storeName, key);
    }

    protected putToCache(value: V, key?: K): Promise<IDBValidKey> {
        return this.db.put(this.storeName, value, key);
    }
}