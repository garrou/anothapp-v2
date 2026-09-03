export interface SerieSearchOptions {

    title?: string,
    
    kinds?: string[],

    notes?: number[],

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

    type: "userseries" | "series" | "userlist"
}