import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";

const PREFIX = "settings";

const exportData = () => {
    return fetch(`${ENDPOINT}/${PREFIX}/export-data`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    exportData
}