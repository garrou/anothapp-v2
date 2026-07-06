import { ENDPOINT } from "@/constants/services";
import storageService from "./storageService";

const PREFIX = "platforms";

const getUserPlatforms = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "GET",
    })
}

const updateUserPlatforms = async (platformId: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}`, {
        body: JSON.stringify({
            platformId
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    })
}

const deleteUserPlatform = async (platformId: number): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/${platformId}`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "DELETE",
    })
}

export default {
    deleteUserPlatform,
    getUserPlatforms,
    updateUserPlatforms,
}