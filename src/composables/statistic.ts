import type { GlobalStat } from "@/models/stat";
import statService from "@/services/statService"
import { isError } from "@/utils/response";

export function useStatistic() {

    const getStats = async (userId?: string): Promise<GlobalStat> => {
        const resp = await statService.getStats(userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return {
        getStats
    }
}