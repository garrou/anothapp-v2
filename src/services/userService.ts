import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const PREFIX = "users";

const getUser = async (username: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/search`, {
        body: JSON.stringify({
            username
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    })
}

const getProfile = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/profile`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const updateImage = async (image: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        body: JSON.stringify({
            image
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    })
}

export default {
    getUser,
    getProfile,
    updateImage
};