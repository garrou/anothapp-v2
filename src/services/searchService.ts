import { buildUrl } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const getSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/search/shows/${id}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeries = async (title?: string): Promise<Response> => {
    const url = buildUrl(`${ENDPOINT}/search/shows`, "title", title, "?");
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const getSeasonsBySerieId = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/search/shows/${id}/seasons`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    getSeasonsBySerieId,
    getSerie,
    getSeries,
}