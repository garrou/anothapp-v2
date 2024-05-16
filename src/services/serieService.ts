import { buildUrl } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";
import type { Season } from "@/models/season";
import type { Serie } from "@/models/serie";

const PREFIX = "shows";

const addSeason = async (serie: Serie, season: Season): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${serie.id}/seasons`, {
        body: JSON.stringify({
            "season": season,
            "show": serie,
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
            "duration": serie.duration
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const deleteSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}`, {
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

const getSeries = async (title?: string, kind?: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/${PREFIX}`, "title", title, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeriesByStatus = async (status: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/${PREFIX}`, "status", status, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const updateFavoriteBySerieId = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}`, {
        body: JSON.stringify({
            "favorite": "update"
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
    updateFavoriteBySerieId
}
