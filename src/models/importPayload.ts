export interface ImportPayload {

    shows?: { seasons?: { episodes?: unknown[] }[] }[];

    playlists?: unknown[];

    favoriteActors?: unknown[];

    platforms?: unknown[];
}

export interface ImportPreview {

    shows: number;

    seasons: number;

    episodes: number;

    playlists: number;

    favoriteActors: number;

    platforms: number;
}
