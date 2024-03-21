import { ENDPOINT } from "./constants";
import storageService from "./storageService";

const getSerie = async (id: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/search/shows/${id}`, {
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
}