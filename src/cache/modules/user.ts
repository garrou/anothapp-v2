import type { UserCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import userService from "@/services/userService";
import type { User } from "@/models/user";

export default class UserCache extends CacheModule<UserCacheItem> {
    static readonly NAME = "users";

    constructor(db: IDBPDatabase) {
        super(db, UserCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async addUser(user: User): Promise<void> {
        const cacheValue: UserCacheItem = {
            expires: Date.now() + (60 * 60 * 1000),
            ...JSON.parse(JSON.stringify(user))
        }
        await this.putToCache(cacheValue, `${user.id}`);
    }

    async getProfile(): Promise<UserCacheItem> {
        const user = (await this.getAll()).filter((user) => user.current)?.[0];
        if (user) {
            return user;
        }

        const resp = await userService.getProfile();
        const data = await resp.json();
        if (isError(resp.status)) {
            throw new Error(data.message);
        }

        const cacheValue: UserCacheItem = {
            expires: Date.now() + (60 * 60 * 1000),
            ...data
        }
        await this.putToCache(cacheValue, `${data.id}`);
        return cacheValue;
    }
}