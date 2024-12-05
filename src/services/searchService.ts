import { buildUrlWithParams } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const PREFIX = "search";

const getActor = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/persons/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getCharacters = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/shows/${id}/characters`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getKinds = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/kinds`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getPlatforms = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/platforms`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/shows/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSerieImages = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/shows/${id}/images`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeries = async (title?: string, kinds?: string, platforms?: string, limit?: number, year?: number): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}/shows`, [
        { name: "title", value: title },
        { name: "kinds", value: kinds },
        { name: "platforms", value: platforms },
        { name: "limit", value: limit },
        { name: "year", value: year }
    ]);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeasonsBySerieId = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/shows/${id}/seasons`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSimilarsSeries = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/shows/${id}/similars`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getImages = async (limit: number): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}/images`, [
        { name: "limit", value: limit }
    ]);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    getActor,
    getCharacters,
    getImages,
    getKinds,
    getPlatforms,
    getSeasonsBySerieId,
    getSerie,
    getSerieImages,
    getSeries,
    getSimilarsSeries,
}