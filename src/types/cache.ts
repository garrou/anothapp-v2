import type { Serie } from "@/models/serie";
import type { User } from "@/models/user";

export type CacheRecordValue = { expires: number };
export type CacheRecordKey = IDBValidKey;

export type SeriesCacheItem = Serie & CacheRecordValue;

export type UserCacheItem = User & CacheRecordValue;