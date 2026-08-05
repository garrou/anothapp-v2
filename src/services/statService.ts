import httpClient from "./httpClient";
import type { ChartGroupedPeriod, ChartGroupedType, ChartTimeType } from "@/types/types";

const PREFIX = "stats";

const getStats = (userId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "id", value: userId }]);

const getGroupedCountByTypeByPeriod = (type: ChartGroupedType, period?: ChartGroupedPeriod, userId?: string, limit?: number): Promise<Response> =>
    httpClient.get(`${PREFIX}/grouped-count`, [
        { name: "type", value: type },
        { name: "period", value: period },
        { name: "id", value: userId },
        { name: "limit", value: limit }
    ]);

const getTimeByType = (type: ChartTimeType, userId?: string): Promise<Response> =>
    httpClient.get(`${PREFIX}/time`, [
        { name: "type", value: type },
        { name: "id", value: userId }
    ]);

export default {
    getGroupedCountByTypeByPeriod,
    getStats,
    getTimeByType
};
