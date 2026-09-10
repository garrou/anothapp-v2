import type { Achievement, AchievementTier } from "@/models/achievement";
import achievementService from "@/services/achievementService";
import { isError } from "@/utils/response";

export function useAchievement() {

    const getAchievements = async (userId?: string): Promise<Achievement[]> => {
        const resp = await achievementService.getAchievements(userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.achievements;
    }

    const getTiers = async (): Promise<Record<string, AchievementTier[]>> => {
        const resp = await achievementService.getTiers();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.tiers;
    }

    return { getAchievements, getTiers };
}
