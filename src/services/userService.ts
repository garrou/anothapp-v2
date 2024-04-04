import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const PREFIX = "users";

const checkAuth = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

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

const login = async (identifier: string, password: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/login`, {
        body: JSON.stringify({
            identifier,
            password
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

const register = async (email: string, password: string, confirm: string, username: string): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/register`, {
        body: JSON.stringify({
            email,
            confirm,
            username,
            password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });
}

export default {
    checkAuth,
    getUser,
    getProfile,
    login,
    register,
}