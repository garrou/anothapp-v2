export type SerieSearchOptions = {
    refresh?: boolean,
    title?: string,
    kind?: string,
    id?: number
}

export type SeasonSearchOptions = {
    refresh?: boolean,
    serieId: number
}