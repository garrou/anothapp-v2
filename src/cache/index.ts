import { deleteDB, openDB, type IDBPDatabase } from "idb";
import SeriesCache from "./modules/series";
import UserSeriesCache from "./modules/userSeries";
import UserCache from "./modules/user";
import PlatformsCache from "./modules/platforms";
import KindsCache from "./modules/kinds";
import UserListCache from "./modules/userList";
import NotesCache from "./modules/notes";
import UserPlatformsCache from "./modules/userPlatforms";

export default new (class CacheManager {
    userSeries!: UserSeriesCache;
    series!: SeriesCache;
    users!: UserCache;
    platforms!: PlatformsCache;
    kinds!: KindsCache;
    notes!: NotesCache;
    userList!: UserListCache;
    userPlatforms!: UserPlatformsCache;

    readonly #name = "anothapp-cache";
    readonly #version = 1;

    async initialize() {
        let db: IDBPDatabase | undefined;

        db = await openDB(this.#name, this.#version, {
            upgrade(database, oldVersion) {
                if (oldVersion < 1) {
                    UserSeriesCache.createStructure(database);
                    SeriesCache.createStructure(database);
                    UserCache.createStructure(database);
                    PlatformsCache.createStructure(database);
                    KindsCache.createStructure(database);
                    UserListCache.createStructure(database);
                    NotesCache.createStructure(database);
                    UserPlatformsCache.createStructure(database);
                }
            },
            blocking() {
                db?.close();
            },
            blocked() {
                db?.close();
            }
        });
        this.userSeries = new UserSeriesCache(db);
        this.series = new SeriesCache(db);
        this.users = new UserCache(db);
        this.platforms = new PlatformsCache(db);
        this.kinds = new KindsCache(db);
        this.userList = new UserListCache(db);
        this.notes = new NotesCache(db);
        this.userPlatforms = new UserPlatformsCache(db);
    }

    async reset() {
        await deleteDB(this.#name);
    }
});