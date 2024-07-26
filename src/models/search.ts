export interface  SerieSearchOptions {

    title?: string,
    
    kind?: string,

    platform?: string,
    
    id?: number
}

export interface SeasonSearchOptions {
    
    month?: number,
    
    serieId?: number,
    
    year?: number
}