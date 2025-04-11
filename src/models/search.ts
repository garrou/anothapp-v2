import type SeriesCache from "@/cache/modules/series"
import type UserListCache from "@/cache/modules/userList"
import type UserSeriesCache from "@/cache/modules/userSeries"

export interface SerieSearchOptions {

    title?: string,
    
    kinds?: string[],

    platforms?: string[],

    countries?: string[],
    
    id?: number,

    limit?: number,

    year?: number
}

export interface SeasonSearchOptions {
    
    month?: number,
    
    serieId?: number,
    
    year?: number
}

export interface CacheSearchOptions {

    type: typeof UserSeriesCache.NAME | typeof SeriesCache.NAME | typeof UserListCache.NAME
}