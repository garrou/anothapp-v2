export interface ImportCategorySummary {

    imported: number;

    errors: number;
}

export interface ImportPlaylistsSummary extends ImportCategorySummary {

    skipped: number;
}

export interface ImportSummary {

    shows: ImportCategorySummary;

    playlists: ImportPlaylistsSummary;

    favoriteActors: ImportCategorySummary;

    platforms: ImportCategorySummary;

    errors: string[];
}
