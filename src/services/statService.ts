import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";
import { buildUrl } from "@/utils/format";
import type { ChartGroupedPeriod, ChartGroupedType, ChartTimeType } from "@/models/stat";

const PREFIX = "stats";

const getStats = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getGroupedCountByTypeByPeriod = async (type: ChartGroupedType, period: ChartGroupedPeriod | null, userId?: string): Promise<Response> => {
    const url = buildUrl(buildUrl(`${ENDPOINT}/${PREFIX}/grouped-count?type=${type}`, "period", period ?? ""), "id", userId);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getTimeByType = async (type: ChartTimeType, userId?: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/${PREFIX}/time?type=${type}`, "id", userId);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    getGroupedCountByTypeByPeriod,
    getStats,
    getTimeByType
};