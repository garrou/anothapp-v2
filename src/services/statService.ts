import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";
import { buildUrlWithParams } from "@/utils/format";
import type { ChartGroupedPeriod, ChartGroupedType, ChartTimeType } from "@/types/types";

const PREFIX = "stats";

const getStats = async (userId?: string): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}`, [
        { name: "id", value: userId }
    ]);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getGroupedCountByTypeByPeriod = async (type: ChartGroupedType, period?: ChartGroupedPeriod, userId?: string, limit?: number): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}/grouped-count`, [
        { name: "type", value: type },
        { name: "period", value: period },
        { name: "id", value: userId },
        { name: "limit", value: limit }
    ]);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getTimeByType = async (type: ChartTimeType, userId?: string): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}/time`, [
        { name: "type", value: type },
        { name: "id", value: userId }
    ]);
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