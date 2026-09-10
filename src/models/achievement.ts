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

export interface AchievementTier {

    league: number;

    subTier: number;

    threshold: number;
}

export interface AchievementTiersResponse {

    tiers: Record<string, AchievementTier[]>;
}
