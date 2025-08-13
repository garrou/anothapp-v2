import type { Note } from "@/models/note";
import type { Kind, Platform, Serie } from "@/models/serie";
import type { User } from "@/models/user";

export type CacheRecordValue = { expires: number };
export type CacheRecordKey = IDBValidKey;

export type SerieCacheItem = Serie & CacheRecordValue;

export type UserCacheItem = User & CacheRecordValue;

export type PlatformCacheItem = Platform & CacheRecordValue;

export type KindCacheItem = Kind & CacheRecordValue;

export type NoteCacheItem = Note & CacheRecordValue;