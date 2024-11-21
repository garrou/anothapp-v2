import { buildUrl } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";
import type { Season } from "@/models/season";
import type { Serie } from "@/models/serie";
import type { SerieStatus } from "@/types/types";
import type { SerieSearchOptions } from "@/models/search";

const PREFIX = "shows";

const addSeason = async (serie: Serie, season: Season): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${serie.id}/seasons`, {
        body: JSON.stringify({
            "season": season,
            "serie": serie,
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const addSerie = async (serie: Serie): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}`, {
        body: JSON.stringify({
            "id": serie.id,
            "title": serie.title,
            "poster": serie.poster,
            "kinds": serie.kinds,
            "duration": serie.duration,
            "seasons": serie.seasons,
            "country": serie.country,
            "list": serie.list
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const deleteSerie = async (id: number, list = false): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/${PREFIX}/${id}`, "list", list, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        },
        method: "DELETE"
    });
}

const getSeasonsBySerieId = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}/seasons`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeasonInfosBySerieIdByNumber = async (id: number, num: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}/seasons/${num}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeries = async (options?: SerieSearchOptions): Promise<Response> => {
    const url = buildUrl(buildUrl(buildUrl(`${ENDPOINT}/${PREFIX}`, "title", options?.title, "?"), 
            "kind", options?.kinds?.[0], "?"), 
            "platform", options?.platforms?.[0], "?"
    );
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeriesByStatus = async (status: SerieStatus, friendId?: string): Promise<Response> => {
    const url = buildUrl(buildUrl(`${ENDPOINT}/${PREFIX}`, "status", status, "?"), "friendId", friendId);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const updateFieldBySerieId = async (id: number, field: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}`, {
        body: JSON.stringify({
            [field]: "update"
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH"
    });
}

export default {
    addSeason,
    addSerie,
    deleteSerie,
    getSeasonsBySerieId,
    getSeasonInfosBySerieIdByNumber,
    getSerie,
    getSeries,
    getSeriesByStatus,
    updateFieldBySerieId
}
