import { deleteDB, openDB } from "idb";
import SeriesCache from "./modules/series";
import UserSeriesCache from "./modules/userSeries";
import UserCache from "./modules/user";
import PlatformsCache from "./modules/platforms";
import KindsCache from "./modules/kinds";
import UserListCache from "./modules/userList";
import NotesCache from "./modules/notes";

export default new (class CacheManager {
    userSeries!: UserSeriesCache;
    series!: SeriesCache;
    users!: UserCache;
    platforms!: PlatformsCache;
    kinds!: KindsCache;
    notes!: NotesCache;
    userList!: UserListCache;

    readonly #name = "cache";
    readonly #version = 2;

    async initialize() {
        const db = await openDB(this.#name, this.#version, {
            upgrade(database, oldVersion) {
                if (oldVersion < 1) {
                    UserSeriesCache.createStructure(database);
                    SeriesCache.createStructure(database);
                    UserCache.createStructure(database);
                    PlatformsCache.createStructure(database);
                    KindsCache.createStructure(database);
                    UserListCache.createStructure(database);
                }
                if (oldVersion < 2) {
                    NotesCache.createStructure(database);
                }
            },
            blocking() {
                db.close();
            },
            blocked() {
                db.close();
            }
        });
        this.userSeries = new UserSeriesCache(db);
        this.series = new SeriesCache(db);
        this.users = new UserCache(db);
        this.platforms = new PlatformsCache(db);
        this.kinds = new KindsCache(db);
        this.userList = new UserListCache(db);
        this.notes = new NotesCache(db);
    }

    async reset() {
        await deleteDB(this.#name);
    }
});