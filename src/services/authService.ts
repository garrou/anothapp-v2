import { ENDPOINT } from "../constants/services";
import storageService from "./storageService";

const PREFIX = "auth";

const checkAuth = async (): Promise<Response> => {
    return fetch(`${ENDPOINT}/${PREFIX}/me`, {
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
    login,
    register,
}