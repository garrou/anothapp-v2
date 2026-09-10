import type { Achievement } from "@/models/achievement";
import achievementService from "@/services/achievementService";
import { isError } from "@/utils/response";

export function useAchievement() {

    const getAchievements = async (): Promise<Achievement[]> => {
        const resp = await achievementService.getAchievements();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.achievements;
    }

    return { getAchievements };
}
