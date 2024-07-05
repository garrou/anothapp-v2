import { openDB } from "idb";
import SeriesCache from "./modules/series";
import UserSeriesCache from "./modules/userSeries";

export default new (class CacheManager {
    userSeries!: UserSeriesCache;
    series!: SeriesCache;

    readonly #name = "cache";
    readonly #version = 1;

    async initialize() {
        const db = await openDB(this.#name, this.#version, {
            upgrade(database, oldVersion) {
                if (oldVersion < 1) {
                    UserSeriesCache.createStructure(database);
                    SeriesCache.createStructure(database);
                }
            }
        });
        this.userSeries = new UserSeriesCache(db);
        this.series = new SeriesCache(db);
    }
});