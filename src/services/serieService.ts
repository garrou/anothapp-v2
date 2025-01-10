import { buildUrlWithParams } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";
import type { SerieStatus } from "@/types/types";

const PREFIX = "shows";

const addSeason = async (id: number, num: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${id}/seasons`, {
        body: JSON.stringify({
            id,
            num,
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const addSerie = async (id: number, inList: boolean): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}`, {
        body: JSON.stringify({
            "id": id,
            "list": inList
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const deleteSerie = async (id: number, list = false): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}/${id}`, [
        { name: "list", value: list }
    ]);
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

const getSeries = async (title?: string, platforms?: string, kinds?: string): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}`, [
        { name: "title", value: title },
        { name: "platforms", value: platforms },
        { name: "kinds", value: kinds }
    ]);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeriesByStatus = async (status: SerieStatus, friendId?: string): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}`, [
        { name: "status", value: status },
        { name: "friendId", value: friendId }
    ]);
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
