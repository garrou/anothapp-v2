export interface EpisodeTimeline {

    showId: number;

    showTitle: string;

    showPoster?: string;

    watchedAt: string;

    platformId?: number;

    episode: {
        id: number;
        title: string;
        code: string;
        number: number;
        global: number;
    };
}
