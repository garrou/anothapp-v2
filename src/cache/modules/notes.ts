import type { NoteCacheItem } from "@/types/cache";
import type { IDBPDatabase } from "idb";
import CacheModule from "../cacheModule";
import { isError } from "@/utils/response";
import searchService from "@/services/searchService";
import type { Note } from "@/models/note";

export default class NotesCache extends CacheModule<NoteCacheItem> {
    static readonly NAME = "notes";

    constructor(db: IDBPDatabase) {
        super(db, NotesCache.NAME);
    }

    static createStructure(db: IDBPDatabase): void {
        db.createObjectStore(this.NAME);
    }

    async getNotes(): Promise<NoteCacheItem[]> {
        const storedNotes = await this.getAll();

        if (storedNotes.length) {
            return storedNotes.sort((a, b) => a.id - b.id);
        }
        const resp = await searchService.getNotes();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        data.forEach(async (note: Note) => {
            const cacheValue: NoteCacheItem = {
                expires: Date.now() + this.bigExpires,
                ...note
            }
            storedNotes.push(cacheValue);
            await this.putToCache(cacheValue, `${note.id}`);
        });
        return storedNotes;
    }
}