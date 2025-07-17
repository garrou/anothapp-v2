import { buildUrlWithParams } from "@/utils/format";
import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const PREFIX = "users";

const getUsers = async (username: string): Promise<Response> => {
    const url = buildUrlWithParams(`${ENDPOINT}/${PREFIX}`, [
        { name: "username", value: username },
    ]);
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
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

const updateLogin = async (email: string, newEmail: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        body: JSON.stringify({
            email,
            newEmail
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    })
}

const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword
        }),
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
    })
}

export default {
    getUsers,
    getProfile,
    updateImage,
    updateLogin,
    updatePassword
};