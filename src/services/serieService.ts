import { buildUrl } from "@/utils/format";
import { ENDPOINT } from "./constants";
import storageService from "./storageService";
import { isSuccess } from "@/utils/response";
import type { Serie } from "@/models/internal/serie";
import type { Season } from "@/models/internal/season";

const getSeasonsBySerieId = async (id: number): Promise<Season[]> => {
    const resp = await fetch(`${ENDPOINT}/shows/${id}/seasons`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
    const data = await resp.json();

    if (isSuccess(resp.status))
        return data;
    
    throw new Error(data.message);
}

const getSeries = async (title?: string, kind?: string): Promise<Serie[]> => {
    const url = buildUrl(`${ENDPOINT}/shows`, "title", title, "?");
    const resp = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
    const data = await resp.json();

    if (isSuccess(resp.status))
        return data;
    
    throw new Error(data.message);
}

const updateFavoriteBySerieId = async (id: number): Promise<boolean> => {
    const resp = await fetch(`${ENDPOINT}/shows/${id}/favorite`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        },
        method: "PATCH"
    });
    const data = await resp.json();

    if (isSuccess(resp.status))
        return true;

    throw new Error(data.message);
}

export default {
    getSeasonsBySerieId,
    getSeries,
    updateFavoriteBySerieId
}
