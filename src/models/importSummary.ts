export interface ImportCategorySummary {

    imported: number;

    errors: number;
}

export interface ImportSummary {

    shows: ImportCategorySummary;

    playlists: ImportCategorySummary;

    favoriteActors: ImportCategorySummary;

    platforms: ImportCategorySummary;

    errors: string[];
}
