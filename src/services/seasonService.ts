import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";
import { buildUrl } from "@/utils/format";

const PREFIX = "seasons";

const deleteSeasonById = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        },
        method: "DELETE"
    });
}

const updateSeason = async (id: number, platformId: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}`, {
        body: JSON.stringify({
            "platform": platformId
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    });
}

const getSeasons = async (year?: number, month?: number): Promise<Response> => {
    const query = year ? "year" : "month";
    const url = buildUrl(`${ENDPOINT}/${PREFIX}`, query, year ?? month, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    deleteSeasonById,
    getSeasons,
    updateSeason
}