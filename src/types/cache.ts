import type { Serie } from "@/models/serie";

export type CacheRecordValue = { expires: number };
export type CacheRecordKey = IDBValidKey;

export type SeriesCacheItem = Serie & CacheRecordValue;