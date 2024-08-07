import { openDB } from "idb";
import SeriesCache from "./modules/series";
import UserSeriesCache from "./modules/userSeries";
import UserCache from "./modules/user";
import PlatformsCache from "./modules/platforms";

export default new (class CacheManager {
    userSeries!: UserSeriesCache;
    series!: SeriesCache;
    users!: UserCache;
    platforms!: PlatformsCache;

    readonly #name = "cache";
    readonly #version = 1;

    async initialize() {
        const db = await openDB(this.#name, this.#version, {
            upgrade(database, oldVersion) {
                if (oldVersion < 1) {
                    UserSeriesCache.createStructure(database);
                    SeriesCache.createStructure(database);
                    UserCache.createStructure(database);
                    PlatformsCache.createStructure(database);
                }
            }
        });
        this.userSeries = new UserSeriesCache(db);
        this.series = new SeriesCache(db);
        this.users = new UserCache(db);
        this.platforms = new PlatformsCache(db);
    }
});