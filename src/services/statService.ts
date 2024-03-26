import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";

const getStats = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/stats`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    getStats
};