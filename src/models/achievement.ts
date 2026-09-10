export interface Achievement {

    code: string;

    name: string;

    value: number;

    league: number | null;

    subTier: number | null;

    unlockedAt?: string;

    nextLeague: number | null;

    nextSubTier: number | null;

    nextThreshold: number | null;

    progress: number;
}

export interface AchievementsResponse {

    achievements: Achievement[];
}
