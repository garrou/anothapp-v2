import { buildUrl } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";
import type { Season } from "@/models/season";
import type { Serie } from "@/models/serie";

const addSeason = async (id: number, season: Season): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows/${id}/seasons`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(season)
    });
}

const addSerie = async (serie: Serie): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "id": serie.id,
            "title": serie.title,
            "poster": serie.poster,
            "kinds": serie.kinds,
            "duration": serie.duration
        })
    }); 
}

const deleteSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        },
        method: "DELETE"
    });
}

const getSeasonsBySerieId = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows/${id}/seasons`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeasonInfosBySerieIdByNumber = async (id: number, num: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows/${id}/seasons/${num}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeries = async (title?: string, kind?: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/shows`, "title", title, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeriesByStatus = async (status: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/shows`, "status", status, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const updateFavoriteBySerieId = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/shows/${id}/favorite`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
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
