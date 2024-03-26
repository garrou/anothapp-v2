import type { Stat } from "@/models/stat";
import statService from "@/services/statService"
import { isError } from "@/utils/response";

export function useStatistic() {

    const getStats = async (): Promise<Stat> => {
        const resp = await statService.getStats();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { getStats }
}