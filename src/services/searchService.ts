import { buildUrl } from "@/utils/format";
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

const getSeries = async (title?: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/${PREFIX}/shows`, "title", title, "?");
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

export default {
    getActor,
    getCharacters,
    getSeasonsBySerieId,
    getSerie,
    getSerieImages,
    getSeries,
    getSimilarsSeries,
}